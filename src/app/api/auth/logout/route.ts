/**
 * POST /api/auth/logout — clears auth cookies; best-effort backend revoke.
 *
 * Spec §3.2: honto.ops POST /auth/logout requires the Bearer access token.
 * We call it best-effort (don't block clearing local cookies on a backend
 * failure) so a user always escapes the authenticated state even if the
 * backend is unreachable.
 */

import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  clearedCookies,
  readCookie,
} from "@/lib/auth/cookies";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;
  const accessToken = readCookie(request, ACCESS_TOKEN_COOKIE);

  if (backendUrl && accessToken) {
    try {
      await fetch(`${backendUrl}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {
      // intentional: we always clear local cookies regardless of backend
    }
  }

  const response = NextResponse.json({ ok: true });
  for (const cookie of clearedCookies()) {
    response.headers.append("Set-Cookie", cookie);
  }
  return response;
}
