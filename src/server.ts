import handler from '@tanstack/react-start/server-entry';

import { envConfigs } from './config';
import {
  SEO_PATH_REDIRECT_STATUS,
  seoPathRedirect,
} from './config/seo-landings';
import { PRODUCT_NAME, requestApexRedirect } from './config/seo-site';
import { runWithDbScope } from './core/db/request-scope';
import {
  getCookieFromHeader,
  REFERRER_COOKIE,
  sanitizeReferrer,
  sanitizeUtm,
} from './lib/cookie';
import {
  applySecurityHeaders,
  getProbeBlockResponse,
} from './lib/scanner-probe';
import { paraglideMiddleware } from './paraglide/server.js';

// On Cloudflare Workers, stash the binding env (D1, ASSETS, …) on globalThis
// so synchronous code paths (e.g. the db() singleton with DATABASE_PROVIDER=d1)
// can reach bindings without threading the request context through every call.
// The specifier is kept non-literal so bundlers leave the import to runtime;
// outside workerd the import rejects and we just move on.
const CF_WORKERS_MODULE = 'cloudflare:workers';
let cfEnvPromise: Promise<void> | null = null;

function ensureCloudflareEnv(): Promise<void> {
  if (!cfEnvPromise) {
    cfEnvPromise = import(/* @vite-ignore */ CF_WORKERS_MODULE)
      .then((mod) => {
        (globalThis as any).__CF_ENV__ = mod.env;
        ensureDefaultUserAgent();
      })
      .catch(() => {
        // Not running on Cloudflare Workers — nothing to stash.
      });
  }
  return cfEnvPromise;
}

// Cloudflare Workers' fetch sends no User-Agent, while Node's adds one. Some
// APIs reject UA-less requests (GitHub → 403, WeChat Pay v3 → 400), so on
// Workers give every outbound request a default UA unless it sets its own.
let fetchPatched = false;

function ensureDefaultUserAgent() {
  if (fetchPatched) return;
  fetchPatched = true;
  const nativeFetch = globalThis.fetch;
  const userAgent = `${envConfigs.app_name || PRODUCT_NAME} (+${envConfigs.app_url})`;
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(
      init?.headers ?? (input instanceof Request ? input.headers : undefined)
    );
    if (headers.has('user-agent')) return nativeFetch(input, init);
    headers.set('user-agent', userAgent);
    return nativeFetch(input, { ...init, headers });
  }) as typeof fetch;
}

const UTM_COOKIE_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];
const ATTRIBUTION_COOKIE_ATTRS = 'Max-Age=2592000; Path=/; SameSite=Lax';

// Behind a proxy req.url can carry an internal host, so also treat the public
// app URL as "self" when filtering referrers.
function appHost(): string {
  try {
    return new URL(envConfigs.app_url).host;
  } catch {
    return '';
  }
}

// Missing routes must not be index, follow. The HTML robots meta is set in
// the root head; this header covers the same responses if the document meta
// is skipped. Immutable redirect responses are copied before the write.
function withNotFoundRobots(response: Response): Response {
  if (response.status !== 404) return response;
  const apply = (target: Response) => {
    if (!target.headers.has('X-Robots-Tag')) {
      target.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }
    return target;
  };
  try {
    return apply(response);
  } catch {
    return apply(new Response(response.body, response));
  }
}

// Custom server entry — wraps every request in a db scope (one db client per
// request on Workers, see core/db/request-scope.ts) and Paraglide's middleware
// so getLocale() resolves per-request (AsyncLocalStorage) during SSR.
export default {
  async fetch(req: Request): Promise<Response> {
    const blocked = getProbeBlockResponse(req);
    if (blocked) return blocked;
    await ensureCloudflareEnv();
    // Wrap the whole request so anything before/after the handler shares
    // the same db client too.
    return runWithDbScope(() => handleRequest(req));
  },
};

/**
 * www.aniform.online → https://aniform.online, same path and query.
 *
 * Both hostnames are custom domains on this Worker. The redirect runs in the
 * Worker before routing,
 * so it does not depend on a Cloudflare dashboard Redirect Rule. GET and HEAD
 * use 301. Other methods use 308 so the method and body are kept.
 *
 * Keep www attached to this Worker. If that hostname is removed, Cloudflare
 * never invokes this handler and the redirect stops.
 * Retired aniform.ai hosts are included: they 1016 today because DNS does not
 * reach this Worker; if a request does arrive, it is sent to the apex too.
 */
function apexHostRedirect(req: Request): Response | null {
  const location = requestApexRedirect(req);
  if (!location) return null;
  const status = req.method === 'GET' || req.method === 'HEAD' ? 301 : 308;
  return new Response(null, {
    status,
    headers: { Location: location },
  });
}

/**
 * 301 trailing slashes, queries, /zh copies, and retired landings onto the
 * canonical path. `/free-motion-graphics-generator` goes to `/`.
 * Host redirects run first, so www has already been sent to the apex with
 * the same path. Same 301 shape as `apexHostRedirect`.
 */
function seoCanonicalRedirect(req: Request): Response | null {
  if (req.method !== 'GET' && req.method !== 'HEAD') return null;
  const url = new URL(req.url);
  const path = seoPathRedirect(url);
  if (!path) return null;
  const destination = new URL(path, url.origin);
  return new Response(null, {
    status: SEO_PATH_REDIRECT_STATUS,
    headers: { Location: destination.toString() },
  });
}

async function handleRequest(req: Request): Promise<Response> {
  const apex = apexHostRedirect(req);
  if (apex) {
    const response = withNotFoundRobots(apex);
    applySecurityHeaders(response);
    return response;
  }
  const canonical = seoCanonicalRedirect(req);
  if (canonical) {
    const response = withNotFoundRobots(canonical);
    applySecurityHeaders(response);
    return response;
  }
  const response = withNotFoundRobots(
    await paraglideMiddleware(req, () => handler.fetch(req))
  );
  // First-touch attribution: remember UTM params for 30 days so sign-up can
  // stamp them onto the user row. Never overwrite an existing cookie.
  const params = new URL(req.url).searchParams;
  const cookieHeader = req.headers.get('cookie');
  for (const key of UTM_COOKIE_KEYS) {
    const value = params.get(key);
    if (!value || getCookieFromHeader(cookieHeader, key)) continue;
    const sanitized = sanitizeUtm(value);
    if (sanitized) {
      response.headers.append(
        'Set-Cookie',
        `${key}=${encodeURIComponent(sanitized)}; ${ATTRIBUTION_COOKIE_ATTRS}`
      );
    }
  }
  // First-touch referrer: only page navigations arriving from another site.
  // Browsers usually trim cross-site referrers to the origin, which is fine.
  const referer = req.headers.get('referer');
  if (
    referer &&
    req.method === 'GET' &&
    (req.headers.get('accept') || '').includes('text/html') &&
    !getCookieFromHeader(cookieHeader, REFERRER_COOKIE)
  ) {
    const sanitized = sanitizeReferrer(referer, [
      new URL(req.url).host,
      appHost(),
    ]);
    if (sanitized) {
      response.headers.append(
        'Set-Cookie',
        `${REFERRER_COOKIE}=${encodeURIComponent(sanitized)}; ${ATTRIBUTION_COOKIE_ATTRS}`
      );
    }
  }
  applySecurityHeaders(response);
  return response;
}
