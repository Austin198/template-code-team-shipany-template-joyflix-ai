/**
 * Authoritative pricing catalog.
 *
 * The checkout API uses this as the SOURCE OF TRUTH for price/credits/duration.
 * Any price, credits, or plan info sent by the client is IGNORED — only the
 * product_id is honored, and everything else is looked up here.
 *
 * To change pricing, edit this file and redeploy. Admin UI cannot alter prices.
 */

import { PaymentInterval, PaymentType } from '@/core/payment/types';

export type PricingPlanInfo = {
  name: string;
  interval: PaymentInterval;
  intervalCount: number;
};

export type PricingProduct = {
  productId: string;
  productName: string;
  planName: string;
  description: string;
  type: PaymentType;
  priceInCents: number;
  currency: string;
  /**
   * Price in fen for CNY-only providers (Alipay, WeChat Pay) when `currency`
   * isn't CNY. Without it those providers refuse the product — the amount is
   * never reused across currencies.
   */
  cnyPriceInCents?: number;
  credits: number;
  creditsValidDays?: number;
  plan?: PricingPlanInfo;
  currencies?: Record<string, number>;
  /**
   * 'guest_post': a guest post package. Sold only through
   * /api/guest-posts/$id/checkout (tied to an approved submission); the
   * generic checkout refuses it.
   */
  kind?: 'guest_post';
  /** Guest post packages: most external links the article may contain. */
  maxLinks?: number;
};

/**
 * Default demo catalog. Replace with your real products when launching.
 * Keys MUST match what the pricing UI sends as product_id.
 */
export const pricingCatalog: Record<string, PricingProduct> = {
  starter_monthly: {
    productId: 'starter_monthly',
    productName: 'Starter',
    planName: 'Starter',
    description: 'Starter Monthly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 900,
    currency: 'usd',
    credits: 5000,
    plan: {
      name: 'Starter',
      interval: PaymentInterval.MONTH,
      intervalCount: 1,
    },
  },
  pro_monthly: {
    productId: 'pro_monthly',
    productName: 'Pro',
    planName: 'Pro',
    description: 'Pro Monthly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 2900,
    currency: 'usd',
    credits: 50000,
    plan: { name: 'Pro', interval: PaymentInterval.MONTH, intervalCount: 1 },
  },
  enterprise_monthly: {
    productId: 'enterprise_monthly',
    productName: 'Enterprise',
    planName: 'Enterprise',
    description: 'Enterprise Monthly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 9900,
    currency: 'usd',
    credits: 500000,
    plan: {
      name: 'Enterprise',
      interval: PaymentInterval.MONTH,
      intervalCount: 1,
    },
  },
  starter_yearly: {
    productId: 'starter_yearly',
    productName: 'Starter',
    planName: 'Starter',
    description: 'Starter Yearly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 8600,
    currency: 'usd',
    credits: 60000,
    plan: { name: 'Starter', interval: PaymentInterval.YEAR, intervalCount: 1 },
  },
  pro_yearly: {
    productId: 'pro_yearly',
    productName: 'Pro',
    planName: 'Pro',
    description: 'Pro Yearly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 27800,
    currency: 'usd',
    credits: 600000,
    plan: { name: 'Pro', interval: PaymentInterval.YEAR, intervalCount: 1 },
  },
  enterprise_yearly: {
    productId: 'enterprise_yearly',
    productName: 'Enterprise',
    planName: 'Enterprise',
    description: 'Enterprise Yearly',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 95000,
    currency: 'usd',
    credits: 6000000,
    plan: {
      name: 'Enterprise',
      interval: PaymentInterval.YEAR,
      intervalCount: 1,
    },
  },
  starter_lifetime: {
    productId: 'starter_lifetime',
    productName: 'Starter',
    planName: 'Starter Lifetime',
    description: 'Starter Lifetime',
    type: PaymentType.ONE_TIME,
    priceInCents: 14900,
    currency: 'usd',
    credits: 100000,
  },
  pro_lifetime: {
    productId: 'pro_lifetime',
    productName: 'Pro',
    planName: 'Pro Lifetime',
    description: 'Pro Lifetime',
    type: PaymentType.ONE_TIME,
    priceInCents: 49900,
    currency: 'usd',
    credits: 1000000,
  },
  enterprise_lifetime: {
    productId: 'enterprise_lifetime',
    productName: 'Enterprise',
    planName: 'Enterprise Lifetime',
    description: 'Enterprise Lifetime',
    type: PaymentType.ONE_TIME,
    priceInCents: 199900,
    currency: 'usd',
    credits: 10000000,
  },
  joyflix_starter: {
    productId: 'joyflix_starter',
    productName: 'Starter Pack',
    planName: 'Starter',
    description: '400 AI Credits',
    type: PaymentType.ONE_TIME,
    priceInCents: 999,
    currency: 'usd',
    credits: 400,
    creditsValidDays: 30,
    currencies: {
      cny: 7199,
    },
  },
  joyflix_standard: {
    productId: 'joyflix_standard',
    productName: 'Standard Pack',
    planName: 'Standard',
    description: '2,500 AI Credits',
    type: PaymentType.ONE_TIME,
    priceInCents: 4999,
    currency: 'usd',
    credits: 2500,
    creditsValidDays: 90,
    currencies: {
      cny: 35999,
    },
  },
  joyflix_premium: {
    productId: 'joyflix_premium',
    productName: 'Premium Pack',
    planName: 'Premium',
    description: '6,000 AI Credits',
    type: PaymentType.ONE_TIME,
    priceInCents: 9999,
    currency: 'usd',
    credits: 6000,
    creditsValidDays: 365,
    currencies: {
      cny: 71999,
    },
  },

  // Guest posts (see src/modules/guest-posts). Published permanently, every
  // external link rendered rel="sponsored nofollow".
  guest_post_standard: {
    productId: 'guest_post_standard',
    productName: 'Guest Post',
    planName: 'Standard',
    description: 'Guest post (1 link)',
    type: PaymentType.ONE_TIME,
    priceInCents: 9900,
    currency: 'usd',
    cnyPriceInCents: 69900,
    credits: 0,
    kind: 'guest_post',
    maxLinks: 1,
  },
  guest_post_premium: {
    productId: 'guest_post_premium',
    productName: 'Guest Post',
    planName: 'Premium',
    description: 'Guest post (3 links)',
    type: PaymentType.ONE_TIME,
    priceInCents: 19900,
    currency: 'usd',
    cnyPriceInCents: 139900,
    credits: 0,
    kind: 'guest_post',
    maxLinks: 3,
  },
};

