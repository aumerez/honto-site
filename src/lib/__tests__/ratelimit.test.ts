import { describe, it, expect } from "vitest";
import { makeRateLimiter, clientIp } from "@/lib/ratelimit";

describe("makeRateLimiter", () => {
  it("allows requests up to max and rejects the next", () => {
    const limiter = makeRateLimiter({ windowMs: 60_000, max: 3 });
    const now = 1_000_000;
    expect(limiter.check("ip-a", now).ok).toBe(true);
    expect(limiter.check("ip-a", now + 1).ok).toBe(true);
    expect(limiter.check("ip-a", now + 2).ok).toBe(true);
    const fourth = limiter.check("ip-a", now + 3);
    expect(fourth.ok).toBe(false);
    if (!fourth.ok) {
      expect(fourth.retryAfterSec).toBeGreaterThan(0);
    }
  });

  it("expires old entries after the window", () => {
    const limiter = makeRateLimiter({ windowMs: 1_000, max: 1 });
    expect(limiter.check("ip-a", 0).ok).toBe(true);
    expect(limiter.check("ip-a", 500).ok).toBe(false);
    expect(limiter.check("ip-a", 1_001).ok).toBe(true);
  });

  it("scopes limits per key", () => {
    const limiter = makeRateLimiter({ windowMs: 60_000, max: 1 });
    expect(limiter.check("ip-a", 0).ok).toBe(true);
    expect(limiter.check("ip-b", 0).ok).toBe(true);
    expect(limiter.check("ip-a", 1).ok).toBe(false);
  });

  it("retryAfterSec is at least 1 even at exact boundary", () => {
    const limiter = makeRateLimiter({ windowMs: 60_000, max: 1 });
    limiter.check("ip-a", 0);
    const denied = limiter.check("ip-a", 0);
    expect(denied.ok).toBe(false);
    if (!denied.ok) expect(denied.retryAfterSec).toBeGreaterThanOrEqual(1);
  });

  it("reset() clears all state", () => {
    const limiter = makeRateLimiter({ windowMs: 60_000, max: 1 });
    limiter.check("ip-a", 0);
    expect(limiter.check("ip-a", 1).ok).toBe(false);
    limiter.reset();
    expect(limiter.check("ip-a", 1).ok).toBe(true);
  });
});

describe("clientIp", () => {
  it("prefers x-forwarded-for first hop", () => {
    const req = new Request("http://localhost/", {
      headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1" },
    });
    expect(clientIp(req)).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip", () => {
    const req = new Request("http://localhost/", {
      headers: { "x-real-ip": "203.0.113.2" },
    });
    expect(clientIp(req)).toBe("203.0.113.2");
  });

  it("returns 'unknown' when neither header is set", () => {
    const req = new Request("http://localhost/");
    expect(clientIp(req)).toBe("unknown");
  });
});
