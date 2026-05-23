/**
 * Auth cookie helpers.
 *
 * Tokens live in HttpOnly + Secure + SameSite=Lax cookies per spec §4.2.
 * They are never read from JS, never logged, and never echoed back in
 * response bodies.
 */

export const ACCESS_TOKEN_COOKIE = "honto_access_token";
export const REFRESH_TOKEN_COOKIE = "honto_refresh_token";

// Conservative TTLs aligned with honto.ops defaults (spec §3.3): 15 min access,
// 7 days refresh. We keep the access cookie at refresh-token lifetime so the
// request handler can opportunistically refresh expired tokens; the access
// token's own `exp` claim is what actually gates validity at the backend.
const ACCESS_MAX_AGE_SEC = 60 * 60 * 24 * 7;
const REFRESH_MAX_AGE_SEC = 60 * 60 * 24 * 7;

interface CookieOptions {
  name: string;
  value: string;
  maxAgeSec: number;
  secure: boolean;
}

function serialize(opts: CookieOptions): string {
  // No `Domain` attribute on purpose: these are host-only cookies scoped to the
  // exact origin that set them. That is stricter than spec §4.2's `Domain=honto.ai`
  // (no subdomain leakage) and lets the same code run in dev (localhost) and prod
  // (honto.ai) without branching. Add `Domain=honto.ai` here only if the session
  // ever needs to be shared across subdomains.
  const parts = [
    `${opts.name}=${encodeURIComponent(opts.value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${opts.maxAgeSec}`,
  ];
  if (opts.secure) parts.push("Secure");
  return parts.join("; ");
}

function isProdLike(): boolean {
  return process.env.NODE_ENV === "production";
}

export function accessTokenCookie(token: string): string {
  return serialize({
    name: ACCESS_TOKEN_COOKIE,
    value: token,
    maxAgeSec: ACCESS_MAX_AGE_SEC,
    secure: isProdLike(),
  });
}

export function refreshTokenCookie(token: string): string {
  return serialize({
    name: REFRESH_TOKEN_COOKIE,
    value: token,
    maxAgeSec: REFRESH_MAX_AGE_SEC,
    secure: isProdLike(),
  });
}

export function clearedCookies(): string[] {
  const cleared = (name: string) =>
    [
      `${name}=`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=0",
      isProdLike() ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ");
  return [cleared(ACCESS_TOKEN_COOKIE), cleared(REFRESH_TOKEN_COOKIE)];
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const key = part.slice(0, idx).trim();
    if (key === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
}
