/**
 * In-memory sliding-window rate limiter.
 *
 * Lifted from the per-route pattern in src/app/api/onboarding/route.ts and
 * generalized so multiple endpoints can share the same shape. State lives in
 * process memory: on Vercel serverless each lambda instance has its own
 * bucket, so the limit is approximate under concurrent invocations. The spec
 * (§4.5) calls out @upstash/ratelimit as the production-grade option; that's
 * tracked as a follow-up in docs/decisions/auth-downloads.md.
 */

type LimitResult = { ok: true } | { ok: false; retryAfterSec: number };

interface RateLimiter {
  check(key: string, now?: number): LimitResult;
  reset(): void;
}

interface RateLimiterConfig {
  windowMs: number;
  max: number;
}

export function makeRateLimiter(config: RateLimiterConfig): RateLimiter {
  const { windowMs, max } = config;
  const buckets = new Map<string, number[]>();

  return {
    check(key: string, now: number = Date.now()): LimitResult {
      const windowStart = now - windowMs;
      const prior = buckets.get(key) ?? [];
      const recent = prior.filter((t) => t > windowStart);
      if (recent.length >= max) {
        buckets.set(key, recent);
        const retryAfterMs = recent[0]! + windowMs - now;
        return {
          ok: false,
          retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)),
        };
      }
      recent.push(now);
      buckets.set(key, recent);
      return { ok: true };
    },
    reset() {
      buckets.clear();
    },
  };
}

export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}
