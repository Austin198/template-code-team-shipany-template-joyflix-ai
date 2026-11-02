/// <reference types="vite/client" />
import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  ScrollRestoration,
  type ErrorComponentProps,
} from '@tanstack/react-router';
import { createMiddleware, createServerFn } from '@tanstack/react-start';
import { ThemeProvider } from 'next-themes';

import { SessionProvider, type AuthSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import {
  APPEARANCE_CONFIG_KEYS,
  APPEARANCE_ENABLED_KEY,
  APPEARANCE_KEYS,
  appearanceStyle,
  COLOR_MODE_CONFIG_KEY,
  DEFAULT_APPEARANCE,
  DEFAULT_COLOR_MODE,
  isColorMode,
  mergeAppearance,
  pickAppearance,
  THEME_COOKIE,
} from '@/config/appearance';
import { parseCookieConsent } from '@/lib/cookie-consent';
import { getQueryClient } from '@/lib/query-client';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { useAppearance } from '@/hooks/use-appearance';
import { useCookieConsent } from '@/hooks/use-cookie-consent';
import { CookieConsent } from '@/blocks/cookie-consent';
import { Ads } from '@/components/analytics/ads';
import { GoogleAnalytics } from '@/components/analytics/google-analytics';
import { Plausible } from '@/components/analytics/plausible';
import { CustomerService } from '@/components/customer-service';
import { GoogleOneTap } from '@/components/google-one-tap';
import { SandboxPreviewBridge } from '@/components/sandbox-preview-bridge';
import { TopBanner } from '@/components/top-banner';
import { Toaster } from '@/components/ui/sonner';

import '@fontsource-variable/inter';
import '@fontsource-variable/nunito';
import '@fontsource-variable/source-serif-4';
import '@fontsource/libre-baskerville/400.css';
import '@fontsource/libre-baskerville/700.css';
import '@fontsource/libre-baskerville/400-italic.css';
import '@/styles/globals.css';

const authMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ request, next }) => {
    let session: AuthSession | null = null;
    try {
      if (request?.headers) {
        const { getAuth } = await import('@/core/auth');
        const auth = getAuth();
        const sessionRes = await auth.api.getSession({
          headers: request.headers,
        });
        if (sessionRes?.user) {
          session = {
            user: sessionRes.user,
            session: {
              ...sessionRes.session,
              expiresAt:
                sessionRes.session.expiresAt instanceof Date
                  ? sessionRes.session.expiresAt.toISOString()
                  : sessionRes.session.expiresAt,
            },
          };
        }
      }
    } catch (err) {
      console.error('Failed to get server session in root middleware:', err);
    }
    return next({
      context: { session },
    });
  }
);

