import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from '@/i18n/config';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_ROUTES = ["/dashboard", "/practice", "/study", "/admin"];
const PROTECTED_API_ROUTES = ["/api/checkout", "/api/chat", "/api/admin"];

let isDev = false;
try { isDev = process.env.NODE_ENV === 'development'; } catch {}

function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

function getScriptSrc(): string {
  return [
    `'self'`,
    `'unsafe-inline'`,
    isDev ? "'unsafe-eval'" : "",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://us.i.posthog.com",
    "https://va.vercel-scripts.com",
  ].filter(Boolean).join(" ");
}

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  try {
    return matchLocale(languages, locales as unknown as string[], defaultLocale);
  } catch {
    return defaultLocale;
  }
}

function getCSP(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src ${getScriptSrc()}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com https://www.google-analytics.com https://*.abs.gov.au https://api.weatherapi.com https://api.stripe.com https://checkout.stripe.com https://*.sentry.io https://*.upstash.io https://us.i.posthog.com https://vitals.vercel-insights.com",
    "frame-src 'self' https://checkout.stripe.com https://js.stripe.com",
    "frame-ancestors 'none'",
  ].join("; ");
}

function setCSP(response: NextResponse, nonce: string): void {
  response.headers.set("Content-Security-Policy", getCSP(nonce));
}

export async function middleware(request: NextRequest) {
  const nonce = generateNonce();
  request.headers.set('x-nonce', nonce);
  request.headers.set('Content-Security-Policy', getCSP(nonce));

  let response = NextResponse.next({
    request: { headers: request.headers },
  });
  setCSP(response, nonce);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user = null;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          setCSP(response, nonce);
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    const pathnameLower = pathname.toLowerCase();
    const isProtectedAPI = PROTECTED_API_ROUTES.some((route) =>
      pathnameLower.startsWith(route)
    );
    if (isProtectedAPI && !user) {
      const res = NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
      setCSP(res, nonce);
      return res;
    }
    return response;
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  let localePathname = pathname;

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const newUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`,
      request.url
    );
    response = NextResponse.redirect(newUrl);
    setCSP(response, nonce);
    localePathname = `/${locale}${pathname}`;
  }

  let pathWithoutLocale = localePathname;
  for (const locale of locales) {
    if (
      localePathname.startsWith(`/${locale}/`) ||
      localePathname === `/${locale}`
    ) {
      pathWithoutLocale = localePathname.replace(`/${locale}`, '');
      if (pathWithoutLocale === '') pathWithoutLocale = '/';
      break;
    }
  }

  let normalizedPath = pathWithoutLocale;
  try {
    normalizedPath = decodeURIComponent(pathWithoutLocale);
    if (normalizedPath.includes('\0') || normalizedPath.includes('\n') || normalizedPath.includes('\r')) {
      const res = NextResponse.redirect(new URL('/', request.url));
      setCSP(res, nonce);
      return res;
    }
  } catch {
    const res = NextResponse.redirect(new URL('/', request.url));
    setCSP(res, nonce);
    return res;
  }
  const pathWithoutLocaleLower = normalizedPath.toLowerCase();
  const isProtectedPage = PROTECTED_ROUTES.some((route) =>
    pathWithoutLocaleLower.startsWith(route)
  );

  if (isProtectedPage && !user) {
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('auth', 'required');
    redirectUrl.searchParams.set('redirect', pathWithoutLocale);

    const localeToUse = pathnameIsMissingLocale
      ? getLocale(request)
      : localePathname.split('/')[1];
    redirectUrl.pathname = `/${localeToUse}`;

    const res = NextResponse.redirect(redirectUrl);
    setCSP(res, nonce);
    return res;
  }

  const ref = request.nextUrl.searchParams.get('ref');
  if (ref) {
    response.cookies.set('citizenmate_ref', ref, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw\\.js|manifest\\.json|icons/|api/webhooks).*)',
  ],
};
