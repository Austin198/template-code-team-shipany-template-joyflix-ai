import { getRouteApi } from '@tanstack/react-router';

import { openCookieSettings } from '@/lib/cookie-consent';
import { m } from '@/paraglide/messages.js';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';

const rootRoute = getRouteApi('__root__');

export function Footer() {
  const cookieConsentEnabled =
    !!rootRoute.useLoaderData()?.cookieConsentEnabled;
  const columns: FooterColumn[] = [
    {
      title: m['landing.footer.product'](),
      links: [
        {
          label: 'AI Video Generator',
          href: '/ai-video-generator',
        },
        {
          label: 'Prompts Library',
          href: '/prompts',
        },
        {
          label: 'Showcases',
          href: '/showcases',
        },
      ],
    },
    {
      title: m['landing.footer.resources'](),
      links: [{ label: m['landing.nav.pricing'](), href: '/pricing' }],
    },
    {
      title: m['landing.footer.legal'](),
      links: [
        { label: m['landing.footer.privacy'](), href: '/privacy-policy' },
        { label: m['landing.footer.terms'](), href: '/terms-of-service' },
        ...(cookieConsentEnabled
          ? [
              {
                label: m['landing.footer.cookie_settings'](),
                onClick: openCookieSettings,
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <SiteFooter tagline={m['landing.footer.tagline']()} columns={columns} />
  );
}