// Analytics IDs & Auth Session live on the server / DB config. Fetched via a
// server function so drizzle/db code never reaches the client bundle.
const getAnalyticsConfigs = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const session = context.session ?? null;

    try {
      const { getAllConfigs } = await import('@/modules/config/service');
      const { getCookie } = await import('@tanstack/react-start/server');
      const configs = await getAllConfigs();
      const { safeEmbedSetting } = await import('@/lib/embed-ids');
      // Host allow-list (PLAUSIBLE_SCRIPT_HOSTS) is runtime server env. A
      // configured src that fails it turns Plausible off rather than falling
      // back to the plausible.io script.
      const rawPlausibleSrc = configs.plausible_src?.trim() || '';
      const plausibleSrc = safeEmbedSetting('plausible_src', rawPlausibleSrc);
      const plausibleOff = !!rawPlausibleSrc && !plausibleSrc;
      const cookieConsentEnabled = configs.cookie_consent_enabled === 'true';
      // Appearance: off by default, and then the code's own styles apply
      // untouched. On: the admin's site settings; users may override only the
      // theme color (cookie) when allowed. Everything goes through the allow-list.
      const appearanceEnabled = configs[APPEARANCE_ENABLED_KEY] === 'true';
      const userThemeEnabled =
        appearanceEnabled && configs.user_theme_enabled === 'true';
      const site = pickAppearance(
        appearanceEnabled
          ? Object.fromEntries(
              APPEARANCE_KEYS.map((k) => [
                k,
                configs[APPEARANCE_CONFIG_KEYS[k]],
              ])
            )
          : {}
      );
      const user = pickAppearance({
        theme: userThemeEnabled ? getCookie(THEME_COOKIE) : undefined,
      });
      const siteAppearance = mergeAppearance(site, DEFAULT_APPEARANCE);
      const rawColorMode = configs[COLOR_MODE_CONFIG_KEY];
      const colorMode =
        appearanceEnabled && isColorMode(rawColorMode)
          ? rawColorMode
          : DEFAULT_COLOR_MODE;
      return {
        session,
        appearanceEnabled,
        colorMode,
        colorModeForced:
          appearanceEnabled && !userThemeEnabled && colorMode !== 'system',
        appearance: mergeAppearance(user, siteAppearance),
        siteAppearance,
        userTheme: user.theme,
        userThemeEnabled,
        cookieConsentEnabled,
        // The visitor's saved choice, so SSR can render consented scripts.
        cookieConsent: cookieConsentEnabled
          ? parseCookieConsent(getCookie('cookie_consent'))
          : null,
        appName: configs.app_name?.trim() || envConfigs.app_name,
        appDescription:
          configs.app_description?.trim() ||
          envConfigs.app_description ||
          'AI Video Generation Studio',
        gaId: configs.google_analytics_id?.trim() || '',
        plausibleDomain: plausibleOff
          ? ''
          : configs.plausible_domain?.trim() || '',
        plausibleSrc,
        adsenseCode: configs.adsense_code?.trim() || '',
        crispWebsiteId:
          configs.crisp_enabled === 'true'
            ? configs.crisp_website_id?.trim() || ''
            : '',
        tawkPropertyId:
          configs.tawk_enabled === 'true'
            ? configs.tawk_property_id?.trim() || ''
            : '',
        tawkWidgetId:
          configs.tawk_enabled === 'true'
            ? configs.tawk_widget_id?.trim() || ''
            : '',
      };
    } catch (error) {
      console.error('Failed to get analytics configs:', error);
      return {
        session,
        appearanceEnabled: false,
        colorMode: DEFAULT_COLOR_MODE,
        colorModeForced: false,
        cookieConsentEnabled: false,
        cookieConsent: null,
        appName: envConfigs.app_name,
        appDescription:
          envConfigs.app_description ||
          'AI Video, Image & Music Generation Studio',
        gaId: '',
        plausibleDomain: '',
        plausibleSrc: '',
        adsenseCode: '',
        crispWebsiteId: '',
        tawkPropertyId: '',
        tawkWidgetId: '',
      };
    }
  });

export const Route = createRootRoute({
  loader: () => getAnalyticsConfigs(),
  head: ({ loaderData }) => {
    // head() runs on the SSR server AND again on the client during hydration.
    // On the client, app_url falls back to the localhost dev default when
    // VITE_APP_URL wasn't inlined into the client bundle at build — which would
    // emit a second, localhost set of hreflang links. Prefer the live origin
    // on the client so it always matches; the server uses the configured URL.
    const appUrl =
      (typeof window !== 'undefined' && window.location?.origin) ||
      envConfigs.app_url ||
      '';
    const appName = loaderData?.appName || envConfigs.app_name || 'App';
    const appDescription =
      loaderData?.appDescription ||
      envConfigs.app_description ||
      'AI Video, Image & Music Generation Studio';

    const canonicalUrl = `${appUrl}/`;
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${appUrl}/#website`,
          url: appUrl,
          name: appName,
          description: appDescription,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${appUrl}/workspace?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'Organization',
          '@id': `${appUrl}/#organization`,
          name: appName,
          url: appUrl,
          logo: `${appUrl}/logo.png`,
          sameAs: [],
        },
        {
          '@type': 'SoftwareApplication',
          name: appName,
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'All',
          description: appDescription,
          url: `${appUrl}/workspace`,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
        },
      ],
    };

    return {
      meta: [
        { charSet: 'utf-8' },
        {
          name: 'viewport',
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
        },
        { title: appName },
        { name: 'description', content: appDescription },
        {
          name: 'keywords',
          content: `AI video generator, text to video, image to video, AI studio, ${appName}`,
        },
        {
          name: 'robots',
          content:
            'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
        },
        {
          name: 'googlebot',
          content:
            'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
        },
        {
          name: 'bingbot',
          content:
            'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
        },
        { property: 'og:site_name', content: appName },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: appName },
        { property: 'og:description', content: appDescription },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:image', content: `${appUrl}/logo.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@joyflix_ai' },
        { name: 'twitter:title', content: appName },
        { name: 'twitter:description', content: appDescription },
        { name: 'twitter:image', content: `${appUrl}/logo.png` },
        { name: 'generator', content: 'ShipAny' },
      ],
      links: [
        { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
        { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' },
        { rel: 'apple-touch-icon', href: '/logo.png' },
        { rel: 'canonical', href: canonicalUrl },
        { rel: 'alternate', hrefLang: 'x-default', href: canonicalUrl },
        ...locales.map((loc) => ({
          rel: 'alternate',
          hrefLang: loc,
          href: localizeUrl(`${appUrl}/`, { locale: loc }).href,
        })),
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(structuredData),
        },
      ],
    };
  },
  component: RootComponent,
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
  errorComponent: RootError,
});

