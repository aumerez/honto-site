/**
 * POST /api/auth/login — credential exchange against honto.ops.
 *
 * Spec §3.1 step 4 + §6.3: forwards { email, password } to the existing
 * honto.ops POST /auth/login (rate-limited 10/min/IP server-side per §4.5,
 * which we surface to the user verbatim). On success we mint two cookies
 * (HttpOnly, Secure, SameSite=Lax) and return ONLY non-sensitive user
 * fields in the body — no access/refresh tokens.
 *
 * The Wholograph SSO migration will replace this file (and only this file
 * plus LoginPanel.tsx — see docs/decisions/auth-downloads.md).
 */

import { NextResponse } from "next/server";
import { accessTokenCookie, refreshTokenCookie } from "@/lib/auth/cookies";
import { clientIp, makeRateLimiter } from "@/lib/ratelimit";

export const runtime = "nodejs";

const loginLimiter = makeRateLimiter({ windowMs: 60_000, max: 10 });

export function __resetLoginRateLimitForTest(): void {
  loginLimiter.reset();
}

type LoginBody = { email?: unknown; password?: unknown };

function sanitizeCredentials(
  raw: unknown
): { email: string; password: string } | null {
  if (!raw || typeof raw !== "object") return null;
  const { email, password } = raw as LoginBody;
  if (typeof email !== "string" || typeof password !== "string") return null;
  const trimmed = email.trim();
  if (!trimmed || !password) return null;
  if (trimmed.length > 320 || password.length > 1024) return null;
  return { email: trimmed, password };
}

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return NextResponse.json(
      { error: "Auth service is not configured." },
      { status: 500 }
    );
  }

  const limit = loginLimiter.check(clientIp(request));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const creds = sanitizeCredentials(body);
  if (!creds) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the auth service. Please try again." },
      { status: 502 }
    );
  }

  if (backendRes.status === 429) {
    const retryAfter = backendRes.headers.get("Retry-After") ?? "60";
    return NextResponse.json(
      { error: "Too many login attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": retryAfter } }
    );
  }

  if (backendRes.status === 401 || backendRes.status === 400) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  if (!backendRes.ok) {
    return NextResponse.json(
      { error: "Could not sign you in. Please try again." },
      { status: 502 }
    );
  }

  const data = (await backendRes.json().catch(() => null)) as {
    accessToken?: unknown;
    refreshToken?: unknown;
    user?: { id?: unknown; email?: unknown } | null;
  } | null;

  if (
    !data ||
    typeof data.accessToken !== "string" ||
    typeof data.refreshToken !== "string"
  ) {
    return NextResponse.json(
      { error: "Auth service returned an unexpected response." },
      { status: 502 }
    );
  }

  const userId =
    data.user && data.user.id != null ? String(data.user.id) : null;
  const userEmail =
    data.user && typeof data.user.email === "string" ? data.user.email : null;

  const response = NextResponse.json({
    ok: true,
    user: userId && userEmail ? { id: userId, email: userEmail } : null,
  });
  response.headers.append("Set-Cookie", accessTokenCookie(data.accessToken));
  response.headers.append("Set-Cookie", refreshTokenCookie(data.refreshToken));
  return response;
}
