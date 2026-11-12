/**
 * Template article URLs that used to render Joyflix copy.
 * The bodies are gone. The slugs stay so those URLs can answer with a
 * noindex page instead of the old articles.
 */
export const WITHDRAWN_POST_SLUGS = [
  'wan-2-7-coming-soon',
  '8-best-nano-banana-2-prompts',
  'pixany-ai-introduction',
  'palix-ai-introduction',
] as const;

export function isWithdrawnPostSlug(slug: string): boolean {
  return (WITHDRAWN_POST_SLUGS as readonly string[]).includes(slug);
}
