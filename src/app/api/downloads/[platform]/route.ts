/**
 * GET /api/downloads/[platform] — gated installer download.
 *
 * Flow (spec §3.1):
 *   1. Origin / Referer check        → 403 on mismatch (CSRF guard, §4.4).
 *   2. Per-user + per-IP rate limit  → 429 (§4.5).
 *   3. Session validation (Mode A)   → 302 to /app-download if anonymous.
 *   4. Platform allow-list           → 400 on unknown (§4.8).
 *   5. R2 env presence check         → 503 if not configured.
 *   6. Presigned URL                 → 302 with 5-min TTL (§4.6).
 *   7. Audit log (fire-and-forget)   → outcome recorded.
 *
 * The 302 carries Referrer-Policy: strict-origin-when-cross-origin (§4.10)
 * to prevent the presigned URL from leaking into Referer.
 */

import { NextResponse } from "next/server";
import { accessTokenCookie, refreshTokenCookie } from "@/lib/auth/cookies";
import { isAllowedOrigin } from "@/lib/auth/origin";
import { validateSessionAgainstBackend } from "@/lib/auth/session";
import { logDownload, type Outcome } from "@/lib/audit/log";
import { isPlatform, LATEST_VERSION } from "@/lib/downloads/platforms";
import { presignDownloadUrl } from "@/lib/downloads/r2";
import { clientIp, makeRateLimiter } from "@/lib/ratelimit";

export const runtime = "nodejs";

const HOUR = 60 * 60 * 1000;
const userLimiter = makeRateLimiter({ windowMs: HOUR, max: 20 });
const ipLimiter = makeRateLimiter({ windowMs: HOUR, max: 60 });

export function __resetDownloadRateLimitForTest(): void {
  userLimiter.reset();
  ipLimiter.reset();
}

interface RouteParams {
  params: Promise<{ platform: string }>;
}

function appDownloadUrl(request: Request): string {
  const expected = process.env.SITE_ORIGIN?.replace(/\/+$/, "") ?? "";
  if (expected) return `${expected}/app-download`;
  const url = new URL(request.url);
  return `${url.origin}/app-download`;
}

function emitAudit(
  request: Request,
  user: string,
  platform: string,
  version: string,
  outcome: Outcome
): void {
  logDownload({
    user,
    platform,
    version,
    ip: clientIp(request),
    ua: request.headers.get("user-agent") ?? "",
    outcome,
  });
}

export async function GET(request: Request, { params }: RouteParams) {
  const { platform } = await params;
  const version = LATEST_VERSION;

  if (!isAllowedOrigin(request)) {
    emitAudit(request, "anon", platform, version, "rejected:forbidden_origin");
    return new NextResponse("Forbidden", { status: 403 });
  }

  const ipLimit = ipLimiter.check(clientIp(request));
  if (!ipLimit.ok) {
    emitAudit(request, "anon", platform, version, "rejected:rate_limited");
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": String(ipLimit.retryAfterSec) },
    });
  }

  const session = await validateSessionAgainstBackend(request);
  if (!session) {
    emitAudit(request, "anon", platform, version, "rejected:unauthenticated");
    return NextResponse.redirect(appDownloadUrl(request), 302);
  }

  const userLimit = userLimiter.check(session.user.id);
  if (!userLimit.ok) {
    emitAudit(
      request,
      session.user.id,
      platform,
      version,
      "rejected:rate_limited"
    );
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": String(userLimit.retryAfterSec) },
    });
  }

  if (!isPlatform(platform)) {
    emitAudit(
      request,
      session.user.id,
      platform,
      version,
      "rejected:invalid_platform"
    );
    return new NextResponse("Bad platform", { status: 400 });
  }

  let presigned;
  try {
    presigned = await presignDownloadUrl(platform, version);
  } catch {
    presigned = null;
  }

  if (!presigned) {
    // Distinguish "no config at all" from "presign threw" only at the audit
    // layer; both yield the same opaque 503 publicly to avoid leaking
    // which env var was missing.
    const configured =
      !!process.env.R2_PUBLIC_BASE_URL || !!process.env.R2_ACCESS_KEY_ID;
    emitAudit(
      request,
      session.user.id,
      platform,
      version,
      configured
        ? "rejected:presign_failed"
        : "rejected:downloads_not_configured"
    );
    return new NextResponse("Downloads are not available right now.", {
      status: 503,
    });
  }

  emitAudit(request, session.user.id, platform, version, "granted");

  const response = new NextResponse(null, {
    status: 302,
    headers: {
      Location: presigned.url,
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Cache-Control": "no-store",
    },
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
