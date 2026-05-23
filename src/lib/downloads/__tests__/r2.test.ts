import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const getSignedUrlMock = vi.hoisted(() => vi.fn());

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: getSignedUrlMock,
}));

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: class {
    constructor(public config: unknown) {}
  },
  GetObjectCommand: class {
    constructor(public input: unknown) {}
  },
}));

import { presignDownloadUrl } from "@/lib/downloads/r2";

describe("presignDownloadUrl", () => {
  beforeEach(() => {
    getSignedUrlMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null when nothing is configured", async () => {
    expect(await presignDownloadUrl("mac", "0.1.0")).toBeNull();
  });

  describe("public-bucket mode (R2_PUBLIC_BASE_URL)", () => {
    it("returns the direct URL without calling the SDK", async () => {
      vi.stubEnv("R2_PUBLIC_BASE_URL", "https://pub-xyz.r2.dev");
      const result = await presignDownloadUrl("mac", "0.1.0");
      expect(result).toEqual({
        url: "https://pub-xyz.r2.dev/desktop/beta/honto.ops-0.1.0-arm64.dmg",
        filename: "honto.ops-0.1.0-arm64.dmg",
      });
      expect(getSignedUrlMock).not.toHaveBeenCalled();
    });

    it("strips trailing slash on the base URL", async () => {
      vi.stubEnv("R2_PUBLIC_BASE_URL", "https://pub-xyz.r2.dev///");
      const result = await presignDownloadUrl("win", "1.2.3");
      expect(result?.url).toBe(
        "https://pub-xyz.r2.dev/desktop/beta/honto.ops Setup 1.2.3.exe"
      );
    });

    it("takes precedence over private-mode credentials", async () => {
      vi.stubEnv("R2_PUBLIC_BASE_URL", "https://pub.example/");
      vi.stubEnv("R2_ACCOUNT_ID", "acct");
      vi.stubEnv("R2_ACCESS_KEY_ID", "key");
      vi.stubEnv("R2_SECRET_ACCESS_KEY", "secret");
      const result = await presignDownloadUrl("linux", "0.1.0");
      expect(result?.url.startsWith("https://pub.example/")).toBe(true);
      expect(getSignedUrlMock).not.toHaveBeenCalled();
    });
  });

  describe("private-bucket mode (presigning)", () => {
    it("calls getSignedUrl with a 5-minute TTL", async () => {
      vi.stubEnv("R2_ACCOUNT_ID", "acct");
      vi.stubEnv("R2_ACCESS_KEY_ID", "key");
      vi.stubEnv("R2_SECRET_ACCESS_KEY", "secret");
      vi.stubEnv("R2_BUCKET", "honto-installers");
      vi.stubEnv("R2_PUBLIC_ENDPOINT", "https://downloads.honto.ai");
      getSignedUrlMock.mockResolvedValue(
        "https://downloads.honto.ai/signed-blob"
      );

      const result = await presignDownloadUrl("mac", "0.1.0");

      expect(result?.url).toBe("https://downloads.honto.ai/signed-blob");
      expect(getSignedUrlMock).toHaveBeenCalledTimes(1);
      const ttl = getSignedUrlMock.mock.calls[0]![2] as { expiresIn: number };
      expect(ttl.expiresIn).toBe(300);
    });

    it("returns null when credentials are incomplete", async () => {
      vi.stubEnv("R2_ACCOUNT_ID", "acct");
      vi.stubEnv("R2_ACCESS_KEY_ID", "");
      vi.stubEnv("R2_SECRET_ACCESS_KEY", "secret");
      expect(await presignDownloadUrl("mac", "0.1.0")).toBeNull();
    });
  });
});
