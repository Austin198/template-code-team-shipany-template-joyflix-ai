import { Link } from '@/core/i18n/navigation';
import {
  HOME_AUDIENCE,
  HOME_AUDIENCE_INTRO,
  HOME_COMPARISON_AFTER,
  HOME_COMPARISON_INTRO,
  HOME_FAQ_INTRO,
  HOME_H1,
  HOME_HOW_INTRO,
  HOME_STEPS,
  HOME_STYLES_INTRO,
  HOME_WHAT_IS,
  homeFaq,
  homePlanCopy,
  homePricingIntro,
  STYLE_PAGES,
} from '@/config/seo-landings';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';

import { ComparisonTable } from './comparison-table';
import { DemoPoster } from './demo-poster';
import { MotionPrompt } from './motion-prompt';
import { PricingTable } from './pricing-table';
import { RichText, SeoImage } from './rich-text';

export function HomeLanding() {
  const plans = homePlanCopy();
  const faq = homeFaq();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 pt-24 pb-20 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-14">
          <section className="flex flex-col gap-5">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {HOME_H1}
            </h1>
            <MotionPrompt />
            <DemoPoster />
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              {HOME_WHAT_IS.h2}
            </h2>
            {HOME_WHAT_IS.paragraphs.map((paragraph) => (
              <RichText
                key={paragraph.slice(0, 24)}
                paragraph={paragraph}
                className="mt-4 text-base leading-7"
              />
            ))}
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              How it works
            </h2>
            <p className="mt-4 text-base leading-7">{HOME_HOW_INTRO}</p>
            <div className="mt-8 flex flex-col gap-10">
              {HOME_STEPS.map((step) => (
                <div key={step.h3}>
                  <h3 className="text-xl font-semibold">{step.h3}</h3>
                  {step.paragraphs.map((paragraph, index) => (
                    <RichText
                      key={index}
                      paragraph={paragraph}
                      className="mt-3 text-base leading-7"
                    />
                  ))}
                  <SeoImage
                    figure={step.figure}
                    className="mt-4 aspect-video w-full rounded-xl object-cover"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              Motion graphics styles
            </h2>
            <p className="mt-4 text-base leading-7">{HOME_STYLES_INTRO}</p>
            <div className="mt-8 flex flex-col gap-10">
              {STYLE_PAGES.map((page) => (
                <div key={page.slug}>
                  <h3 className="text-xl font-semibold">
                    <Link
                      href={page.path}
                      className="underline underline-offset-4"
                    >
                      {page.keyword}
                    </Link>
                  </h3>
                  <p className="mt-3 text-base leading-7">{page.summary}</p>
                  {page.sections[0]?.figure ? (
                    <SeoImage
                      figure={page.sections[0].figure}
                      className="mt-4 aspect-video w-full rounded-xl object-cover"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              Who it&apos;s for
            </h2>
            <p className="mt-4 text-base leading-7">{HOME_AUDIENCE_INTRO}</p>
            <div className="mt-8 flex flex-col gap-8">
              {HOME_AUDIENCE.map((group) => (
                <div key={group.h3}>
                  <h3 className="text-xl font-semibold">{group.h3}</h3>
                  <p className="mt-3 text-base leading-7">{group.paragraph}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              How it compares to other AI motion graphics tools
            </h2>
            <p className="mt-4 text-base leading-7">{HOME_COMPARISON_INTRO}</p>
            <div className="mt-4">
              <ComparisonTable />
            </div>
            <RichText
              paragraph={HOME_COMPARISON_AFTER}
              className="mt-4 text-base leading-7"
            />
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>
            <p className="mt-4 text-base leading-7">{homePricingIntro()}</p>
            <div className="mt-8 flex flex-col gap-8">
              {plans.map((plan) => (
                <div key={plan.h3}>
                  <h3 className="text-xl font-semibold">{plan.h3}</h3>
                  <p className="mt-3 text-base leading-7">{plan.paragraph}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <PricingTable />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
            <p className="mt-4 text-base leading-7">{HOME_FAQ_INTRO}</p>
            <div className="mt-8 flex flex-col gap-8">
              {faq.map((item) => (
                <div key={item.question}>
                  <h3 className="text-xl font-semibold">{item.question}</h3>
                  {item.answer.map((paragraph, index) => (
                    <RichText
                      key={index}
                      paragraph={paragraph}
                      className="mt-3 text-base leading-7"
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
