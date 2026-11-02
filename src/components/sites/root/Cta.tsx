'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

import { getLocale } from '@/paraglide/runtime.js';
import { Button } from '@/components/ui/button';

export function Cta() {
  const isZh = getLocale() === 'zh';

  const scrollToHero = () => {
    const heroEl =
      document.getElementById('hero-input') || document.getElementById('hero');
    if (heroEl) {
      heroEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      id="cta"
      className="border-border/60 relative overflow-hidden border-t py-20 sm:py-28"
    >
      {/* Ambient Lighting Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
        <div className="absolute top-1/2 left-1/2 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-indigo-500/20 blur-[130px] dark:from-purple-600/30 dark:via-blue-600/30 dark:to-indigo-600/30" />
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/85 px-6 py-12 text-center shadow-2xl backdrop-blur-2xl sm:px-12 sm:py-16 md:px-16 md:py-20 dark:border-white/15 dark:bg-zinc-900/70">
          <div className="mx-auto max-w-3xl">
            <div className="border-primary/20 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>{isZh ? '开启创作之旅' : 'Ready to Create'}</span>
            </div>

            <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              {isZh
                ? '立即制作您的第一支 AI 视频'
                : 'Create Your First AI Video Today'}
            </h2>

            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm leading-relaxed sm:text-base md:text-lg">
              {isZh
                ? '加入 500,000+ 位创作者的行列，用 JoyFlix AI 将无限创意变为现实。'
                : 'Join 500,000+ creators who bring their ideas to life with JoyFlix AI.'}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={scrollToHero}
                className="shadow-primary/25 h-12 gap-2 rounded-full px-8 text-sm font-bold shadow-lg transition-all hover:scale-105 active:scale-95 sm:h-13 sm:text-base"
              >
                <span>{isZh ? '立即开始创作' : 'Start Creating Now'}</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
