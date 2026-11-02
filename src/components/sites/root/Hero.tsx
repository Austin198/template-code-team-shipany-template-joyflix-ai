'use client';

import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { Badge } from '@/components/ui/badge';

import { HeroInput } from './HeroInput';

export function Hero() {
  const scrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    const heroEl =
      document.getElementById('hero-input') || document.getElementById('hero');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-[840px] flex-col items-center justify-start overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28"
    >
      {/* Ambient Glows & Mesh Lighting */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        {/* Radial ambient gradient bursts */}
        <div className="absolute top-10 left-1/2 h-[550px] w-[850px] -translate-x-1/2 rounded-full bg-gradient-to-b from-purple-500/20 via-blue-500/15 to-transparent blur-[140px] dark:from-purple-600/30 dark:via-blue-600/20" />
        <div className="absolute top-40 right-[-10%] h-[400px] w-[500px] rounded-full bg-gradient-to-l from-indigo-500/15 to-transparent blur-[120px] dark:from-indigo-600/25" />
        <div className="absolute top-60 left-[-10%] h-[400px] w-[500px] rounded-full bg-gradient-to-r from-purple-500/15 to-transparent blur-[120px] dark:from-purple-600/25" />

        {/* Subtle grid pattern mask */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_85%)]" />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl px-4 text-center sm:px-6">
        {/* Announcement Badge */}
        <div className="mb-4 sm:mb-6">
          <a
            href="#hero-input"
            onClick={scrollToHero}
            className="group hover:border-primary/40 inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-3.5 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white dark:border-white/15 dark:bg-white/[0.06] dark:text-white/85 dark:hover:border-white/30 dark:hover:bg-white/[0.1] dark:hover:text-white"
          >
            <Badge
              variant="default"
              className="bg-primary/90 text-primary-foreground h-5 rounded-full px-2 text-[10px] font-bold uppercase shadow-xs"
            >
              {m['landing.hero.announcement_badge']()}
            </Badge>
            <span className="font-semibold">
              {m['landing.hero.announcement']()}
            </span>
            <ChevronRight className="size-3.5 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Main Headline */}
        <h1 className="mx-auto mb-4 max-w-5xl text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl">
          {m['landing.hero.headline_prefix']()}{' '}
          <span className="bg-gradient-to-r from-[#9c40ff] via-[#38bdf8] to-[#9c40ff] bg-clip-text text-transparent">
            {m['landing.hero.headline_highlight']()}
          </span>{' '}
          {m['landing.hero.headline_suffix']()}
        </h1>

        {/* Subtitle Description */}
        <p className="text-muted-foreground mx-auto max-w-3xl text-sm leading-relaxed sm:text-base lg:text-lg">
          {m['landing.hero.subtitle_line1']()}
          <br className="hidden sm:inline" />
          {m['landing.hero.subtitle_line2']()}
        </p>

        {/* Embedded Hero AI Video Generator */}
        <HeroInput />
      </div>
    </section>
  );
}
