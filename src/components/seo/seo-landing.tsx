import { Link } from '@/core/i18n/navigation';
import type { SeoPage } from '@/config/seo-landings';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';

import { RichText, SeoImage } from './rich-text';

export function SeoLanding({ page }: { page: SeoPage }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-24 pb-20 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-muted-foreground text-sm">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="underline underline-offset-4">
                AI motion graphics generator
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground">{page.h1}</li>
          </ol>
        </nav>

        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          {page.h1}
        </h1>

        {page.sections.map((section) => (
          <section key={section.h2} className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight">
              {section.h2}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <RichText
                key={index}
                paragraph={paragraph}
                className="mt-4 text-base leading-7"
              />
            ))}
            {section.figure ? (
              <SeoImage
                figure={section.figure}
                className="mt-4 aspect-video w-full rounded-xl object-cover"
              />
            ) : null}
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
