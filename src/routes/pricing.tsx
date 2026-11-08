import { createFileRoute } from '@tanstack/react-router';

import { pricingSeoHead } from '@/lib/seo-document';
import { PricingLanding } from '@/components/seo/pricing-landing';

export const Route = createFileRoute('/pricing')({
  head: () => pricingSeoHead(),
  component: PricingLanding,
});
