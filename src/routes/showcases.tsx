'use client';

import React, { useEffect, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Sparkles } from 'lucide-react';

import type { CreationItem } from '@/modules/creations/store';
// import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import {
  // ShowcasesFlowDynamic,
  ShowcasesSkeleton,
} from '@/components/sites/showcase/ShowcasesFlowDynamic';
import { WorkspaceRecentCreations } from '@/components/sites/workspace/WorkspaceRecentCreations';

function ShowcasesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const page = Math.max(1, Number(search?.page) || 1);

  const [videoCreations, setVideoCreations] = useState<CreationItem[]>([]);
  const [loadingVideo, setLoadingVideo] = useState(false);

  // Fetch video showcases to display via WorkspaceRecentCreations
  useEffect(() => {
    setLoadingVideo(true);
    fetch('/api/showcases/latest?type=video&limit=48')
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 0 && Array.isArray(res.data)) {
          const mapped: CreationItem[] = res.data
            .filter((item: any) => {
              const url = item.videoUrl || item.image || '';
              return (
                !item.id?.startsWith('mock_') &&
                !url.includes('palix-ai.mp4') &&
                !url.includes('1778247593756-bdtvb0.png')
              );
            })
            .map((item: any) => ({
              id: item.id,
              mediaType: 'video' as const,
              prompt: item.prompt || item.title || m['app.generator.videos'](),
              url: item.videoUrl || item.image,
              thumbnailUrl: item.image,
              createdAt: new Date(item.createdAt).getTime() || Date.now(),
              status: 'success' as const,
            }));
          setVideoCreations(mapped);
        }
      })
      .catch((err) => console.error('Failed to load video showcases:', err))
      .finally(() => setLoadingVideo(false));
  }, []);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 px-4 pt-20 pb-16 sm:px-6 md:pt-24 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header Banner */}
          <div className="mb-8 text-center sm:mb-12">
            <div className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
              <Sparkles className="size-3.5" />
              <span>{m['app.generator.showcases_badge']()}</span>
            </div>
            <h1 className="text-foreground mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-5xl">
              {m['app.generator.showcases_title']()}
            </h1>
            <p className="text-muted-foreground mx-auto mt-2.5 max-w-2xl text-xs sm:text-sm md:text-base">
              {m['app.generator.showcases_subtitle']()}
            </p>
          </div>

          {/* Showcases Gallery: reuses WorkspaceRecentCreations component */}
          {loadingVideo && videoCreations.length === 0 ? (
            <ShowcasesSkeleton count={8} />
          ) : (
            <WorkspaceRecentCreations
              hideHeader
              allowDelete={false}
              filterMediaType="video"
              initialTab="video"
              creations={videoCreations}
              page={page}
              onPageChange={(nextPage) => {
                navigate({
                  to: '/showcases',
                  search: {
                    page: nextPage <= 1 ? undefined : nextPage,
                  },
                });
              }}
              pageSize={16}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const Route = createFileRoute('/showcases')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: search.page ? Number(search.page) : undefined,
    };
  },
  component: ShowcasesPage,
});
