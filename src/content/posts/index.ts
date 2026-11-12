import type { ComponentType } from 'react';

/**
 * Local MDX filenames still sit in this directory, but they are template
 * articles and are not loaded. `BLOG_POST_SLUGS` only marks those URLs so
 * the blog route can withhold them. They are not in the sitemap.
 *
 * This module is isomorphic (safe in client bundles). Database posts are
 * fetched through the server functions in ./server.ts.
 */
export const BLOG_POST_SLUGS = [
  'what-is-shipany',
  'blocks-vs-components',
] as const;

export type BlogPostMeta = {
  title: string;
  description: string;
  created_at: string;
  author_name?: string;
  author_image?: string;
  image?: string;
};

type PostModule = {
  default: ComponentType;
  meta: BlogPostMeta;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  /** ISO date string — serializable across loader/server-fn boundaries */
  createdAt: string;
  authorName?: string;
  authorImage?: string;
  source: 'local' | 'db';
  /** A paid guest post: shown with a Sponsored label, links rel="sponsored". */
  sponsored?: boolean;
};

export type BlogPostDetail = BlogPost & {
  /** Raw markdown — set for database posts */
  content?: string;
  /** An unpublished guest post shown to its author or a reviewer. */
  preview?: boolean;
  /**
   * A leftover template article. The public page must not render its body
   * or title.
   */
  withheld?: boolean;
  /** Preview only: where the submission stands, for the banner's next step. */
  previewInfo?: {
    guestPostId: string;
    status: string;
    isAuthor: boolean;
    /** Package price, formatted on the client. */
    priceInCents: number;
    currency: string;
    /** Submit rules, checked before checkout. */
    minWords: number;
    maxLinks: number;
  };
};

/**
 * Template MDX in this directory is not published. Returning null keeps the
 * ShipAny article text out of the client bundle.
 */
export function loadLocalPost(
  _slug: string,
  _locale: string
): PostModule | null {
  return null;
}

export function getLocalPosts(_locale: string): BlogPost[] {
  return [];
}

/**
 * Merge database posts with local MDX posts, deduped by slug
 * (database wins), newest first.
 */
export function mergePosts(
  dbPosts: BlogPost[],
  localPosts: BlogPost[],
  options: { limit?: number } = {}
): BlogPost[] {
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const merged = [
    ...dbPosts,
    ...localPosts.filter((p) => !dbSlugs.has(p.slug)),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return options.limit ? merged.slice(0, options.limit) : merged;
}

export function formatPostDate(dateIso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: locale === 'zh' ? 'long' : 'short',
    day: 'numeric',
  }).format(new Date(dateIso));
}
