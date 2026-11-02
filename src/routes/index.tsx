'use client';

import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { Pricing } from '@/blocks/pricing';
import { SupportWidget } from '@/blocks/support-widget';
import { Cta } from '@/components/sites/root/Cta';
import { Faq } from '@/components/sites/root/Faq';
import { Hero } from '@/components/sites/root/Hero';
import { Logos } from '@/components/sites/root/Logos';
import { Showcase } from '@/components/sites/root/Showcase';
import { Stats } from '@/components/sites/root/Stats';
import { Testimonials } from '@/components/sites/root/Testimonials';

/**
 * Joyflix AI Landing Page migrated from Cloudflare branch.
 * Includes:
 * 1. Hero with AI Video Generator
 * 2. Video Model Engine Logos
 * 3. Text-to-Video & Image-to-Video Showcases
 * 4. Stats
 * 5. Transparent Pricing Plans
 * 6. Global Creator Testimonials
 * 7. FAQ
 * 8. Bottom Conversion CTA
 */
function HomePage() {
  return (
    <div className="bg-background text-foreground selection:bg-primary/20 selection:text-primary flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* 1. Cinematic Cloudflare-Style Hero with AI Video Generator */}
        <Hero />

        {/* 2. AI Model Engine Logos */}
        <Logos />

        {/* 3. Text to Video & Image to Video Showcase */}
        <Showcase />

        {/* 4. Stats Counter */}
        <Stats />

        {/* 5. Transparent Pricing Plans */}
        <Pricing />

        {/* 6. 3-Column Creator Testimonials Marquee */}
        <Testimonials />

        {/* 7. FAQ */}
        <Faq />

        {/* 8. Conversion CTA */}
        <Cta />
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}

export const Route = createFileRoute('/')({
  loader: async () => {
    const locale = getLocale();
    return { locale };
  },
  head: ({ loaderData }) => {
    const locale = loaderData?.locale ?? 'en';
    const urlFor = (loc: string) =>
      localizeUrl(`${envConfigs.app_url}/`, { locale: loc as any }).href;
    return {
      meta: [
        {
          name: 'description',
          content: m['landing.hero.description']({}, { locale: locale as any }),
        },
      ],
      links: [
        { rel: 'canonical', href: urlFor(locale) },
        ...locales.map((loc) => ({
          rel: 'alternate',
          hrefLang: loc,
          href: urlFor(loc),
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: urlFor('en') },
      ],
    };
  },
  component: HomePage,
});
