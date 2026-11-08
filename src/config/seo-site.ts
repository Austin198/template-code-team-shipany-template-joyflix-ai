/**
 * Single source for Aniform SEO constants. Do not hardcode the product name
 * or domain elsewhere.
 *
 * Public canonical origin is the apex https://aniform.online. Sitemap locs,
 * robots Sitemap, canonical, Open Graph, and JSON-LD all go through
 * `absoluteUrl()` / `SITE_URL`. `www.aniform.online` (and the retired
 * aniform.ai host, if a request still reaches this app) 301/308 to that apex
 * via `requestApexRedirect()` in `src/server.ts`.
 *
 * The www hostname has to stay attached to the same Cloudflare Worker as the
 * apex. The Worker sees the original Host and answers before the page
 * renders. If www is removed from the Worker, Cloudflare never calls this
 * code and the redirect cannot run.
 */

export const PRODUCT_NAME = 'Aniform';
export const SITE_URL = 'https://aniform.online';
export const FREE_QUOTA = 0;
export const PRICE_STARTER = '$19/mo';
export const PRICE_PRO = '$49/mo';
export const STARTER_QUOTA = 40;
export const PRO_QUOTA = 100;

/** One paid generation, before duration and resolution multipliers. */
export const GENERATION_UNIT_COPY =
  'One generation is a 5-second 720P text-to-video. 10 seconds counts as 2 generations. 1080P counts as 2. A 10-second 1080P video counts as 4. An image input does not add generations. 720P is the standard export. 1080P is not included as an unlimited extra.';

/** Copy only. Renewals already grant the credits stored on the subscription. */
export const PRICING_GRANDFATHER_NOTE =
  'Existing paid subscribers keep the monthly allotment already on their subscription. New subscribers receive these quotas.';

export const HOME_TITLE =
  'AI Motion Graphics Generator – Type a Prompt, Get a Video';
export const HOME_DESCRIPTION =
  'Type a sentence and get an editable motion graphics video. Click any on-screen text to fix the wording, then export MP4. Starter $19/mo, no free quota.';

/** `/` owns this phrase. Other titles and H1s must not reuse it. */
export const HOME_KEYWORD = 'AI Motion Graphics Generator';

/**
 * `/ai-video-generator` owns this phrase. The document title is the keyword,
 * not the brand name alone. The description may still name the product.
 */
export const AI_VIDEO_GENERATOR_TITLE = 'AI Video Generator';
export const AI_VIDEO_GENERATOR_H1 = 'AI Video Generator';
export const AI_VIDEO_GENERATOR_DESCRIPTION =
  'Aniform generates videos from text, an image, or another video. Text-to-video, image-to-video, and video-to-video.';

export const PRICING_TITLE = `${PRODUCT_NAME} pricing`;
export const PRICING_DESCRIPTION = `Monthly plans only. Starter is ${PRICE_STARTER} for ${STARTER_QUOTA} generations. Pro is ${PRICE_PRO} for ${PRO_QUOTA} generations. No free generation quota.`;

const APEX_HOST = new URL(SITE_URL).hostname;

/** Hosts that must not be indexed or shared. They redirect to SITE_URL. */
const LEGACY_HOSTS = new Set([
  `www.${APEX_HOST}`,
  'aniform.ai',
  'www.aniform.ai',
]);

const STYLE_SLUGS = [
  'social-media-ads',
  'youtube-intro',
  'explainer-video',
  'logo-animation',
  'kinetic-typography',
  'data-stats-video',
] as const;

const SEO_SLUGS = [
  // /free-motion-graphics-generator is retired (301 to /). Do not re-add it.
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

/**
 * When an env/app URL still names a retired host, use the apex instead.
 * Unset and localhost values are left alone so local auth keeps working.
 */
export function canonicalSiteUrl(
  value: string | undefined
): string | undefined {
  if (!value) return value;
  try {
    const host = new URL(value).hostname.toLowerCase();
    if (LEGACY_HOSTS.has(host)) return SITE_URL;
  } catch {
    return value;
  }
  return value;
}

/**
 * Absolute apex URL for this request, or null when the host is already the
 * public origin (or any non-production host such as localhost).
 * Path and query are preserved. The hash is not part of the HTTP request.
 */
export function apexRedirectUrl(url: URL): string | null {
  const host = url.hostname.toLowerCase();
  if (!LEGACY_HOSTS.has(host)) return null;
  const dest = new URL(SITE_URL);
  dest.pathname = url.pathname || '/';
  dest.search = url.search;
  return dest.toString();
}

/**
 * Same as `apexRedirectUrl`, but the Host header wins when the request URL
 * carries an internal proxy host. Destination host is always SITE_URL.
 */
export function requestApexRedirect(req: Request): string | null {
  const url = new URL(req.url);
  const headerHost = (req.headers.get('host') || '')
    .split(',')[0]
    ?.trim()
    .replace(/:\d+$/, '')
    .toLowerCase();
  if (headerHost) url.hostname = headerHost;
  return apexRedirectUrl(url);
}
