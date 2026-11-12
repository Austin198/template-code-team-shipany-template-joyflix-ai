import { describe, expect, it } from 'vitest';

import {
  publicRobotsContent,
  selfCanonicalHead,
  websiteStructuredData,
} from '@/lib/seo-document';

import {
  HOME_TITLE,
  PROMPTS_TITLE,
  publicAppDescription,
  SHOWCASES_TITLE,
  SITE_DESCRIPTION,
} from './seo-site';

describe('public app description', () => {
  it('replaces leftover template descriptions and keeps a custom one', () => {
    expect(
      publicAppDescription('AI Video, Image & Music Generation Studio')
    ).toBe(SITE_DESCRIPTION);
    expect(publicAppDescription('Ship your SaaS faster')).toBe(
      SITE_DESCRIPTION
    );
    expect(publicAppDescription('  ')).toBe(SITE_DESCRIPTION);
    expect(publicAppDescription('A custom Aniform note')).toBe(
      'A custom Aniform note'
    );
    expect(SITE_DESCRIPTION).not.toMatch(/image & music|joyflix|shipany/i);
    expect(HOME_TITLE).toBe(
      'AI Motion Graphics Generator – Type a Prompt, Get a Video'
    );
  });
});

describe('thin-page heads', () => {
  it('keeps prompts and showcases self-canonical and noindex', () => {
    for (const [path, title] of [
      ['/prompts', PROMPTS_TITLE],
      ['/showcases', SHOWCASES_TITLE],
    ] as const) {
      const head = selfCanonicalHead(path, title, SITE_DESCRIPTION);
      const ogUrl = head.meta.find((item) => item.property === 'og:url');
      const robots = head.meta.find((item) => item.name === 'robots');
      expect(ogUrl && 'content' in ogUrl ? ogUrl.content : '').toBe(
        `https://aniform.online${path}`
      );
      expect(head.links[0]?.href).toBe(`https://aniform.online${path}`);
      expect(robots && 'content' in robots ? robots.content : '').toContain(
        'noindex'
      );
      expect(title).not.toBe(HOME_TITLE);
      expect(title).not.toMatch(/joyflix|shipany/i);
    }
  });
});

describe('website structured data', () => {
  it('describes Aniform and does not search /workspace', () => {
    const json = JSON.stringify(
      websiteStructuredData('Aniform', SITE_DESCRIPTION)
    );
    expect(json).not.toContain('SearchAction');
    expect(json).not.toContain('/workspace');
    expect(json).not.toContain('Image & Music');
    expect(json).toContain(SITE_DESCRIPTION);
  });
});

describe('public robots', () => {
  it('noindexes 404s, thin shells, and template articles', () => {
    expect(
      publicRobotsContent([{ routeId: '__root__', status: 'success' }])
    ).toContain('index, follow');
    expect(
      publicRobotsContent([{ status: 'notFound', globalNotFound: true }])
    ).toBe('noindex, nofollow');
    expect(
      publicRobotsContent([{ routeId: '/prompts', status: 'success' }])
    ).toBe('noindex, follow');
    expect(
      publicRobotsContent([{ routeId: '/showcases', status: 'success' }])
    ).toBe('noindex, follow');
    expect(
      publicRobotsContent([{ routeId: '/blog/', status: 'success' }])
    ).toBe('noindex, follow');
    expect(
      publicRobotsContent([{ routeId: '/posts/$slug', status: 'success' }])
    ).toBe('noindex, nofollow');
    expect(
      publicRobotsContent([
        {
          routeId: '/blog/$slug',
          status: 'success',
          loaderData: { post: { source: 'local', withheld: true } },
        },
      ])
    ).toBe('noindex, nofollow');
    expect(
      publicRobotsContent([
        {
          routeId: '/blog/$slug',
          status: 'success',
          loaderData: { post: { source: 'db', withheld: false } },
        },
      ])
    ).toContain('index, follow');
  });
});
