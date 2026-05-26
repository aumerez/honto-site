import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const presignMock = vi.hoisted(() => vi.fn());
const resolveReleaseMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/downloads/r2", () => ({
  presignDownloadUrl: presignMock,
}));

vi.mock("@/lib/downloads/manifest", () => ({
  resolveRelease: resolveReleaseMock,
}));

import { GET, __resetDownloadRateLimitForTest } from "../route";
import { __resetInFlightForTest } from "@/lib/auth/refresh";

function makeRequest(
  platform: string,
  {
    cookie,
    origin = "https://honto.ai",
    ip = "203.0.113.50",
  }: { cookie?: string; origin?: string | null; ip?: string } = {}
) {
  const headers: Record<string, string> = {
    "x-forwarded-for": ip,
    "user-agent": "test-agent",
  };
  if (origin !== null) headers.origin = origin;
  if (cookie) headers.cookie = cookie;
  return new Request(`http://localhost/api/downloads/${platform}`, { headers });
}

function params(platform: string) {
  return { params: Promise.resolve({ platform }) };
}

const validUser = { id: "u1", email: "demo@example.com", tenant_id: 1 };

const FILENAME = "honto.ops-0.1.0-beta.1-arm64.dmg";
const PUBLIC_URL = `https://pub-d082782d774141a9a040e770bdba5f2d.r2.dev/desktop/beta/${FILENAME}`;

function mockMeOk(token: string) {
  return new Response(JSON.stringify(validUser), { status: 200 });
}

