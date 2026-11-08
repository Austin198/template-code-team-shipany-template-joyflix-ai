import { describe, expect, it } from 'vitest';

import {
  collectPageText,
  COMPARISON_FOOTNOTE,
  COMPARISON_ROWS,
  countWords,
  HOME_STEPS,
  HOME_WHAT_IS,
  homeBodyText,
  homeFaq,
  paragraphText,
  pricingPageModel,
  SEO_SLUG_PAGES,
  seoPathRedirect,
  seoSitemapPaths,
  STYLE_PAGES,
} from '@/config/seo-landings';
import {
  absoluteUrl,
  apexRedirectUrl,
  canonicalSiteUrl,
  FREE_QUOTA,
  HOME_DESCRIPTION,
  HOME_TITLE,
  PRICE_PRO,
  PRICE_STARTER,
  PRO_QUOTA,
  PRODUCT_NAME,
  requestApexRedirect,
  SEO_SLUG_LIST,
  SITE_URL,
  STARTER_QUOTA,
  STYLE_SLUG_LIST,
} from '@/config/seo-site';

const FAQ_QUESTIONS = [
  'Is there a free AI motion graphics generator?',
  'How is this different from Magnific Move?',
  'Can I edit the text after the video is generated?',
  'Do I need motion design experience?',
  'What format can I export?',
  'Can I use the output commercially?',
];

