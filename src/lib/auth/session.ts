/**
 * Session validation against honto.ops — Mode A from spec §4.3.
 *
 * Forwards the accessToken cookie as a Bearer token to honto.ops GET /auth/me.
 * On 401, attempts a single refresh via POST /auth/refresh with dedup, retries
 * /auth/me, and returns the rotated tokens to the caller so they can be
 * persisted as new cookies.
 *
 * honto.ai NEVER holds the JWT_SECRET. All token validity decisions are made
 * by the backend (including blacklist / revocation checks), which means a
 * compromised honto.ai instance still can't forge tokens.
 */

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  readCookie,
} from "@/lib/auth/cookies";
import { refreshTokens } from "@/lib/auth/refresh";

interface SessionUser {
  id: string;
  email: string;
  tenantId?: number | null;
}

interface SessionResult {
  user: SessionUser;
  /**
   * Set only when a refresh occurred during validation. Caller must echo
   * these to Set-Cookie headers on the response.
   */
  rotated?: {
    accessToken: string;
    refreshToken: string;
  } | null;
}

async function fetchMe(
  backendUrl: string,
  accessToken: string
): Promise<SessionUser | null> {
  try {
    const res = await fetch(`${backendUrl}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.status !== 200) return null;
    const data = (await res.json()) as Record<string, unknown>;
    const idRaw = data.id ?? data.sub ?? data.user_id;
    const id = idRaw == null ? null : String(idRaw);
    const email = typeof data.email === "string" ? data.email : null;
    if (!id || !email) return null;
    const tenantId =
      typeof data.tenant_id === "number"
        ? data.tenant_id
        : typeof data.tenantId === "number"
          ? data.tenantId
          : null;
    return { id, email, tenantId };
  } catch {
    return null;
  }
}

export async function validateSessionAgainstBackend(
  request: Request
): Promise<SessionResult | null> {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) return null;

  const accessToken = readCookie(request, ACCESS_TOKEN_COOKIE);
  const refreshToken = readCookie(request, REFRESH_TOKEN_COOKIE);

  if (accessToken) {
    const user = await fetchMe(backendUrl, accessToken);
    if (user) return { user, rotated: null };
  }

  if (!refreshToken) return null;

  const rotated = await refreshTokens(backendUrl, refreshToken);
  if (!rotated) return null;

  const user = await fetchMe(backendUrl, rotated.accessToken);
  if (!user) return null;

  return { user, rotated };
}
