import { createFileRoute, notFound } from '@tanstack/react-router';

import { getSeoPage } from '@/config/seo-landings';
import { subpageSeoHead } from '@/lib/seo-document';
import { SeoLanding } from '@/components/seo/seo-landing';

export const Route = createFileRoute('/$seoSlug')({
  loader: ({ params }) => {
    const page = getSeoPage(params.seoSlug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => (loaderData ? subpageSeoHead(loaderData.page) : {}),
  component: SeoSlugPage,
});

function SeoSlugPage() {
  const { page } = Route.useLoaderData();
  return <SeoLanding page={page} />;
}
