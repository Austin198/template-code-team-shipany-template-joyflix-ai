import { createFileRoute } from '@tanstack/react-router';

import { Link } from '@/core/i18n/navigation';
import { PRODUCT_NAME } from '@/config/seo-site';
import { selfCanonicalHead } from '@/lib/seo-document';
import { m } from '@/paraglide/messages.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';

const TITLE = `Articles | ${PRODUCT_NAME}`;
const DESCRIPTION = 'Aniform does not publish template articles here.';

export const Route = createFileRoute('/posts/')({
  head: () => selfCanonicalHead('/posts', TITLE, DESCRIPTION),
  component: PostsIndexPage,
});

function PostsIndexPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col font-sans">
      <Header />
      <main className="flex-1 pt-[65px]">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <h1 className="text-foreground text-3xl font-semibold tracking-tight">
            {m['content.withheld.title']()}
          </h1>
          <p className="text-muted-foreground mt-3">{DESCRIPTION}</p>
          <Link
            href="/"
            className="mt-6 inline-flex text-sm font-semibold underline underline-offset-4"
          >
            {m['common.not_found.back_home']()}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
