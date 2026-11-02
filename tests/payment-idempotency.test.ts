import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { eq } from 'drizzle-orm';

// Isolated SQLite database; no application modules load before the env is set.
const directory = await mkdtemp(join(tmpdir(), 'shipany-payment-test-'));
Object.assign(process.env, {
  DATABASE_PROVIDER: 'sqlite',
  DATABASE_URL: `file:${directory}/test.db`,
  AUTH_SECRET: 'isolated-payment-test-secret-not-a-real-credential',
  NODE_ENV: 'test',
  VITE_APP_URL: 'http://localhost:3000',
});
execFileSync(
  process.execPath,
  [
    'node_modules/drizzle-kit/bin.cjs',
    'push',
    '--dialect=sqlite',
    '--schema=./src/config/db/schema.sqlite.ts',
    `--url=${process.env.DATABASE_URL}`,
    '--force',
  ],
  { stdio: 'pipe', env: process.env }
);
const { db } = await import('../src/core/db');
const { credit, order, subscription, user } =
  await import('../src/config/db/schema');
const { handleCheckoutSuccess, handleSubscriptionRenewal } =
  await import('../src/modules/payment/service');
// settleCheckoutOrder 已不在本项目的 payment service 中；结算入口为 handleCheckoutSuccess(session, provider)，
// 它按 session 自行查找订单，这里保留旧调用形状以便测试编译（传入的订单对象不再使用）
const settleCheckoutOrder = (_order: unknown, session: any, provider: string) =>
  handleCheckoutSuccess(session, provider);

after(async () => {
  await rm(directory, { recursive: true, force: true });
});

const userId = 'user-1';
await db()
  .insert(user)
  .values({ id: userId, name: 'Buyer', email: 'buyer@example.test' });

async function createOrder(orderNo: string, sessionId: string) {
  await db()
    .insert(order)
    .values({
      id: `id-${orderNo}`,
      orderNo,
      userId,
      userEmail: 'buyer@example.test',
      status: 'created',
      amount: 2900,
      currency: 'usd',
      productId: 'pro_monthly',
      paymentType: 'subscription',
      paymentProvider: 'stripe',
      paymentSessionId: sessionId,
      checkoutInfo: '{}',
      creditsAmount: 1000,
      creditsValidDays: 30,
    });
}

const DAY = 86_400_000;
function checkoutSession(sessionId: string, status = 'paid') {
  const start = new Date('2026-10-01T00:00:00Z');
  return {
    paymentStatus: status,
    paymentResult: { id: sessionId },
    paymentInfo: { transactionId: `pi_${sessionId}`, paidAt: start },
    subscriptionId: `sub_${sessionId}`,
    subscriptionResult: {},
    subscriptionInfo: {
      status: 'active',
      amount: 2900,
      currency: 'usd',
      interval: 'month',
      intervalCount: 1,
      currentPeriodStart: start,
      currentPeriodEnd: new Date(start.getTime() + 30 * DAY),
    },
  };
}

async function readOrder(orderNo: string) {
  const [row] = await db()
    .select()
    .from(order)
    .where(eq(order.orderNo, orderNo));
  return row;
}

// Local SQLite can't run two write transactions at once (the second gets
// SQLITE_BUSY), so replay the race deterministically: every request read the
// order while it was still unpaid, then settles from that stale snapshot.
test('webhook and callback racing on one order grant credits and create the subscription once', async () => {
  await createOrder('ORD-RACE', 'cs_race');
  const stale = await readOrder('ORD-RACE');
  assert.equal(stale.status, 'created');

  for (let i = 0; i < 3; i++) {
    await settleCheckoutOrder(stale, checkoutSession('cs_race'), 'stripe');
  }

  const row = await readOrder('ORD-RACE');
  assert.equal(row.status, 'paid');
  assert.ok(row.subscriptionNo, 'order links to its subscription');
  const credits = await db()
    .select()
    .from(credit)
    .where(eq(credit.orderNo, 'ORD-RACE'));
  assert.equal(credits.length, 1);
  assert.equal(credits[0].credits, 1000);
  const subs = await db()
    .select()
    .from(subscription)
    .where(eq(subscription.subscriptionId, 'sub_cs_race'));
  assert.equal(subs.length, 1);
  assert.equal(subs[0].subscriptionNo, row.subscriptionNo);
});

test('a late failure event from a stale read never downgrades a paid order', async () => {
  const stale = { ...(await readOrder('ORD-RACE')), status: 'created' };
  await settleCheckoutOrder(
    stale,
    checkoutSession('cs_race', 'failed'),
    'stripe'
  );
  assert.equal((await readOrder('ORD-RACE')).status, 'paid');
});