function RootComponent() {
  const analytics = Route.useLoaderData();
  const consentEnabled = !!analytics?.cookieConsentEnabled;
  const consent = useCookieConsent(analytics?.cookieConsent ?? null);
  // With the banner on, ad scripts wait for an explicit "accept".
  const adsAllowed = !consentEnabled || consent === 'accepted';

  return (
    <QueryClientProvider client={getQueryClient()}>
      <SessionProvider initialSession={analytics?.session || null}>
        <ThemeProvider
          attribute="class"
          defaultTheme={analytics?.colorMode ?? DEFAULT_COLOR_MODE}
          forcedTheme={
            analytics?.colorModeForced ? analytics.colorMode : undefined
          }
          enableSystem
          disableTransitionOnChange
        >
          <ScrollRestoration />
          <TopBanner />
          <Outlet />
          <SandboxPreviewBridge />
          {/* Appearance on: toasts follow the theme (globals.css). */}
          <Toaster
            position="top-center"
            richColors={!analytics?.appearanceEnabled}
          />
          <GoogleOneTap />
          {analytics?.gaId ? (
            <GoogleAnalytics
              measurementId={analytics.gaId}
              consentMode={consentEnabled}
            />
          ) : null}
          {analytics?.plausibleDomain || analytics?.plausibleSrc ? (
            <Plausible
              domain={analytics.plausibleDomain}
              src={analytics.plausibleSrc || undefined}
            />
          ) : null}
          {analytics?.adsenseCode ? (
            <Ads code={analytics.adsenseCode} loadScript={adsAllowed} />
          ) : null}
          <CustomerService
            crispWebsiteId={analytics?.crispWebsiteId || undefined}
            tawkPropertyId={analytics?.tawkPropertyId || undefined}
            tawkWidgetId={analytics?.tawkWidgetId || undefined}
          />
          {consentEnabled ? (
            <CookieConsent initial={analytics?.cookieConsent ?? null} />
          ) : null}
        </ThemeProvider>
      </SessionProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  const { appearance, appearanceEnabled } = useAppearance();
  return (
    <html
      lang={getLocale()}
      data-theme={appearanceEnabled ? appearance.theme : undefined}
      style={appearanceEnabled ? appearanceStyle(appearance) : undefined}
      suppressHydrationWarning
    >
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground">{m['common.not_found.message']()}</p>
      <Link href="/" className="text-sm underline underline-offset-4">
        {m['common.not_found.back_home']()}
      </Link>
    </div>
  );
}

function RootError({ error, reset }: ErrorComponentProps) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">{m['common.error.title']()}</h1>
      <p className="text-muted-foreground">{m['common.error.message']()}</p>
      {import.meta.env.DEV && error instanceof Error && (
        <pre className="bg-muted mt-2 max-w-lg overflow-auto rounded p-4 text-xs">
          {error.message}
        </pre>
      )}
      <button
        type="button"
        onClick={reset}
        className="cursor-pointer text-sm underline underline-offset-4"
      >
        {m['common.error.retry']()}
      </button>
    </div>
  );
}
