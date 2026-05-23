import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST } from "../route";

describe("/api/auth/logout POST", () => {
  beforeEach(() => {
    vi.stubEnv("BACKEND_URL", "https://ops.test");
    vi.stubEnv("NODE_ENV", "production");
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("clears both cookies and calls backend best-effort", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 204 }));

    const res = await POST(
      new Request("http://localhost/api/auth/logout", {
        method: "POST",
        headers: { cookie: "honto_access_token=tok-1" },
      })
    );

    expect(res.status).toBe(200);
    const cookies = res.headers.getSetCookie?.() ?? [];
    expect(cookies).toHaveLength(2);
    for (const c of cookies) {
      expect(c).toContain("Max-Age=0");
      expect(c).toContain("HttpOnly");
      expect(c).toContain("Secure");
    }
    expect(fetchMock).toHaveBeenCalledWith(
      "https://ops.test/auth/logout",
      expect.objectContaining({
        headers: { Authorization: "Bearer tok-1" },
      })
    );
  });

  it("still clears cookies when backend errors", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));
    const res = await POST(
      new Request("http://localhost/api/auth/logout", {
        method: "POST",
        headers: { cookie: "honto_access_token=tok" },
      })
    );
    expect(res.status).toBe(200);
    expect(res.headers.getSetCookie?.()).toHaveLength(2);
  });

  it("does not call backend when no access cookie", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const res = await POST(
      new Request("http://localhost/api/auth/logout", { method: "POST" })
    );
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
