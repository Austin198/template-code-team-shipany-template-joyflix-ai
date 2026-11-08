import { describe, expect, it } from 'vitest';

import {
  collectPageText,
  COMPARISON_FOOTNOTE,
  COMPARISON_ROWS,
  countWords,
  getSeoPage,
  HOME_H1,
  HOME_STEPS,
  HOME_WHAT_IS,
  homeBodyText,
  homeFaq,
  paragraphText,
  pricingPageModel,
  relatedStylePages,
  retiredSeoTarget,
  SEO_PATH_REDIRECT_STATUS,
  SEO_SLUG_PAGES,
  seoPathRedirect,
  seoSitemapPaths,
  STYLE_PAGES,
  STYLE_PLAN_LINE,
  STYLE_RELATED,
} from '@/config/seo-landings';
import {
  absoluteUrl,
  AI_VIDEO_GENERATOR_DESCRIPTION,
  AI_VIDEO_GENERATOR_H1,
  AI_VIDEO_GENERATOR_TITLE,
  apexRedirectUrl,
  canonicalSiteUrl,
  FREE_QUOTA,
  HOME_DESCRIPTION,
  HOME_KEYWORD,
  HOME_TITLE,
  isSeoSlug,
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
import {
  aiVideoGeneratorSeoHead,
  homeSeoHead,
  subpageSeoHead,
} from '@/lib/seo-document';

import en from '../../messages/en.json';

const FAQ_QUESTIONS = [
  'Is there a free AI motion graphics generator?',
  'How is this different from Magnific Move?',
  'Can I edit the text after the video is generated?',
  'Do I need motion design experience?',
  'What format can I export?',
  'Can I use the output commercially?',
];

function metaTitle(
  meta: ReadonlyArray<{ title?: string; name?: string; content?: string }>
): string | undefined {
  return meta.find((item) => typeof item.title === 'string')?.title;
}

function titleOwns(title: string, keyword: string): boolean {
  return title === keyword || title.startsWith(`${keyword} `);
}

describe('seo landings', () => {
  it('publishes the landing urls plus pricing and the generator', () => {
    const paths = seoSitemapPaths();
    const landings = [
      '/',
      ...STYLE_PAGES.map((page) => page.path),
      ...SEO_SLUG_PAGES.map((page) => page.path),
    ];
    expect(paths).toEqual([...landings, '/pricing', '/ai-video-generator']);
    expect(paths).toHaveLength(14);
    expect(new Set(paths).size).toBe(14);
    expect(paths).not.toContain('/free-motion-graphics-generator');
    expect(paths).not.toContain('/prompts');
    expect(paths).not.toContain('/showcases');
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
      'Type a sentence and get an editable motion graphics video. Click any on-screen text to fix the wording, then export MP4. Starter $19/mo, no free quota.'
    );
    expect(HOME_DESCRIPTION.length).toBeGreaterThanOrEqual(150);
    expect(HOME_DESCRIPTION.length).toBeLessThanOrEqual(160);
    expect(HOME_DESCRIPTION.toLowerCase()).not.toContain('free to try');
    expect(HOME_DESCRIPTION.toLowerCase()).not.toContain('free trial');
    expect(HOME_DESCRIPTION.toLowerCase()).toContain('no free quota');
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

  it('whitelists only the six styles and five slugs', () => {
    expect(STYLE_PAGES.map((page) => page.slug)).toEqual([...STYLE_SLUG_LIST]);
    expect(SEO_SLUG_PAGES.map((page) => page.slug)).toEqual([...SEO_SLUG_LIST]);
    expect(collectPageText(SEO_SLUG_PAGES[0]!).length).toBeGreaterThan(0);
    expect(isSeoSlug('free-motion-graphics-generator')).toBe(false);
    expect(getSeoPage('free-motion-graphics-generator')).toBeUndefined();
  });

  it('redirects trailing slashes, queries, and /zh copies of indexable urls', () => {
    expect(seoPathRedirect(new URL(`${SITE_URL}/`))).toBeNull();
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
    expect(
      seoPathRedirect(
        new URL(`${SITE_URL}/ai-video-generator?prompt=hello&model=x`)
      )
    ).toBeNull();
    expect(seoPathRedirect(new URL(`${SITE_URL}/motion-graphics`))).toBeNull();
    expect(seoPathRedirect(new URL(`${SITE_URL}/not-a-page`))).toBeNull();
  });

  it('publishes every sitemap loc on the apex', () => {
    expect(SITE_URL).toBe('https://aniform.online');
    const locs = seoSitemapPaths().map((path) => absoluteUrl(path));
    expect(locs).toHaveLength(14);
    expect(locs[0]).toBe('https://aniform.online');
    expect(locs).toContain('https://aniform.online/pricing');
    expect(locs).toContain('https://aniform.online/ai-video-generator');
    expect(locs).not.toContain(
      'https://aniform.online/free-motion-graphics-generator'
    );
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

  it('301s the retired free landing to the apex homepage', () => {
    expect(SEO_PATH_REDIRECT_STATUS).toBe(301);
    expect(retiredSeoTarget('free-motion-graphics-generator')).toBe('/');
    expect(retiredSeoTarget('/free-motion-graphics-generator/')).toBe('/');
    const cases = [
      `${SITE_URL}/free-motion-graphics-generator`,
      `${SITE_URL}/free-motion-graphics-generator/`,
      `${SITE_URL}/free-motion-graphics-generator?utm=1`,
      `${SITE_URL}/zh/free-motion-graphics-generator`,
      `${SITE_URL}/zh/free-motion-graphics-generator/`,
      `${SITE_URL}/zh/free-motion-graphics-generator?x=1`,
    ];
    for (const input of cases) {
      const path = seoPathRedirect(new URL(input));
      expect(path, input).toBe('/');
      expect(new URL(path!, SITE_URL).toString()).toBe(`${SITE_URL}/`);
    }
    const linked = JSON.stringify({
      faq: homeFaq(),
      steps: HOME_STEPS,
      styles: STYLE_PAGES,
      slugs: SEO_SLUG_PAGES,
    });
    expect(linked).not.toContain('free-motion-graphics-generator');
    expect(linked).not.toContain('No Credit Card');
    expect(linked).not.toContain('Edit Elements, No Timeline');
    expect(HOME_TITLE).not.toMatch(/no credit card/i);
  });

  it('gives each primary page one title and h1 and does not reuse them', () => {
    const videoPage = SEO_SLUG_PAGES.find(
      (page) => page.path === '/ai-motion-video-generator'
    );
    const editorPage = SEO_SLUG_PAGES.find(
      (page) => page.path === '/motion-graphics-editor'
    );
    expect(videoPage).toBeDefined();
    expect(editorPage).toBeDefined();

    const primaries = [
      {
        path: '/',
        keyword: 'AI Motion Graphics Generator',
        title: HOME_TITLE,
        h1: HOME_H1,
      },
      {
        path: '/ai-motion-video-generator',
        keyword: 'AI Motion Video Generator',
        title: videoPage!.title,
        h1: videoPage!.h1,
      },
      {
        path: '/motion-graphics-editor',
        keyword: 'Motion Graphics Editor',
        title: editorPage!.title,
        h1: editorPage!.h1,
      },
      {
        path: '/ai-video-generator',
        keyword: 'AI Video Generator',
        title: AI_VIDEO_GENERATOR_TITLE,
        h1: AI_VIDEO_GENERATOR_H1,
      },
    ] as const;

    expect(HOME_KEYWORD).toBe('AI Motion Graphics Generator');
    expect(HOME_TITLE).toBe(
      'AI Motion Graphics Generator – Type a Prompt, Get a Video'
    );
    expect(videoPage!.title).toBe(
      'AI Motion Video Generator – Prompt to MP4 Video'
    );
    expect(editorPage!.title).toBe(
      'Motion Graphics Editor – Click Any Element to Edit'
    );
    expect(AI_VIDEO_GENERATOR_TITLE).toBe('AI Video Generator');
    expect(AI_VIDEO_GENERATOR_DESCRIPTION).toContain('Aniform');
    expect(AI_VIDEO_GENERATOR_DESCRIPTION.toLowerCase()).not.toContain(
      'free generation'
    );

    const landings = [
      { path: '/', title: HOME_TITLE, h1: HOME_H1 },
      ...STYLE_PAGES.map((page) => ({
        path: page.path,
        title: page.title,
        h1: page.h1,
      })),
      ...SEO_SLUG_PAGES.map((page) => ({
        path: page.path,
        title: page.title,
        h1: page.h1,
      })),
      {
        path: '/pricing',
        title: 'Aniform pricing',
        h1: 'Aniform pricing',
      },
      {
        path: '/ai-video-generator',
        title: AI_VIDEO_GENERATOR_TITLE,
        h1: AI_VIDEO_GENERATOR_H1,
      },
    ];

    for (const page of primaries) {
      expect(page.h1, page.path).toBe(page.keyword);
      expect(titleOwns(page.title, page.keyword), page.title).toBe(true);
      const owners = landings.filter(
        (landing) =>
          landing.h1 === page.keyword || titleOwns(landing.title, page.keyword)
      );
      expect(owners.map((landing) => landing.path)).toEqual([page.path]);
      for (const other of landings) {
        if (other.path === page.path) continue;
        expect(other.title, other.path).not.toContain(page.keyword);
        expect(other.h1, other.path).not.toContain(page.keyword);
      }
    }

    expect(metaTitle(homeSeoHead().meta)).toBe(HOME_TITLE);
    expect(metaTitle(subpageSeoHead(videoPage!).meta)).toBe(videoPage!.title);
    expect(metaTitle(subpageSeoHead(editorPage!).meta)).toBe(editorPage!.title);
    const videoHead = aiVideoGeneratorSeoHead();
    expect(metaTitle(videoHead.meta)).toBe(AI_VIDEO_GENERATOR_TITLE);
    expect(videoHead.links.find((link) => link.rel === 'canonical')?.href).toBe(
      'https://aniform.online/ai-video-generator'
    );
    expect(en['app.generator.video_title']).toBe(AI_VIDEO_GENERATOR_H1);
    expect(en['ai.video.metadata.title']).toBe(AI_VIDEO_GENERATOR_TITLE);
  });

  it('cross-links the six style pages and states plans once', () => {
    const incoming = new Map(STYLE_PAGES.map((page) => [page.slug, 0]));
    const seen = new Set<string>();
    const queue = [STYLE_PAGES[0]!.slug];
    while (queue.length > 0) {
      const slug = queue.pop()!;
      if (seen.has(slug)) continue;
      seen.add(slug);
      const targets = STYLE_RELATED[slug as keyof typeof STYLE_RELATED];
      for (const next of targets) queue.push(next);
      for (const [from, links] of Object.entries(STYLE_RELATED)) {
        if (links.includes(slug as (typeof links)[number])) queue.push(from);
      }
    }
    expect([...seen].sort()).toEqual(
      STYLE_PAGES.map((page) => page.slug).sort()
    );
    expect(STYLE_RELATED['logo-animation']).toEqual([
      'youtube-intro',
      'kinetic-typography',
      'social-media-ads',
    ]);

    for (const page of STYLE_PAGES) {
      expect(page.navLabel, page.slug).toBeTruthy();
      expect(page.path).toBe(`/motion-graphics/${page.slug}`);
      const related = relatedStylePages(page.slug);
      const slugs = related.map((item) => item.slug);
      expect(slugs, page.slug).toHaveLength(3);
      expect(new Set(slugs).size, page.slug).toBe(3);
      expect(slugs, page.slug).not.toContain(page.slug);
      for (const item of related) {
        expect(item.path).toBe(`/motion-graphics/${item.slug}`);
        expect(item.navLabel).toBeTruthy();
        incoming.set(item.slug, (incoming.get(item.slug) ?? 0) + 1);
      }
      const body = page.sections
        .flatMap((section) =>
          section.paragraphs.map((paragraph) => paragraphText(paragraph))
        )
        .join('\n')
        .toLowerCase();
      expect(body, page.slug).not.toMatch(/\$19|\$49/);
      expect(body, page.slug).not.toMatch(
        /free generation|free quota|for free|no free/
      );
    }

    for (const [slug, count] of incoming) {
      expect(count, slug).toBeGreaterThan(0);
    }

    const line = paragraphText(STYLE_PLAN_LINE);
    expect(line.match(/no free generation quota/gi)).toHaveLength(1);
    expect(line).toContain('$19/mo');
    expect(line).toContain('60 generations');
    expect(line).toContain('$49/mo');
    expect(line).toContain('200 generations');
    expect(line).toContain('pricing');
    expect(STYLE_PAGES.map((page) => page.navLabel)).toEqual([
      'Social ads',
      'YouTube intros',
      'Explainer videos',
      'Logo animation',
      'Kinetic typography',
      'Data videos',
    ]);
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
