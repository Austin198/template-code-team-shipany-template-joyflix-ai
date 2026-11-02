'use client';

import React from 'react';

import { getLocale } from '@/paraglide/runtime.js';
import { usePublicConfig } from '@/hooks/use-public-config';
import { getVideoModelsList } from '@/components/sites/shared/models';

export function Logos() {
  const isZh = getLocale() === 'zh';
  const { data: publicConfig } = usePublicConfig();
  const models = React.useMemo(() => {
    return getVideoModelsList(publicConfig?.active_ai_provider);
  }, [publicConfig?.active_ai_provider]);

  return (
    <section className="border-border/60 bg-muted/20 border-y py-16 sm:py-20 dark:bg-black/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            {isZh ? '全球顶尖视频生成模型' : 'Video Generation Models'}
          </h2>
          <p className="text-muted-foreground mt-2 text-xs sm:text-sm">
            {isZh
              ? '接入行业领先的 AI 模型，打破创意边界，让构想跃然屏上'
              : 'Cutting-edge video AI models, bringing concepts to reality in video creation'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-14">
          {models.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col items-center gap-2.5 transition-transform duration-200 hover:scale-105"
            >
              <div className="group-hover:border-primary/40 flex size-14 items-center justify-center rounded-2xl border border-slate-200/90 bg-white/90 p-3 shadow-sm transition-all group-hover:shadow-md sm:size-16 dark:border-white/10 dark:bg-white/[0.05] dark:group-hover:border-white/20">
                <img
                  src={item.icon}
                  alt={item.name}
                  className="h-8 w-8 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 sm:h-9 sm:w-9"
                />
              </div>
              <span className="text-muted-foreground group-hover:text-foreground text-xs font-semibold transition-colors sm:text-sm">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