describe('seo landings', () => {
  it('publishes exactly 13 sitemap urls from the page data', () => {
    const paths = seoSitemapPaths();
    expect(paths).toHaveLength(13);
    expect(new Set(paths).size).toBe(13);
    expect(paths[0]).toBe('/');
    expect(
      STYLE_PAGES.map((page) => page.path).every((path) => paths.includes(path))
    ).toBe(true);
    expect(
      SEO_SLUG_PAGES.map((page) => page.path).every((path) =>
        paths.includes(path)
      )
    ).toBe(true);
  });

  it('keeps the free generation quota at zero', () => {
    expect(FREE_QUOTA).toBe(0);
    expect(PRODUCT_NAME).toBe('Aniform');
    expect(PRICE_STARTER).toBe('$19/mo');
    expect(PRICE_PRO).toBe('$49/mo');
    expect(STARTER_QUOTA).toBe(60);
    expect(PRO_QUOTA).toBe(200);
    const aniform = COMPARISON_ROWS[0];
    expect(aniform?.tool).toBe(PRODUCT_NAME);
    expect(aniform?.cells[3]).toBe('No');
    for (const row of COMPARISON_ROWS.slice(1)) {
      expect(row.cells.every((cell) => cell === '—')).toBe(true);
    }
    expect(COMPARISON_FOOTNOTE).toContain('November 2026');
  });

  it('keeps the six FAQ questions and does not advertise a free quota', () => {
    const faq = homeFaq();
    expect(faq.map((item) => item.question)).toEqual(FAQ_QUESTIONS);
    const answers = faq
      .map((item) =>
        item.answer.map((paragraph) => paragraphText(paragraph)).join(' ')
      )
      .join('\n')
      .toLowerCase();
    expect(answers).toContain('does not offer a free generation quota');
    expect(answers).not.toContain('free generations');
    expect(answers).not.toContain('free trial');
  });

  it('uses the exact homepage title and description', () => {
    expect(HOME_TITLE).toBe(
      'AI Motion Graphics Generator – Type a Prompt, Get a Video'
    );
    expect(HOME_DESCRIPTION).toBe(
      'Turn a sentence into animated motion graphics. Describe your scene, retype any on-screen text, change colors and timing, then export MP4. There is no free generation quota, and no timeline skills are needed.'
    );
    expect(HOME_DESCRIPTION.toLowerCase()).not.toContain('free to try');
    expect(HOME_DESCRIPTION.toLowerCase()).toContain(
      'no free generation quota'
    );
    expect(HOME_TITLE.toLowerCase()).not.toContain('magnific');
    expect(HOME_DESCRIPTION.toLowerCase()).not.toContain('magnific');
  });

  it('stays inside the word-count ranges', () => {
    const whatIs = countWords(HOME_WHAT_IS.paragraphs.join(' '));
    expect(whatIs).toBeGreaterThanOrEqual(120);
    expect(whatIs).toBeLessThanOrEqual(200);
    expect(
      HOME_WHAT_IS.paragraphs.join(' ').match(/ai motion graphics generator/g)
    ).toHaveLength(1);

    for (const step of HOME_STEPS) {
      const words = countWords(
        step.paragraphs.map((paragraph) => paragraphText(paragraph)).join(' ')
      );
      expect(words, step.h3).toBeGreaterThanOrEqual(40);
      expect(words, step.h3).toBeLessThanOrEqual(80);
    }

    for (const page of STYLE_PAGES) {
      const summary = countWords(page.summary ?? '');
      expect(summary, page.slug).toBeGreaterThanOrEqual(40);
      expect(summary, page.slug).toBeLessThanOrEqual(60);
      const body = countWords(
        page.sections
          .flatMap((section) =>
            section.paragraphs.map((paragraph) => paragraphText(paragraph))
          )
          .join(' ')
      );
      expect(body, page.slug).toBeGreaterThanOrEqual(400);
      expect(body, page.slug).toBeLessThanOrEqual(700);
    }

    for (const page of SEO_SLUG_PAGES) {
      const body = countWords(
        page.sections
          .flatMap((section) =>
            section.paragraphs.map((paragraph) => paragraphText(paragraph))
          )
          .join(' ')
      );
      expect(body, page.slug).toBeGreaterThanOrEqual(600);
      expect(body, page.slug).toBeLessThanOrEqual(1200);
    }

    const homeWords = countWords(homeBodyText());
    expect(homeWords).toBeGreaterThanOrEqual(800);
    expect(homeWords).toBeLessThanOrEqual(1500);
  });

  it('whitelists only the six styles and six slugs', () => {
    expect(STYLE_PAGES.map((page) => page.slug)).toEqual([...STYLE_SLUG_LIST]);
    expect(SEO_SLUG_PAGES.map((page) => page.slug)).toEqual([...SEO_SLUG_LIST]);
    expect(collectPageText(SEO_SLUG_PAGES[0]!).length).toBeGreaterThan(0);
  });

  it('redirects trailing slashes, queries, and /zh copies of indexable urls', () => {
    expect(seoPathRedirect(new URL(`${SITE_URL}/`))).toBeNull();
    expect(
      seoPathRedirect(new URL(`${SITE_URL}/free-motion-graphics-generator`))
    ).toBeNull();
    expect(
      seoPathRedirect(new URL(`${SITE_URL}/free-motion-graphics-generator/`))
    ).toBe('/free-motion-graphics-generator');
    expect(
      seoPathRedirect(
        new URL(`${SITE_URL}/motion-graphics/logo-animation?utm=1`)
      )
    ).toBe('/motion-graphics/logo-animation');
    expect(seoPathRedirect(new URL(`${SITE_URL}/zh`))).toBe('/');
    expect(
      seoPathRedirect(new URL(`${SITE_URL}/zh/motion-graphics-editor/`))
    ).toBe('/motion-graphics-editor');
    expect(seoPathRedirect(new URL(`${SITE_URL}/pricing?plan=pro`))).toBeNull();
    expect(seoPathRedirect(new URL(`${SITE_URL}/motion-graphics`))).toBeNull();
    expect(seoPathRedirect(new URL(`${SITE_URL}/not-a-page`))).toBeNull();
  });

  it('publishes every sitemap loc on the apex', () => {
    expect(SITE_URL).toBe('https://aniform.online');
    const locs = seoSitemapPaths().map((path) => absoluteUrl(path));
    expect(locs).toHaveLength(13);
    expect(locs[0]).toBe('https://aniform.online');
    expect(absoluteUrl('/sitemap.xml')).toBe(
      'https://aniform.online/sitemap.xml'
    );
    expect(locs.every((loc) => loc.startsWith('https://aniform.online'))).toBe(
      true
    );
    expect(locs.some((loc) => loc.includes('aniform.ai'))).toBe(false);
  });

  it('redirects www and retired hosts to the apex with the same path and query', () => {
    expect(
      apexRedirectUrl(new URL('https://www.aniform.online/pricing?plan=pro'))
    ).toBe('https://aniform.online/pricing?plan=pro');
    expect(apexRedirectUrl(new URL('https://www.aniform.online/'))).toBe(
      'https://aniform.online/'
    );
    expect(apexRedirectUrl(new URL('https://aniform.ai/sitemap.xml?x=1'))).toBe(
      'https://aniform.online/sitemap.xml?x=1'
    );
    expect(apexRedirectUrl(new URL('https://www.aniform.ai/robots.txt'))).toBe(
      'https://aniform.online/robots.txt'
    );
    expect(apexRedirectUrl(new URL(`${SITE_URL}/pricing?plan=pro`))).toBeNull();
    expect(
      apexRedirectUrl(new URL('http://localhost:3000/pricing'))
    ).toBeNull();
    expect(canonicalSiteUrl('https://aniform.ai')).toBe(SITE_URL);
    expect(canonicalSiteUrl('https://www.aniform.online/app')).toBe(SITE_URL);
    expect(canonicalSiteUrl('http://localhost:3000')).toBe(
      'http://localhost:3000'
    );
    expect(canonicalSiteUrl(undefined)).toBeUndefined();

    const proxied = new Request('http://internal/pricing?plan=pro', {
      headers: { host: 'www.aniform.online' },
    });
    expect(requestApexRedirect(proxied)).toBe(
      'https://aniform.online/pricing?plan=pro'
    );
    expect(
      requestApexRedirect(new Request('https://aniform.online/pricing'))
    ).toBeNull();
  });

  it('keeps pricing on the two monthly plans and off credit packs', () => {
    const page = pricingPageModel();
    const text = [
      page.h1,
      page.intro,
      page.description,
      ...page.plans.flatMap((plan) => [plan.h3, plan.paragraph]),
      ...page.faq.flatMap((item) => [item.question, item.answer]),
    ]
      .join('\n')
      .toLowerCase();
    expect(page.h1).toBe('Aniform pricing');
    expect(text).toContain('$19/mo');
    expect(text).toContain('$49/mo');
    expect(text).toContain('60 generations');
    expect(text).toContain('200 generations');
    expect(text).toContain('does not offer a free generation quota');
    expect(text).toContain('monthly');
    expect(text).toContain('does not sell one-time credit packs');
    expect(text).not.toContain('joyflix');
    expect(text).not.toContain('joyfly');
    expect(text).not.toContain('9.99');
    expect(text).not.toContain('49.99');
    expect(text).not.toContain('99.99');
    expect(text).not.toContain('free to try');
  });
});
