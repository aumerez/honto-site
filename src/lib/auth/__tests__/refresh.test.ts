import { describe, it, expect, beforeEach, vi } from "vitest";
import { refreshTokens, __resetInFlightForTest } from "@/lib/auth/refresh";

describe("refreshTokens", () => {
  beforeEach(() => {
    __resetInFlightForTest();
    vi.restoreAllMocks();
  });

  it("returns rotated tokens on success", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: "new-access",
          refreshToken: "new-refresh",
        }),
        { status: 200 }
      )
    );

    const result = await refreshTokens("http://backend", "old-refresh");
    expect(result).toEqual({
      accessToken: "new-access",
      refreshToken: "new-refresh",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns null when backend rejects", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 401 })
    );
    expect(await refreshTokens("http://backend", "stale")).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));
    expect(await refreshTokens("http://backend", "tok")).toBeNull();
  });

  it("returns null when response is missing token fields", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ accessToken: "only-access" }), {
        status: 200,
      })
    );
    expect(await refreshTokens("http://backend", "tok")).toBeNull();
  });

  it("dedupes concurrent calls for the same refresh token", async () => {
    let resolveFetch!: (value: Response) => void;
    const pending = new Promise<Response>((r) => (resolveFetch = r));
    const fetchMock = vi.spyOn(globalThis, "fetch").mockReturnValue(pending);

    const a = refreshTokens("http://backend", "shared");
    const b = refreshTokens("http://backend", "shared");

    resolveFetch(
      new Response(JSON.stringify({ accessToken: "A", refreshToken: "B" }), {
        status: 200,
      })
    );

    const [ra, rb] = await Promise.all([a, b]);
    expect(ra).toEqual({ accessToken: "A", refreshToken: "B" });
    expect(rb).toEqual({ accessToken: "A", refreshToken: "B" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("clears in-flight entry after settlement, allowing later refreshes", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ accessToken: "A1", refreshToken: "B1" }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ accessToken: "A2", refreshToken: "B2" }),
          { status: 200 }
        )
      );

    const first = await refreshTokens("http://backend", "tok");
    const second = await refreshTokens("http://backend", "tok");
    expect(first?.accessToken).toBe("A1");
    expect(second?.accessToken).toBe("A2");
  });
});
