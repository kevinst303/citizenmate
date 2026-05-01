import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from '@/i18n/config';
import { createServerClient } from '@supabase/ssr';

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/practice", "/study", "/admin"];
const PROTECTED_API_ROUTES = ["/api/checkout", "/api/chat"];

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
  } catch (e) {
    return defaultLocale;
  }
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user = null;

  // Supabase Auth Session Refreshing
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request: { headers: request.headers },
          });
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

  // Paths to exclude from i18n entirely
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // Exclude files like favicon.ico
  ) {
    // Return 401 for unauthenticated API requests
    const isProtectedAPI = PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route));
    if (isProtectedAPI && !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return response;
  }

  // --- I18n Routing ---
  
  // Check if pathname has a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  let localePathname = pathname;

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // Create new URL with locale
    const newUrl = new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${request.nextUrl.search}`, request.url);
    
    // Return a redirect response
    response = NextResponse.redirect(newUrl);
    localePathname = `/${locale}${pathname}`;
  }

  // --- Auth Protection Check ---
  
  // We need to strip the locale to check against PROTECTED_ROUTES
  // e.g. /en/dashboard -> /dashboard
  let pathWithoutLocale = localePathname;
  for (const locale of locales) {
    if (localePathname.startsWith(`/${locale}/`) || localePathname === `/${locale}`) {
      pathWithoutLocale = localePathname.replace(`/${locale}`, '');
      if (pathWithoutLocale === '') pathWithoutLocale = '/';
      break;
    }
  }

  const isProtectedPage = PROTECTED_ROUTES.some((route) => pathWithoutLocale.startsWith(route));

  // Redirect unauthenticated users from protected pages to home
  if (isProtectedPage && !user) {
    const redirectUrl = new URL("/", request.url);
    redirectUrl.searchParams.set("auth", "required");
    redirectUrl.searchParams.set("redirect", pathWithoutLocale);
    
    // Maintain locale in redirect if one was present or determined
    const localeToUse = pathnameIsMissingLocale ? getLocale(request) : localePathname.split('/')[1];
    redirectUrl.pathname = `/${localeToUse}`;
    
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw\\.js|manifest\\.json|icons/|api/webhooks).*)'],
};
