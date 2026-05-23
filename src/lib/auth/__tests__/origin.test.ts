import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { isAllowedOrigin } from "@/lib/auth/origin";

describe("isAllowedOrigin", () => {
  beforeEach(() => {
    vi.stubEnv("SITE_ORIGIN", "https://honto.ai");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function req(headers: Record<string, string>) {
    return new Request("http://localhost/", { headers });
  }

  it("accepts exact-match Origin", () => {
    expect(isAllowedOrigin(req({ origin: "https://honto.ai" }))).toBe(true);
  });

  it("accepts exact-match Origin with trailing slash on SITE_ORIGIN", () => {
    vi.stubEnv("SITE_ORIGIN", "https://honto.ai/");
    expect(isAllowedOrigin(req({ origin: "https://honto.ai" }))).toBe(true);
  });

  it("rejects subdomain-spoofed Origin", () => {
    expect(isAllowedOrigin(req({ origin: "https://honto.ai.evil.com" }))).toBe(
      false
    );
  });

  it("rejects http Origin (no TLS)", () => {
    expect(isAllowedOrigin(req({ origin: "http://honto.ai" }))).toBe(false);
  });

  it("rejects path-only matches", () => {
    expect(isAllowedOrigin(req({ origin: "https://evil.com/honto.ai" }))).toBe(
      false
    );
  });

  it("falls through to Referer when Origin is absent", () => {
    expect(
      isAllowedOrigin(req({ referer: "https://honto.ai/app-download" }))
    ).toBe(true);
  });

  it("Referer with foreign origin is rejected", () => {
    expect(isAllowedOrigin(req({ referer: "https://evil.com/page" }))).toBe(
      false
    );
  });

  it("rejects when both Origin and Referer are missing", () => {
    expect(isAllowedOrigin(req({}))).toBe(false);
  });

  it("rejects malformed Origin", () => {
    expect(isAllowedOrigin(req({ origin: "not a url" }))).toBe(false);
  });
});
