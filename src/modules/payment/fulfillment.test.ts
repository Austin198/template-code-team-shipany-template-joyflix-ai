import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PaymentStatus } from '@/core/payment/types';

/**
 * Fake DB without row locks (like D1/SQLite): reads return snapshots, and
 * the conditional UPDATEs are emulated by their intent so concurrent calls
 * interleave the way they would on D1.
 */
const state = vi.hoisted(() => ({
  orders: [] as Record<string, any>[],
  credits: [] as Record<string, any>[],
}));

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

vi.mock('@/core/db', async () => {
  const schema = await import('@/config/db/schema');
  const fake: any = {
    transaction: async (fn: any) => fn(fake), // D1 shim: fn(db)
    select: () => {
      let table: any;
      const q: any = {
        from: (t: any) => {
          table = t;
          return q;
        },
        where: () => q,
        for: () => q,
        limit: async () => {
          await tick();
          if (table === schema.order) {
            return state.orders.map((row) => ({ ...row }));
          }
          if (table === schema.credit) {
            return state.credits.filter((c) => c.transactionType === 'grant');
          }
          return [];
        },
      };
      return q;
    },
    update: (table: any) => ({
      set: (values: Record<string, any>) => ({
        where: async () => {
          await tick();
          if (table !== schema.order) return { rowsAffected: 0 };
          const row = state.orders[0];
          // claim created/pending → paid
          if (values.status === 'paid') {
            if (!['created', 'pending'].includes(row.status)) {
              return { rowsAffected: 0 };
            }
            Object.assign(row, values);
            return { rowsAffected: 1 };
          }
          Object.assign(row, values);
          return { rowsAffected: 1 };
        },
      }),
    }),
    insert: (table: any) => ({
      values: (values: Record<string, any>) => ({
        onConflictDoNothing: async () => {
          await tick();
          if (table !== schema.credit) return { rowsAffected: 0 };
          if (
            state.credits.some((c) => c.transactionNo === values.transactionNo)
          ) {
            return { rowsAffected: 0 };
          }
          state.credits.push(values);
          return { rowsAffected: 1 };
        },
      }),
    }),
  };
  // config/service reads these at import time.
  return {
    db: () => fake,
    isCloudflareWorker: false,
    hasDatabaseConfigured: () => true,
  };
});

const { handleCheckoutSuccess, renewalOrderIdFor } = await import('./service');

const baseOrder = {
  id: 'o1',
  orderNo: 'ORD-1',
  status: 'created',
  amount: 999,
  currency: 'usd',
  paymentType: 'one-time',
  paymentProvider: 'stripe',
  paymentSessionId: 'cs_1',
  creditsAmount: 100,
  creditsValidDays: 30,
  userId: 'u1',
  userEmail: 'a@b.c',
  subscriptionNo: null,
  deletedAt: null,
};

const paidSession = {
  paymentStatus: PaymentStatus.SUCCESS,
  paymentResult: { id: 'cs_1' },
  paymentInfo: {
    paymentAmount: 999,
    paymentCurrency: 'usd',
    transactionId: 'cs_1',
  },
};

beforeEach(() => {
  state.orders = [{ ...baseOrder }];
  state.credits = [];
});

