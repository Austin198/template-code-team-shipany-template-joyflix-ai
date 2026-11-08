import { pricingPageModel } from '@/config/seo-landings';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';

import { PricingTable } from './pricing-table';

export function PricingLanding() {
  const page = pricingPageModel();

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 pt-24 pb-20 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-14">
          <section>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-4 text-base leading-7">{page.intro}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold tracking-tight">
              Monthly plans
            </h2>
            <div className="mt-8 flex flex-col gap-8">
              {page.plans.map((plan) => (
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
            <div className="mt-8 flex flex-col gap-8">
              {page.faq.map((item) => (
                <div key={item.question}>
                  <h3 className="text-xl font-semibold">{item.question}</h3>
                  <p className="mt-3 text-base leading-7">{item.answer}</p>
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
