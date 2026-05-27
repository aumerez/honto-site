/**
 * Single-in-flight refresh dedup.
 *
 * Spec §3.2 + §6.3: honto.ops rotates refresh tokens single-use. If two
 * route handlers fire parallel refreshes for the same user, the second one
 * 401s. Mirror the desktop pattern (desktop/src/main/services/auth-refresh.service.ts)
 * by keying in-flight promises by the refresh token: concurrent callers
 * share one fetch and the same rotated tokens.
 *
 * State is per-process (per lambda instance on Vercel); two distinct
 * instances can still race. That residual race is acceptable: the loser
 * will be told to re-auth, and the user will be redirected to the login
 * panel — no token leak, no security impact.
 */

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

const inFlight = new Map<string, Promise<RefreshResult | null>>();

export function __resetInFlightForTest(): void {
  inFlight.clear();
}

export async function refreshTokens(
  backendUrl: string,
  refreshToken: string
): Promise<RefreshResult | null> {
  const existing = inFlight.get(refreshToken);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const res = await fetch(`${backendUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as {
        accessToken?: unknown;
        refreshToken?: unknown;
      };
      if (
        typeof data.accessToken !== "string" ||
        typeof data.refreshToken !== "string"
      ) {
        return null;
      }
      return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    } catch {
      return null;
    } finally {
      inFlight.delete(refreshToken);
    }
  })();

  inFlight.set(refreshToken, promise);
  return promise;
}
