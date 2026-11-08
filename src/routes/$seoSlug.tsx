import { createFileRoute, notFound, redirect } from '@tanstack/react-router';

import {
  getSeoPage,
  retiredSeoTarget,
  SEO_PATH_REDIRECT_STATUS,
} from '@/config/seo-landings';
import { subpageSeoHead } from '@/lib/seo-document';
import { SeoLanding } from '@/components/seo/seo-landing';

export const Route = createFileRoute('/$seoSlug')({
  beforeLoad: ({ params }) => {
    const target = retiredSeoTarget(params.seoSlug);
    if (!target) return;
    throw redirect({ href: target, statusCode: SEO_PATH_REDIRECT_STATUS });
  },
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
