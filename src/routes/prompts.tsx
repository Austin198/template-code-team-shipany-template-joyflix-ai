'use client';

import React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Sparkles } from 'lucide-react';

// import { z } from 'zod';

// import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { ShowcasesFlowDynamic } from '@/components/sites/showcase/ShowcasesFlowDynamic';

// const searchSchema = z.object({
//   type: z.enum(['image', 'video']).optional(),
// });

function PromptsPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 pt-20 pb-16 sm:px-6 md:pt-24 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header Banner */}
          <div className="mb-8 text-center sm:mb-12">
            <div className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>{m['app.generator.prompts_badge']()}</span>
            </div>
            <h1 className="text-foreground mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-5xl">
              {m['app.generator.prompts_title']()}
            </h1>
            <p className="text-muted-foreground mx-auto mt-2.5 max-w-2xl text-xs sm:text-sm md:text-base">
              {m['app.generator.prompts_subtitle']()}
            </p>
          </div>

          {/* Prompts Dynamic Flow */}
          <ShowcasesFlowDynamic
            usePrompts={true}
            type="video"
            hideCreateButton={false}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const Route = createFileRoute('/prompts')({
  component: PromptsPage,
});
