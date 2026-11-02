import { createFileRoute } from '@tanstack/react-router';

import { homeSeoHead } from '@/lib/seo-document';
import { HomeLanding } from '@/components/seo/home-landing';

export const Route = createFileRoute('/')({
  head: () => homeSeoHead(),
  component: HomeLanding,
});
