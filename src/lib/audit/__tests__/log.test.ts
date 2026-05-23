import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { logDownload } from "@/lib/audit/log";

describe("logDownload", () => {
  const event = {
    user: "user-1",
    platform: "mac",
    version: "0.1.0",
    ip: "203.0.113.1",
    ua: "Mozilla/5.0",
    outcome: "granted" as const,
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is a no-op when AUDIT_LOG_URL is unset", () => {
    vi.stubEnv("AUDIT_LOG_URL", "");
    const fetchMock = vi.spyOn(globalThis, "fetch");
    logDownload(event);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("POSTs the event with a timestamp when AUDIT_LOG_URL is set", async () => {
    vi.stubEnv("AUDIT_LOG_URL", "https://ops.honto.ai/audit/download");
    vi.stubEnv("AUDIT_LOG_TOKEN", "service-token");
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 204 }));

    logDownload(event);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("https://ops.honto.ai/audit/download");
    expect(init?.method).toBe("POST");
    const headers = init?.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
    expect(headers["X-Service-Token"]).toBe("service-token");

    const body = JSON.parse(init?.body as string);
    expect(body.user).toBe("user-1");
    expect(body.outcome).toBe("granted");
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it("omits X-Service-Token when AUDIT_LOG_TOKEN is unset", () => {
    vi.stubEnv("AUDIT_LOG_URL", "https://ops.honto.ai/audit/download");
    vi.stubEnv("AUDIT_LOG_TOKEN", "");
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 204 }));
    logDownload(event);
    const headers = fetchMock.mock.calls[0]![1]?.headers as Record<
      string,
      string
    >;
    expect(headers["X-Service-Token"]).toBeUndefined();
  });

  it("never throws when fetch rejects", async () => {
    vi.stubEnv("AUDIT_LOG_URL", "https://ops.honto.ai/audit/download");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));
    expect(() => logDownload(event)).not.toThrow();
    // give the rejected promise a chance to resolve
    await new Promise((r) => setTimeout(r, 0));
  });
});