test('duplicate renewal deliveries for one period create one renewal order and one grant', async () => {
  const [sub] = await db()
    .select()
    .from(subscription)
    .where(eq(subscription.subscriptionId, 'sub_cs_race'));
  const nextStart = new Date(sub.currentPeriodEnd!.getTime());
  const renewal = (transactionId: string) => ({
    paymentStatus: 'paid',
    paymentResult: { id: 'in_renew' },
    // Providers report the period this payment pays for (see billingPeriodStart).
    paymentInfo: {
      transactionId,
      paidAt: nextStart,
      billingPeriodStart: nextStart,
    },
    subscriptionId: 'sub_cs_race',
    subscriptionInfo: {
      currentPeriodStart: nextStart,
      currentPeriodEnd: new Date(nextStart.getTime() + 30 * DAY),
    },
  });
  // The same invoice delivered twice (retry), then again under a different
  // event/transaction id — which slips past the transactionId check.
  await handleSubscriptionRenewal(renewal('pi_renew_1'), 'stripe');
  await handleSubscriptionRenewal(renewal('pi_renew_1'), 'stripe');
  await handleSubscriptionRenewal(renewal('pi_renew_1b'), 'stripe');

  const renewals = await db()
    .select()
    .from(order)
    .where(eq(order.paymentType, 'renew'));
  assert.equal(renewals.length, 1);
  const grants = await db()
    .select()
    .from(credit)
    .where(eq(credit.orderNo, renewals[0].orderNo));
  assert.equal(grants.length, 1);
  const [updated] = await db()
    .select()
    .from(subscription)
    .where(eq(subscription.subscriptionId, 'sub_cs_race'));
  assert.equal(updated.currentPeriodStart!.getTime(), nextStart.getTime());

  // The following period still renews normally.
  const later = new Date(nextStart.getTime() + 30 * DAY);
  await handleSubscriptionRenewal(
    {
      ...renewal('pi_renew_2'),
      paymentInfo: {
        transactionId: 'pi_renew_2',
        paidAt: later,
        billingPeriodStart: later,
      },
      subscriptionInfo: {
        currentPeriodStart: later,
        currentPeriodEnd: new Date(later.getTime() + 30 * DAY),
      },
    },
    'stripe'
  );
  const all = await db()
    .select()
    .from(order)
    .where(eq(order.paymentType, 'renew'));
  assert.equal(all.length, 2);
});

test('a late period-N payment after period N+1 started keeps both periods', async () => {
  const subscriptionNo = 'SUB-LATE';
  const subscriptionId = 'sub_late';
  const p0 = new Date('2030-01-01T00:00:00Z');
  const p1 = new Date('2030-02-01T00:00:00Z');
  const p2 = new Date('2030-03-01T00:00:00Z');
  const p3 = new Date('2030-04-01T00:00:00Z');
  await db().insert(subscription).values({
    id: subscriptionNo,
    subscriptionNo,
    userId,
    status: 'active',
    paymentProvider: 'stripe',
    subscriptionId,
    amount: 2900,
    currency: 'usd',
    creditsAmount: 500,
    creditsValidDays: 30,
    currentPeriodStart: p0,
    currentPeriodEnd: p1,
  });
  // Stripe-like: the subscription info is read when the webhook is processed,
  // so by then it already shows period N+1 (p2..p3) for both payments.
  const payment = (transactionId: string, billingPeriodStart: Date) => ({
    paymentStatus: 'paid',
    paymentResult: { id: transactionId },
    paymentInfo: { transactionId, paidAt: p2, billingPeriodStart },
    subscriptionId,
    subscriptionInfo: { currentPeriodStart: p2, currentPeriodEnd: p3 },
  });
  const renewalsOf = () =>
    db().select().from(order).where(eq(order.subscriptionNo, subscriptionNo));

  await handleSubscriptionRenewal(payment('in_n1', p2), 'stripe'); // N+1
  await handleSubscriptionRenewal(payment('in_n', p1), 'stripe'); // late N
  let renewals = await renewalsOf();
  assert.equal(renewals.length, 2, 'period N and N+1 each get an order');
  const grantsOf = async () =>
    (
      await Promise.all(
        renewals.map((r: { orderNo: string }) =>
          db().select().from(credit).where(eq(credit.orderNo, r.orderNo))
        )
      )
    ).flat();
  let grants = await grantsOf();
  assert.equal(grants.length, 2);
  assert.ok(
    grants.every(
      (g) => g.credits === 500 && g.expiresAt!.getTime() >= p3.getTime()
    ),
    'the late period still grants usable credits'
  );

  // Replays of either payment (same id, or a new event id for the same
  // period) create nothing.
  await handleSubscriptionRenewal(payment('in_n', p1), 'stripe');
  await handleSubscriptionRenewal(payment('in_n1', p2), 'stripe');
  await handleSubscriptionRenewal(payment('evt_n_retry', p1), 'stripe');
  await handleSubscriptionRenewal(payment('evt_n1_retry', p2), 'stripe');
  renewals = await renewalsOf();
  assert.equal(renewals.length, 2);
  grants = await grantsOf();
  assert.equal(grants.length, 2);

  const [sub] = await db()
    .select()
    .from(subscription)
    .where(eq(subscription.subscriptionNo, subscriptionNo));
  assert.equal(sub.currentPeriodStart!.getTime(), p2.getTime());
});

test('a late payment for an earlier period never moves the subscription back', async () => {
  const [sub] = await db()
    .select()
    .from(subscription)
    .where(eq(subscription.subscriptionNo, 'SUB-LATE'));
  const p1 = new Date('2030-02-01T00:00:00Z');
  // Waffo-like: the event carries its own (earlier) period snapshot.
  await handleSubscriptionRenewal(
    {
      paymentStatus: 'paid',
      paymentResult: { id: 'evt_old' },
      paymentInfo: {
        transactionId: 'evt_old',
        billingPeriodStart: new Date('2030-01-15T00:00:00Z'),
      },
      subscriptionId: 'sub_late',
      subscriptionInfo: {
        currentPeriodStart: new Date('2030-01-15T00:00:00Z'),
        currentPeriodEnd: p1,
      },
    },
    'stripe'
  );
  const [after] = await db()
    .select()
    .from(subscription)
    .where(eq(subscription.subscriptionNo, 'SUB-LATE'));
  assert.equal(
    after.currentPeriodStart!.getTime(),
    sub.currentPeriodStart!.getTime()
  );
  assert.equal(
    after.currentPeriodEnd!.getTime(),
    sub.currentPeriodEnd!.getTime()
  );
});
