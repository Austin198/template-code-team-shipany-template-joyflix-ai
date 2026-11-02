'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

import { getLocale } from '@/paraglide/runtime.js';
import { Badge } from '@/components/ui/badge';

export function Stats() {
  const isZh = getLocale() === 'zh';

  const stats = [
    {
      label: '500K+',
      title: isZh ? '全球创作者' : 'Creators',
      desc: isZh
        ? '深受全球创作者与工作室信赖'
        : 'Trusted by creators worldwide',
    },
    {
      label: '1M+',
      title: isZh ? '已生成视频数' : 'Videos Generated',
      desc: isZh
        ? '高画质、影院级成片源源不断输出'
        : 'High-quality videos created',
    },
    {
      label: '60s',
      title: isZh ? '平均生成耗时' : 'Seconds to Create',
      desc: isZh ? '云端算力秒级响应，极速渲染' : 'Average generation time',
    },
  ];

  return (
    <section
      id="stats"
      className="border-border/60 bg-muted/20 border-t py-20 sm:py-24 dark:bg-black/30"
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <Badge
            variant="outline"
            className="mb-3 gap-1.5 px-3 py-1 text-xs font-semibold"
          >
            <BarChart3 className="text-primary size-3.5" />
            <span>{isZh ? '数据表现' : 'Platform Stats'}</span>
          </Badge>
          <h2 className="text-foreground text-3xl font-extrabold tracking-tight sm:text-4xl">
            {isZh ? '深受全球创作者喜爱' : 'People Love JoyFlix AI'}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm sm:text-base">
            {isZh
              ? '因其卓越的表现力与极简的操作流程。'
              : 'for its exceptional quality and ease of use.'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="hover:border-primary/40 flex flex-col items-center rounded-3xl border border-slate-200/90 bg-white/90 p-8 text-center shadow-sm transition-all hover:scale-105 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]"
            >
              <p className="text-muted-foreground text-xs font-medium sm:text-sm">
                {item.desc}
              </p>
              <p className="text-primary pt-2 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
                {item.label}
              </p>
              <p className="text-foreground mt-2 text-base font-bold sm:text-lg">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
