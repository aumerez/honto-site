import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  accessTokenCookie,
  refreshTokenCookie,
  clearedCookies,
  readCookie,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth/cookies";

describe("auth cookies", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("accessTokenCookie sets HttpOnly, Secure, SameSite=Lax, Path=/", () => {
    const cookie = accessTokenCookie("abc.def.ghi");
    expect(cookie).toContain(`${ACCESS_TOKEN_COOKIE}=abc.def.ghi`);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
    expect(cookie).toMatch(/Max-Age=\d+/);
  });

  it("refreshTokenCookie sets the same flags", () => {
    const cookie = refreshTokenCookie("refresh-token");
    expect(cookie).toContain(`${REFRESH_TOKEN_COOKIE}=refresh-token`);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Lax");
  });

  it("omits Secure flag in non-production", () => {
    vi.stubEnv("NODE_ENV", "development");
    const cookie = accessTokenCookie("abc");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).not.toContain("Secure");
  });

  it("URL-encodes the value", () => {
    const cookie = accessTokenCookie("a/b c");
    expect(cookie).toContain("a%2Fb%20c");
  });

  it("clearedCookies returns Max-Age=0 entries for both cookies", () => {
    const cleared = clearedCookies();
    expect(cleared).toHaveLength(2);
    expect(cleared[0]).toContain(`${ACCESS_TOKEN_COOKIE}=`);
    expect(cleared[0]).toContain("Max-Age=0");
    expect(cleared[1]).toContain(`${REFRESH_TOKEN_COOKIE}=`);
    expect(cleared[1]).toContain("Max-Age=0");
  });
});

describe("readCookie", () => {
  it("returns the requested cookie value", () => {
    const req = new Request("http://localhost/", {
      headers: { cookie: `${ACCESS_TOKEN_COOKIE}=tok; other=value` },
    });
    expect(readCookie(req, ACCESS_TOKEN_COOKIE)).toBe("tok");
  });

  it("decodes URL-encoded values", () => {
    const req = new Request("http://localhost/", {
      headers: { cookie: `${ACCESS_TOKEN_COOKIE}=a%2Fb%20c` },
    });
    expect(readCookie(req, ACCESS_TOKEN_COOKIE)).toBe("a/b c");
  });

  it("returns null when the cookie is absent", () => {
    const req = new Request("http://localhost/", {
      headers: { cookie: "other=value" },
    });
    expect(readCookie(req, ACCESS_TOKEN_COOKIE)).toBeNull();
  });

  it("returns null when no cookie header is set", () => {
    const req = new Request("http://localhost/");
    expect(readCookie(req, ACCESS_TOKEN_COOKIE)).toBeNull();
  });
});
