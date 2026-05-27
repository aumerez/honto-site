/**
 * GET /api/auth/session — lightweight session probe for the UI.
 *
 * Returns { authenticated: bool, email?: string } without exposing tokens.
 * If validateSessionAgainstBackend rotated tokens during the round-trip, we
 * forward the rotated cookies so the client picks them up.
 */

import { NextResponse } from "next/server";
import { accessTokenCookie, refreshTokenCookie } from "@/lib/auth/cookies";
import { validateSessionAgainstBackend } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await validateSessionAgainstBackend(request);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }
  const response = NextResponse.json({
    authenticated: true,
    email: session.user.email,
  });
  if (session.rotated) {
    response.headers.append(
      "Set-Cookie",
      accessTokenCookie(session.rotated.accessToken)
    );
    response.headers.append(
      "Set-Cookie",
      refreshTokenCookie(session.rotated.refreshToken)
    );
  }
  return response;
}