/**
 * Catalog price for checkout: the requested currency when the product lists
 * it (zh pricing page sends `cny` → `currencies.cny`, in fen), else the base
 * price/currency.
 */
export function resolveCheckoutPricing(
  product: PricingProduct,
  requestedCurrency?: string | null
): { amount: number; currency: string } {
  const wanted = String(requestedCurrency || '').toLowerCase();
  const alt = wanted ? product.currencies?.[wanted] : undefined;
  if (wanted && wanted !== product.currency && alt != null) {
    return { amount: alt, currency: wanted };
  }
  return { amount: product.priceInCents, currency: product.currency };
}

/** Alipay / WeChat Pay settle in CNY only (amount = fen). */
export const CNY_ONLY_PAYMENT_PROVIDERS: readonly string[] = [
  'alipay',
  'wechat',
];

/**
 * Providers that always charge the price fixed on their own product in the
 * provider dashboard. Creem products can only be priced in USD/EUR, so their
 * orders use the catalog base currency (USD) whatever the locale.
 */
export const BASE_CURRENCY_PAYMENT_PROVIDERS: readonly string[] = ['creem'];

/**
 * Providers that reliably charge the CNY price we send. Others (Waffo,
 * PayPal…) may reject CNY and end up charging USD, so they always use USD:
 * never show ¥ for a charge that would be in $.
 */
export const CNY_CAPABLE_PAYMENT_PROVIDERS: readonly string[] = [
  'stripe',
  ...CNY_ONLY_PAYMENT_PROVIDERS,
];

export type ProviderCheckoutPricing =
  | { ok: true; amount: number; currency: string }
  | { ok: false; reason: 'cny_price_unavailable' };

/**
 * Price an order for the provider that will actually charge it, so
 * order.amount/currency equals what the provider charges (verified later).
 * - alipay/wechat: CNY price (`currencies.cny`); rejected for subscriptions /
 *   products without a CNY price.
 * - creem: catalog base currency (USD).
 * - stripe: requested pricing (price_data uses order.price).
 * - waffo, paypal and others: catalog USD (see CNY_CAPABLE_PAYMENT_PROVIDERS).
 */
