'use client';

import React from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ParametersSelectProps {
  duration: string;
  setDuration: (d: string) => void;
  availableDurations: string[];
  resolution: string;
  setResolution: (r: string) => void;
  availableResolutions: string[];
  aspectRatio: string;
  setAspectRatio: (ar: string) => void;
  showAspectRatio: boolean;
  className?: string;
}

const ASPECT_RATIOS = [
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
  { label: '1:1', value: '1:1' },
];

export function ParametersSelect({
  duration,
  setDuration,
  availableDurations,
  resolution,
  setResolution,
  availableResolutions,
  aspectRatio,
  setAspectRatio,
  showAspectRatio,
  className = '',
}: ParametersSelectProps) {
  const summaryParts: string[] = [];
  if (resolution) summaryParts.push(resolution);
  if (duration) summaryParts.push(duration);
  if (showAspectRatio && aspectRatio) summaryParts.push(aspectRatio);
  const summary =
    summaryParts.join(' • ') || m['video.hero_input.parameters']();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-all sm:h-10',
              // Light mode
              'border-slate-200/90 bg-slate-100/70 text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900',
              // Dark mode
              'dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80 dark:hover:border-white/30 dark:hover:bg-white/[0.1] dark:hover:text-white',
              className
            )}
          >
            <SlidersHorizontal className="size-3.5 shrink-0 opacity-70" />
            <span className="truncate">{summary}</span>
            <ChevronDown className="size-3.5 shrink-0 opacity-50" />
          </button>
        }
      />

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="border-border/80 bg-popover/95 w-72 space-y-3 rounded-2xl border p-3.5 shadow-2xl backdrop-blur-xl dark:border-white/15 dark:bg-zinc-900/95"
      >
        {/* Resolution */}
        {availableResolutions.length > 0 && (
          <div>
            <div className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              {m['app.generator.resolution']()}
            </div>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {availableResolutions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setResolution(r)}
                  className={cn(
                    'rounded-lg py-1.5 text-xs font-semibold transition-all',
                    resolution === r
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Duration */}
        {availableDurations.length > 0 && (
          <div>
            {availableResolutions.length > 0 && (
              <DropdownMenuSeparator className="border-border/50 my-2 dark:border-white/10" />
            )}
            <div className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              {m['app.generator.duration']()}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {availableDurations.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={cn(
                    'min-w-[48px] flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all',
                    duration === d
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Aspect Ratio */}
        {showAspectRatio && (
          <div>
            <DropdownMenuSeparator className="border-border/50 my-2 dark:border-white/10" />
            <div className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              {m['app.generator.aspect_ratio']()}
            </div>
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              {ASPECT_RATIOS.map((ratio) => (
                <button
                  key={ratio.value}
                  type="button"
                  onClick={() => setAspectRatio(ratio.value)}
                  className={cn(
                    'rounded-lg py-1.5 text-xs font-semibold transition-all',
                    aspectRatio === ratio.value
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