describe('handleCheckoutSuccess claim-first', () => {
  it('fulfills once: marks paid and grants credits once', async () => {
    await handleCheckoutSuccess(paidSession, 'stripe');
    expect(state.orders[0].status).toBe('paid');
    expect(state.credits).toHaveLength(1);
    expect(state.credits[0]).toMatchObject({
      orderNo: 'ORD-1',
      transactionNo: 'grant-ORD-1',
      credits: 100,
    });
  });

  it('concurrent webhook + callback grant credits only once', async () => {
    await Promise.all([
      handleCheckoutSuccess(paidSession, 'stripe'),
      handleCheckoutSuccess(paidSession, 'stripe'),
      handleCheckoutSuccess(paidSession, 'stripe'),
    ]);
    expect(state.orders[0].status).toBe('paid');
    expect(state.credits).toHaveLength(1);
  });

  it('backfills a paid order missing its grant, once', async () => {
    state.orders = [{ ...baseOrder, status: 'paid' }];
    await Promise.all([
      handleCheckoutSuccess(paidSession, 'stripe'),
      handleCheckoutSuccess(paidSession, 'stripe'),
    ]);
    expect(state.credits).toHaveLength(1);
  });

  it('does not grant again when the paid order already has a grant', async () => {
    state.orders = [{ ...baseOrder, status: 'paid' }];
    state.credits = [
      { orderNo: 'ORD-1', transactionType: 'grant', transactionNo: 'legacy' },
    ];
    await handleCheckoutSuccess(paidSession, 'stripe');
    expect(state.credits).toHaveLength(1);
  });

  it('does not touch abnormal orders', async () => {
    state.orders = [{ ...baseOrder, status: 'abnormal' }];
    await handleCheckoutSuccess(paidSession, 'stripe');
    expect(state.orders[0].status).toBe('abnormal');
    expect(state.credits).toHaveLength(0);
  });
});

describe('renewalOrderIdFor', () => {
  const base = {
    provider: 'stripe',
    subscriptionNo: 'sub_1',
    billingPeriodStart: new Date('2026-11-01T00:00:00Z'),
    // The subscription's current period at processing time: never the key
    // while the payment's own period or a transaction id is known.
    currentPeriodStart: new Date('2026-12-01T00:00:00Z'),
  };

  it("keys by the payment's own period, even under a new transaction id", () => {
    const a = renewalOrderIdFor({ ...base, transactionId: 'in_1' });
    expect(renewalOrderIdFor({ ...base, transactionId: 'evt_2' })).toBe(a);
    expect(
      renewalOrderIdFor({
        ...base,
        billingPeriodStart: '2026-11-01T00:00:00.000Z',
        currentPeriodStart: new Date('2027-01-01T00:00:00Z'),
      })
    ).toBe(a);
  });

  it('a late period-N payment and period N+1 get different keys', () => {
    const late = renewalOrderIdFor({ ...base, transactionId: 'in_n' });
    const next = renewalOrderIdFor({
      ...base,
      transactionId: 'in_n1',
      billingPeriodStart: new Date('2026-12-01T00:00:00Z'),
    });
    expect(late).not.toBe(next);
  });

  it('without its own period, falls back to the transaction id', () => {
    const a = renewalOrderIdFor({
      ...base,
      billingPeriodStart: undefined,
      transactionId: 'in_1',
    });
    expect(
      renewalOrderIdFor({
        ...base,
        billingPeriodStart: 'not a date',
        currentPeriodStart: new Date('2027-01-01T00:00:00Z'),
        transactionId: 'in_1',
      })
    ).toBe(a);
    expect(
      renewalOrderIdFor({
        ...base,
        billingPeriodStart: undefined,
        transactionId: 'in_2',
      })
    ).not.toBe(a);
  });

  it('with neither, uses the current period; with nothing, throws', () => {
    const a = renewalOrderIdFor({ ...base, billingPeriodStart: undefined });
    expect(
      renewalOrderIdFor({
        ...base,
        billingPeriodStart: null,
        transactionId: null,
        currentPeriodStart: '2026-12-01T00:00:00.000Z',
      })
    ).toBe(a);
    expect(
      renewalOrderIdFor({
        ...base,
        billingPeriodStart: undefined,
        subscriptionNo: 'sub_2',
      })
    ).not.toBe(a);
    expect(
      renewalOrderIdFor({
        ...base,
        billingPeriodStart: undefined,
        provider: 'creem',
      })
    ).not.toBe(a);
    expect(() =>
      renewalOrderIdFor({
        ...base,
        billingPeriodStart: undefined,
        currentPeriodStart: '',
      })
    ).toThrow();
  });
});