export function resolveProviderCheckoutPricing(
  product: PricingProduct,
  opts: { provider?: string | null; requestedCurrency?: string | null }
): ProviderCheckoutPricing {
  const provider = String(opts.provider || '').toLowerCase();
  if (CNY_ONLY_PAYMENT_PROVIDERS.includes(provider)) {
    if (
      product.type === PaymentType.ONE_TIME &&
      product.currencies?.cny != null
    ) {
      return { ok: true, amount: product.currencies.cny, currency: 'cny' };
    }
    return { ok: false, reason: 'cny_price_unavailable' };
  }
  if (BASE_CURRENCY_PAYMENT_PROVIDERS.includes(provider)) {
    return { ok: true, ...resolveCheckoutPricing(product) };
  }
  if (provider && !CNY_CAPABLE_PAYMENT_PROVIDERS.includes(provider)) {
    return { ok: true, ...resolveCheckoutPricing(product, 'usd') };
  }
  return {
    ok: true,
    ...resolveCheckoutPricing(product, opts.requestedCurrency),
  };
}

/**
 * When a provider rejects the CNY charge (product only has USD enabled),
 * retry the same order at the catalog USD price. Alipay/WeChat stay CNY-only.
 */
export function checkoutUsdFallback(
  product: PricingProduct,
  opts: { provider?: string | null; currency: string; testAmount?: number }
): { amount: number; currency: 'usd' } | null {
  const provider = String(opts.provider || '').toLowerCase();
  if (opts.currency.toLowerCase() !== 'cny') return null;
  if (CNY_ONLY_PAYMENT_PROVIDERS.includes(provider)) return null;
  if (product.currency?.toLowerCase() !== 'usd' || product.priceInCents <= 0) {
    return null;
  }
  const testAmount = opts.testAmount ?? 0;
  return {
    amount: testAmount > 0 ? testAmount : product.priceInCents,
    currency: 'usd',
  };
}

/** Whether `provider` can charge `product` at all (UI provider filtering). */
export function isPaymentProviderAvailableForProduct(
  product: PricingProduct,
  provider: string
): boolean {
  return resolveProviderCheckoutPricing(product, { provider }).ok;
}

/**
 * What checkout charges with `provider`: its pricing, or the catalog USD
 * price when it cannot charge this product.
 */
export function providerChargePricing(
  product: PricingProduct,
  provider: string,
  requestedCurrency?: string | null
): { amount: number; currency: string } {
  const pricing = resolveProviderCheckoutPricing(product, {
    provider,
    requestedCurrency,
  });
  return pricing.ok
    ? { amount: pricing.amount, currency: pricing.currency }
    : resolveCheckoutPricing(product, 'usd');
}

/**
 * Price to show before paying with one of `providers` (one = direct
 * checkout, several = provider picker): what they all charge, else USD.
 */
export function checkoutDisplayPricing(
  product: PricingProduct,
  providers: readonly string[],
  requestedCurrency?: string | null
): { amount: number; currency: string } {
  const prices = providers.map((p) =>
    providerChargePricing(product, p, requestedCurrency)
  );
  const first = prices[0];
  return first && prices.every((x) => x.currency === first.currency)
    ? first
    : resolveCheckoutPricing(product, 'usd');
}

/** Minor units → display string ($9.99 / ¥71.99). */
export function formatCheckoutAmount(amount: number, currency: string): string {
  const c = String(currency || '').toLowerCase();
  const major = amount / 100;
  const n = Number.isInteger(major) ? `${major}` : major.toFixed(2);
  if (c === 'cny') return `¥${n}`;
  return c === 'usd' ? `$${n}` : `${n} ${c.toUpperCase()}`;
}

export function getPricingProduct(productId: string): PricingProduct | null {
  if (!productId) return null;
  return pricingCatalog[productId] ?? null;
}

export function listPricingProducts(): PricingProduct[] {
  return Object.values(pricingCatalog);
}

export function listGuestPostPackages(): PricingProduct[] {
  return listPricingProducts().filter((p) => p.kind === 'guest_post');
}
