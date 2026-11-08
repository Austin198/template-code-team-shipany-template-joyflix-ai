import { Link } from '@/core/i18n/navigation';
import {
  relatedStylePages,
  STYLE_PLAN_LINE,
  type SeoPage,
} from '@/config/seo-landings';
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

        {page.kind === 'style' ? (
          <RichText
            paragraph={STYLE_PLAN_LINE}
            className="mt-4 text-base leading-7"
          />
        ) : null}

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

        {page.kind === 'style' ? <OtherScenarios slug={page.slug} /> : null}
      </main>
      <Footer />
    </div>
  );
}

function OtherScenarios({ slug }: { slug: string }) {
  const related = relatedStylePages(slug);
  if (related.length === 0) return null;

  return (
    <section className="mt-12" aria-labelledby="other-scenarios">
      <h2
        id="other-scenarios"
        className="text-2xl font-semibold tracking-tight"
      >
        Other scenarios
      </h2>
      <p className="mt-4 text-base leading-7">
        Nearby jobs use the same path: describe the scene, edit the element,
        export MP4.
      </p>
      <ul className="mt-4 flex flex-col gap-3 text-base leading-7">
        {related.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.path}
              className="font-medium underline underline-offset-4"
            >
              {item.navLabel ?? item.keyword}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
