import { createFileRoute } from '@tanstack/react-router';

import { seoSitemapPaths } from '@/config/seo-landings';
import { absoluteUrl } from '@/config/seo-site';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const urls = seoSitemapPaths().map(
          (path) => `  <url>\n    <loc>${absoluteUrl(path)}</loc>\n  </url>`
        );
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          '</urlset>',
          '',
        ].join('\n');
        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        });
      },
    },
  },
});
