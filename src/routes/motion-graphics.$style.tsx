import { createFileRoute, notFound } from '@tanstack/react-router';

import { getStylePage } from '@/config/seo-landings';
import { subpageSeoHead } from '@/lib/seo-document';
import { SeoLanding } from '@/components/seo/seo-landing';

export const Route = createFileRoute('/motion-graphics/$style')({
  loader: ({ params }) => {
    const page = getStylePage(params.style);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => (loaderData ? subpageSeoHead(loaderData.page) : {}),
  component: StylePage,
});

function StylePage() {
  const { page } = Route.useLoaderData();
  return <SeoLanding page={page} />;
}
