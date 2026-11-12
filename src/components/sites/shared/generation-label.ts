import { m } from '@/paraglide/messages.js';

/** User-facing count for a video generation. One unit is not called a credit. */
export function formatGenerationCount(count: number): string {
  const safe = Number.isFinite(count) ? Math.max(0, Math.round(count)) : 0;
  if (safe === 1) {
    return m['app.generator.generation_count_one']({ count: String(safe) });
  }
  return m['app.generator.generation_count_other']({ count: String(safe) });
}
