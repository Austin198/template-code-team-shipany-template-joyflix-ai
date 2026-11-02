/** Single source for Aniform SEO constants. Do not hardcode the product name or domain elsewhere. */

export const PRODUCT_NAME = 'Aniform';
export const SITE_URL = 'https://aniform.ai';
export const FREE_QUOTA = 0;
export const PRICE_STARTER = '$19/mo';
export const PRICE_PRO = '$49/mo';
export const STARTER_QUOTA = 60;
export const PRO_QUOTA = 200;

export const HOME_TITLE =
  'AI Motion Graphics Generator – Type a Prompt, Get a Video';
export const HOME_DESCRIPTION =
  'Turn a sentence into animated motion graphics. Describe your scene, retype any on-screen text, change colors and timing, then export MP4 — free to try, no timeline skills needed.';

const STYLE_SLUGS = [
  'social-media-ads',
  'youtube-intro',
  'explainer-video',
  'logo-animation',
  'kinetic-typography',
  'data-stats-video',
] as const;

const SEO_SLUGS = [
  'free-motion-graphics-generator',
  'ai-motion-video-generator',
  'motion-graphics-editor',
  'how-to-use-magnific-move',
  'magnific-move-alternative',
  'magnific-move-review',
] as const;

export type StyleSlug = (typeof STYLE_SLUGS)[number];
export type SeoSlug = (typeof SEO_SLUGS)[number];

export const STYLE_SLUG_LIST: readonly StyleSlug[] = STYLE_SLUGS;
export const SEO_SLUG_LIST: readonly SeoSlug[] = SEO_SLUGS;

/** Absolute canonical URL. No trailing slash, no query, no hash. */
export function absoluteUrl(path: string): string {
  const raw = (path || '/').trim();
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  const queryAt = withSlash.indexOf('?');
  const hashAt = withSlash.indexOf('#');
  let end = withSlash.length;
  if (queryAt >= 0) end = Math.min(end, queryAt);
  if (hashAt >= 0) end = Math.min(end, hashAt);
  let pathname = withSlash.slice(0, end);
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, '');
  if (pathname === '' || pathname === '/') return SITE_URL;
  return `${SITE_URL}${pathname}`;
}

export function usdAmount(priceLabel: string): string {
  const match = priceLabel.match(/\$(\d+(?:\.\d+)?)/);
  return match?.[1] ?? '';
}

export function isStyleSlug(value: string): value is StyleSlug {
  return (STYLE_SLUGS as readonly string[]).includes(value);
}

export function isSeoSlug(value: string): value is SeoSlug {
  return (SEO_SLUGS as readonly string[]).includes(value);
}
