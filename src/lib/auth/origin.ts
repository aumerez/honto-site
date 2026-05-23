/**
 * Origin / Referer CSRF guard for the download endpoint.
 *
 * Spec §4.4: the download endpoint must reject any request whose Origin (or
 * Referer fallback) does not match SITE_ORIGIN. The check is an exact-origin
 * match — no substring tricks like `https://honto.ai.evil.com`.
 */

function expectedOrigin(): string {
  const raw = process.env.SITE_ORIGIN;
  if (!raw) return "https://honto.ai";
  // Strip trailing slash; we compare origins, not URLs.
  return raw.replace(/\/+$/, "");
}

function originOf(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(request: Request): boolean {
  const expected = expectedOrigin();
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    return originOf(originHeader) === expected;
  }
  const referer = request.headers.get("referer");
  if (referer) {
    return originOf(referer) === expected;
  }
  return false;
}
