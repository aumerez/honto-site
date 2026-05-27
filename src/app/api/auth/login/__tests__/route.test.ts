import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { POST, __resetLoginRateLimitForTest } from "../route";

function makeRequest(body: unknown, ip = "203.0.113.10") {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("/api/auth/login POST", () => {
  beforeEach(() => {
    vi.stubEnv("BACKEND_URL", "https://ops.test");
    vi.stubEnv("NODE_ENV", "production");
    __resetLoginRateLimitForTest();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 500 when BACKEND_URL is missing", async () => {
    vi.stubEnv("BACKEND_URL", "");
    const res = await POST(makeRequest({ email: "a@b.co", password: "pw" }));
    expect(res.status).toBe(500);
  });

  it("returns 400 on malformed body", async () => {
    const res = await POST(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "203.0.113.11",
        },
        body: "not-json",
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when fields are missing", async () => {
    const res = await POST(makeRequest({ email: "a@b.co" }));
    expect(res.status).toBe(400);
  });

  it("sets two HttpOnly cookies on success and does not leak tokens in body", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: "access-1",
          refreshToken: "refresh-1",
          user: { id: 42, email: "demo@example.com" },
        }),
        { status: 200 }
      )
    );

    const res = await POST(
      makeRequest({ email: "demo@example.com", password: "pw" })
    );
    expect(res.status).toBe(200);
    const cookies = res.headers.getSetCookie?.() ?? [];
    expect(cookies.length).toBe(2);
    for (const c of cookies) {
      expect(c).toContain("HttpOnly");
      expect(c).toContain("Secure");
      expect(c).toContain("SameSite=Lax");
    }
    expect(cookies.some((c) => c.includes("honto_access_token=access-1"))).toBe(
      true
    );
    expect(
      cookies.some((c) => c.includes("honto_refresh_token=refresh-1"))
    ).toBe(true);

    const body = (await res.json()) as Record<string, unknown>;
    expect(JSON.stringify(body)).not.toContain("access-1");
    expect(JSON.stringify(body)).not.toContain("refresh-1");
    expect(body).toEqual({
      ok: true,
      user: { id: "42", email: "demo@example.com" },
    });
  });

  it("maps backend 401 to 401 without leaking error detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ detail: "bad password leaks" }), {
        status: 401,
      })
    );
    const res = await POST(makeRequest({ email: "a@b.co", password: "pw" }));
    expect(res.status).toBe(401);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("Invalid email or password.");
    expect(JSON.stringify(body)).not.toContain("bad password leaks");
  });

  it("maps backend 429 to 429 with Retry-After", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, {
        status: 429,
        headers: { "Retry-After": "30" },
      })
    );
    const res = await POST(makeRequest({ email: "a@b.co", password: "pw" }));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("30");
  });

  it("returns 502 when fetch throws", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));
    const res = await POST(makeRequest({ email: "a@b.co", password: "pw" }));
    expect(res.status).toBe(502);
  });

  it("returns 502 when backend body is missing tokens", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ user: { id: 1, email: "x" } }), {
        status: 200,
      })
    );
    const res = await POST(makeRequest({ email: "a@b.co", password: "pw" }));
    expect(res.status).toBe(502);
  });

  it("rate-limits after 10 attempts per IP", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ detail: "no" }), { status: 401 })
    );
    for (let i = 0; i < 10; i += 1) {
      const r = await POST(
        makeRequest({ email: "a@b.co", password: "pw" }, "1.1.1.1")
      );
      expect(r.status).toBe(401);
    }
    const eleventh = await POST(
      makeRequest({ email: "a@b.co", password: "pw" }, "1.1.1.1")
    );
    expect(eleventh.status).toBe(429);
    expect(eleventh.headers.get("Retry-After")).toMatch(/^\d+$/);
  });
});
