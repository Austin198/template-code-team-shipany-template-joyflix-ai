import {
  homeFaq,
  paragraphText,
  pricingPageModel,
  type SeoPage,
} from '@/config/seo-landings';
import {
  absoluteUrl,
  AI_VIDEO_GENERATOR_DESCRIPTION,
  AI_VIDEO_GENERATOR_TITLE,
  HOME_DESCRIPTION,
  HOME_TITLE,
  PRICE_PRO,
  PRICE_STARTER,
  PRICING_DESCRIPTION,
  PRICING_TITLE,
  PRO_QUOTA,
  PRODUCT_NAME,
  SITE_URL,
  STARTER_QUOTA,
  usdAmount,
} from '@/config/seo-site';

const INDEXABLE_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

const THIN_SHELL_ROUTE_IDS = new Set([
  '/prompts',
  '/showcases',
  '/posts',
  '/posts/',
  '/blog',
  '/blog/',
]);

export type PublicRobotsMatch = {
  routeId?: string;
  status?: string;
  globalNotFound?: boolean;
  loaderData?: unknown;
};

function blogPostFromLoader(
  loaderData: unknown
): { withheld?: boolean; source?: string; preview?: boolean } | undefined {
  if (!loaderData || typeof loaderData !== 'object') return undefined;
  const post = (loaderData as { post?: unknown }).post;
  if (!post || typeof post !== 'object') return undefined;
  return post as { withheld?: boolean; source?: string; preview?: boolean };
}

/**
 * One robots directive for the root document. Thin galleries and withdrawn
 * template articles are noindex. A real guest post on /blog/$slug stays
 * indexable. Not-found matches are noindex.
 */
export function publicRobotsContent(
  matches: readonly PublicRobotsMatch[]
): string {
  for (const match of matches) {
    if (match.status === 'notFound' || match.globalNotFound) {
      return 'noindex, nofollow';
    }
    const id = match.routeId ?? '';
    if (id === '/posts/$slug') return 'noindex, nofollow';
    if (id === '/blog/$slug') {
      const post = blogPostFromLoader(match.loaderData);
      if (post?.withheld || post?.source === 'local' || post?.preview) {
        return 'noindex, nofollow';
      }
    }
    if (THIN_SHELL_ROUTE_IDS.has(id)) return 'noindex, follow';
  }
  return INDEXABLE_ROBOTS;
}

/** WebSite + Organization. No SearchAction: /workspace is not a route. */
export function websiteStructuredData(name: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name,
        description,
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name,
        url: SITE_URL,
        logo: absoluteUrl('/logo.png'),
      },
    ],
  };
}

export function robotsMeta(robots: string) {
  return [
    { name: 'robots', content: robots },
    { name: 'googlebot', content: robots },
    { name: 'bingbot', content: robots },
  ];
}

/** Title, description, Open Graph, a self canonical, and robots. */
export function selfCanonicalHead(
  path: string,
  title: string,
  description: string,
  robots = 'noindex, follow'
) {
  const url = absoluteUrl(path);
  const image = absoluteUrl('/logo.png');
  return {
    meta: [
      ...socialMeta(title, description, url, image),
      ...robotsMeta(robots),
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}

function jsonLd(data: unknown) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(data).replace(/</g, '\\u003c'),
  };
}

function socialMeta(
  title: string,
  description: string,
  url: string,
  image: string
) {
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:site_name', content: PRODUCT_NAME },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ];
}

export function homeSeoHead() {
  const url = absoluteUrl('/');
  const image = absoluteUrl('/seo/demo-poster.webp');
  const faq = homeFaq();
  return {
    meta: socialMeta(HOME_TITLE, HOME_DESCRIPTION, url, image),
    links: [{ rel: 'canonical', href: url }],
    scripts: [
      jsonLd({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'SoftwareApplication',
            name: PRODUCT_NAME,
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Web',
            description: HOME_DESCRIPTION,
            url: SITE_URL,
            offers: [
              {
                '@type': 'Offer',
                name: 'Starter',
                price: usdAmount(PRICE_STARTER),
                priceCurrency: 'USD',
                description: `${STARTER_QUOTA} generations per month, 720P standard, no watermark, commercial license. 1080P counts as 2 generations`,
              },
              {
                '@type': 'Offer',
                name: 'Pro',
                price: usdAmount(PRICE_PRO),
                priceCurrency: 'USD',
                description: `${PRO_QUOTA} generations per month, 1080P, priority queue`,
              },
            ],
          },
          {
            '@type': 'FAQPage',
            mainEntity: faq.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
                  .map((paragraph) => paragraphText(paragraph))
                  .join(' '),
              },
            })),
          },
        ],
      }),
    ],
  };
}

export function aiVideoGeneratorSeoHead() {
  const url = absoluteUrl('/ai-video-generator');
  const image = absoluteUrl('/logo.png');
  return {
    meta: socialMeta(
      AI_VIDEO_GENERATOR_TITLE,
      AI_VIDEO_GENERATOR_DESCRIPTION,
      url,
      image
    ),
    links: [{ rel: 'canonical', href: url }],
  };
}

export function pricingSeoHead() {
  const url = absoluteUrl('/pricing');
  const image = absoluteUrl('/seo/demo-poster.webp');
  const page = pricingPageModel();
  return {
    meta: socialMeta(PRICING_TITLE, PRICING_DESCRIPTION, url, image),
    links: [{ rel: 'canonical', href: url }],
    scripts: [
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        url,
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }),
    ],
  };
}

export function subpageSeoHead(page: SeoPage) {
  const url = absoluteUrl(page.path);
  const figure = page.sections.find((section) => section.figure)?.figure;
  const image = absoluteUrl(figure?.src ?? '/seo/demo-poster.webp');
  return {
    meta: socialMeta(page.title, page.description, url, image),
    links: [{ rel: 'canonical', href: url }],
    scripts: [
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'AI motion graphics generator',
            item: absoluteUrl('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: page.h1,
            item: url,
          },
        ],
      }),
    ],
  };
}
