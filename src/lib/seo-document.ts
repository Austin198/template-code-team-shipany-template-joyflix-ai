import {
  homeFaq,
  paragraphText,
  pricingPageModel,
  type SeoPage,
} from '@/config/seo-landings';
import {
  absoluteUrl,
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
                description: `${STARTER_QUOTA} generations per month, 1080p, no watermark, commercial license`,
              },
              {
                '@type': 'Offer',
                name: 'Pro',
                price: usdAmount(PRICE_PRO),
                priceCurrency: 'USD',
                description: `${PRO_QUOTA} generations per month, 4K, transparent background export, priority queue`,
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
