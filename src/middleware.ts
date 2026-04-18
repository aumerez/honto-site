import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, spanishCountries } from "@/lib/locales";

const PUBLIC_FILE = /\.(.*)$/;

function getLocaleFromRequest(request: NextRequest): string {
  // 1. Explicit user choice via cookie trumps everything else
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (
    cookieLocale &&
    locales.includes(cookieLocale as (typeof locales)[number])
  ) {
    return cookieLocale;
  }

  // 2. Check geo country (works on Vercel; falls through elsewhere)
  const geo = (request as NextRequest & { geo?: { country?: string } }).geo;
  const country = geo?.country;
  if (country && spanishCountries.has(country)) {
    return "es";
  }

  // 3. Check Accept-Language header
  const acceptLang = request.headers.get("accept-language") ?? "";
  if (acceptLang) {
    const preferred = acceptLang
      .split(",")
      .map((part) => {
        const [lang, q] = part.trim().split(";q=");
        return { lang: lang.trim().toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { lang } of preferred) {
      if (lang.startsWith("es")) return "es";
      if (lang.startsWith("en")) return "en";
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public files, _next, api routes, and standalone pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/demo") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if the URL already has a valid locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Detect locale and redirect
  const locale = getLocaleFromRequest(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)"],
};
