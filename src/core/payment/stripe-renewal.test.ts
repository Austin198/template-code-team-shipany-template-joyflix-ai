import { describe, expect, it } from 'vitest';

import { StripeProvider } from './stripe';
import { SubscriptionCycleType } from './types';

/** A renewal invoice is keyed by its own billed period, not "now". */
function provider() {
  const p = Object.create(StripeProvider.prototype) as any;
  // The live subscription is already in a later period when this runs.
  p.client = {
    subscriptions: {
      retrieve: async (id: string) => ({ id, items: { data: [] } }),
    },
  };
  p.buildSubscriptionInfo = async () => ({
    currentPeriodStart: new Date('2026-12-01T00:00:00Z'),
    currentPeriodEnd: new Date('2027-01-01T00:00:00Z'),
  });
  return p;
}

const sec = (iso: string) => Date.parse(iso) / 1000;
const invoice = (lines: any[]) => ({
  id: 'in_1',
  billing_reason: 'subscription_cycle',
  // Stripe's invoice.period_* is the previous period on a cycle invoice.
  period_start: sec('2026-10-01T00:00:00Z'),
  amount_paid: 900,
  currency: 'usd',
  created: sec('2026-11-20T00:00:00Z'),
  lines: { data: lines },
});
const line = (start: string, extra: Record<string, any> = {}) => ({
  subscription: 'sub_1',
  period: { start: sec(start), end: sec('2026-12-01T00:00:00Z') },
  ...extra,
});

describe('Stripe renewal billingPeriodStart', () => {
  it("uses the invoice line's period, not the live subscription period", async () => {
    const s = await provider().buildPaymentSessionFromInvoice(
      invoice([line('2026-11-01T00:00:00Z')])
    );
    expect(s.paymentInfo.subscriptionCycleType).toBe(
      SubscriptionCycleType.RENEWAL
    );
    expect(s.paymentInfo.billingPeriodStart.toISOString()).toBe(
      '2026-11-01T00:00:00.000Z'
    );
  });

  it('picks the renewed period over earlier proration lines', async () => {
    const s = await provider().buildPaymentSessionFromInvoice(
      invoice([
        line('2026-10-15T00:00:00Z', { proration: true }),
        line('2026-11-01T00:00:00Z'),
      ])
    );
    expect(s.paymentInfo.billingPeriodStart.toISOString()).toBe(
      '2026-11-01T00:00:00.000Z'
    );
  });

  it('leaves it unset without subscription lines', async () => {
    const s = await provider().buildPaymentSessionFromInvoice(
      invoice([{ period: { start: sec('2026-11-01T00:00:00Z') } }])
    );
    expect(s.paymentInfo.billingPeriodStart).toBeUndefined();
  });
});
