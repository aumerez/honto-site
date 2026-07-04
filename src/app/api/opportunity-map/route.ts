import { NextResponse } from "next/server";
import { normalizeSubmission } from "@/app/components/OpportunityMap/api-schema";
import { generateReport } from "@/app/components/OpportunityMap/report";
import { buildLeadEmail } from "@/app/components/OpportunityMap/lead-email";
import {
  deliverLead,
  isLeadEmailConfigured,
  logStubbedLead,
} from "@/app/components/OpportunityMap/lead-adapter";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateLimitBuckets = new Map<string, number[]>();

export function __resetRateLimitForTest() {
  rateLimitBuckets.clear();
}

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

function checkRateLimit(
  ip: string,
  now: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (rateLimitBuckets.get(ip) ?? []).filter(
    (t) => t > windowStart
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(ip, recent);
    const retryAfterMs = recent[0]! + RATE_LIMIT_WINDOW_MS - now;
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }
  recent.push(now);
  rateLimitBuckets.set(ip, recent);
  return { ok: true };
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = checkRateLimit(ip, Date.now());
  if (!limit.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many requests from this network. Please try again later.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const wrapped = (body as { submission?: unknown }) ?? {};
  const result = normalizeSubmission(wrapped.submission ?? body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Invalid submission", issues: result.issues },
      { status: 400 }
    );
  }

  const { submission } = result;
  // The report is always derived server-side so score-critical fields cannot be
  // manipulated by the client.
  const report = generateReport(submission);
  const email = buildLeadEmail(submission, report);

  if (!isLeadEmailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      // Fail closed in production so leads are never silently dropped.
      return NextResponse.json(
        { ok: false, error: "Submission could not be processed." },
        { status: 500 }
      );
    }
    // Local/dev: preserve the contract without requiring credentials.
    logStubbedLead(submission.company.companyName, report.signal.score);
    return NextResponse.json({ ok: true, delivery: "stub" });
  }

  // Delivery is best-effort: the diagnostic value is already shown to the user,
  // so a delivery failure does not break their flow. Details are never exposed.
  const delivery = await deliverLead(email);
  return NextResponse.json({ ok: true, delivery });
}