describe("/api/downloads/[platform] GET", () => {
  beforeEach(() => {
    vi.stubEnv("BACKEND_URL", "https://ops.test");
    vi.stubEnv("SITE_ORIGIN", "https://honto.ai");
    vi.stubEnv("R2_ACCOUNT_ID", "acct");
    vi.stubEnv("R2_ACCESS_KEY_ID", "key");
    vi.stubEnv("R2_SECRET_ACCESS_KEY", "secret");
    vi.stubEnv("R2_BUCKET", "honto-installers");
    vi.stubEnv("R2_PUBLIC_ENDPOINT", "https://downloads.honto.ai");
    vi.stubEnv("AUDIT_LOG_URL", "");
    vi.stubEnv("NODE_ENV", "production");
    __resetDownloadRateLimitForTest();
    __resetInFlightForTest();
    vi.restoreAllMocks();
    presignMock.mockReset();
    // Default: no private bucket configured → fall back to the public URL.
    presignMock.mockResolvedValue(null);
    resolveReleaseMock.mockReset();
    resolveReleaseMock.mockResolvedValue({
      version: "0.1.0-beta.1",
      filename: FILENAME,
      url: PUBLIC_URL,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects requests with no Origin/Referer (403)", async () => {
    const res = await GET(makeRequest("mac", { origin: null }), params("mac"));
    expect(res.status).toBe(403);
  });

  it("rejects foreign Origin (403)", async () => {
    const res = await GET(
      makeRequest("mac", { origin: "https://evil.com" }),
      params("mac")
    );
    expect(res.status).toBe(403);
  });

  it("redirects to /app-download when unauthenticated", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 401 })
    );
    const res = await GET(makeRequest("mac"), params("mac"));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://honto.ai/app-download");
  });

  it("returns 400 on invalid platform when authenticated", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockMeOk("acc"));
    const res = await GET(
      makeRequest("solaris", { cookie: "honto_access_token=acc" }),
      params("solaris")
    );
    expect(res.status).toBe(400);
    expect(presignMock).not.toHaveBeenCalled();
  });

  it("rejects case variants like MAC (400)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockMeOk("acc"));
    const res = await GET(
      makeRequest("MAC", { cookie: "honto_access_token=acc" }),
      params("MAC")
    );
    expect(res.status).toBe(400);
  });

  it("happy path: valid cookie + matching Origin → 302 to public manifest URL", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockMeOk("acc"));
    const res = await GET(
      makeRequest("mac", { cookie: "honto_access_token=acc" }),
      params("mac")
    );
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(PUBLIC_URL);
    expect(res.headers.get("referrer-policy")).toBe(
      "strict-origin-when-cross-origin"
    );
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(presignMock).toHaveBeenCalledWith(FILENAME);
  });

  it("prefers a presigned private-bucket URL when configured", async () => {
    presignMock.mockResolvedValue("https://downloads.honto.ai/signed?x=1");
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockMeOk("acc"));
    const res = await GET(
      makeRequest("mac", { cookie: "honto_access_token=acc" }),
      params("mac")
    );
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(
      "https://downloads.honto.ai/signed?x=1"
    );
  });

  it("refreshes silently on expired access token and rotates cookies", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 401 })) // /auth/me
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            accessToken: "new-access",
            refreshToken: "new-refresh",
          }),
          { status: 200 }
        )
      ) // /auth/refresh
      .mockResolvedValueOnce(mockMeOk("new-access")); // /auth/me retry

    const res = await GET(
      makeRequest("win", {
        cookie: "honto_access_token=stale; honto_refresh_token=refresh-cur",
      }),
      params("win")
    );

    expect(res.status).toBe(302);
    const cookies = res.headers.getSetCookie?.() ?? [];
    expect(
      cookies.some((c) => c.includes("honto_access_token=new-access"))
    ).toBe(true);
    expect(
      cookies.some((c) => c.includes("honto_refresh_token=new-refresh"))
    ).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("redirects to /app-download when refresh also fails", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(null, { status: 401 })) // /auth/me
      .mockResolvedValueOnce(new Response(null, { status: 401 })); // /auth/refresh

    const res = await GET(
      makeRequest("mac", {
        cookie: "honto_access_token=stale; honto_refresh_token=also-stale",
      }),
      params("mac")
    );
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://honto.ai/app-download");
  });

  it("returns 503 when the manifest cannot be resolved", async () => {
    resolveReleaseMock.mockResolvedValue(null);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockMeOk("acc"));
    const res = await GET(
      makeRequest("mac", { cookie: "honto_access_token=acc" }),
      params("mac")
    );
    expect(res.status).toBe(503);
  });

  it("falls back to the public URL when presigning throws", async () => {
    presignMock.mockRejectedValue(new Error("aws-down"));
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockMeOk("acc"));
    const res = await GET(
      makeRequest("mac", { cookie: "honto_access_token=acc" }),
      params("mac")
    );
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(PUBLIC_URL);
  });

  it("per-IP rate-limit triggers at 60 requests/hour", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockMeOk("acc"));
    for (let i = 0; i < 60; i += 1) {
      const r = await GET(
        makeRequest("mac", {
          cookie: "honto_access_token=acc",
          ip: "9.9.9.9",
        }),
        params("mac")
      );
      expect(r.status).toBe(302);
    }
    const next = await GET(
      makeRequest("mac", {
        cookie: "honto_access_token=acc",
        ip: "9.9.9.9",
      }),
      params("mac")
    );
    expect(next.status).toBe(429);
  });

  it("audits the granted outcome when AUDIT_LOG_URL is set", async () => {
    vi.stubEnv("AUDIT_LOG_URL", "https://ops.test/audit/download");
    const fetchSeq = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(mockMeOk("acc")) // /auth/me
      .mockResolvedValue(new Response(null, { status: 204 })); // audit

    await GET(
      makeRequest("mac", { cookie: "honto_access_token=acc" }),
      params("mac")
    );

    const auditCall = fetchSeq.mock.calls.find(
      ([url]) => typeof url === "string" && url.includes("/audit/download")
    );
    expect(auditCall).toBeDefined();
    const body = JSON.parse(auditCall![1]!.body as string);
    expect(body.outcome).toBe("granted");
    expect(body.platform).toBe("mac");
    expect(body.version).toBe("0.1.0-beta.1"); // resolved from the manifest
    expect(body.user).toBe("u1");
    expect(body.ip).toBe("203.0.113.50");
    expect(JSON.stringify(body)).not.toContain("acc"); // no token leak
    expect(JSON.stringify(body)).not.toContain("r2.dev"); // no download URL leak
  });

  it("does not leak presigned URL into response body", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(mockMeOk("acc"));
    const res = await GET(
      makeRequest("mac", { cookie: "honto_access_token=acc" }),
      params("mac")
    );
    const bodyText = await res.text();
    expect(bodyText).toBe("");
  });
});
