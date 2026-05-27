import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const getSignedUrlMock = vi.hoisted(() => vi.fn());
const sendMock = vi.hoisted(() => vi.fn());

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: getSignedUrlMock,
}));

vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: class {
    constructor(public config: unknown) {}
    send = sendMock;
  },
  GetObjectCommand: class {
    constructor(public input: unknown) {}
  },
}));

import { getObjectText, presignDownloadUrl } from "@/lib/downloads/r2";

function stubCreds() {
  vi.stubEnv("R2_ACCOUNT_ID", "acct");
  vi.stubEnv("R2_ACCESS_KEY_ID", "key");
  vi.stubEnv("R2_SECRET_ACCESS_KEY", "secret");
  vi.stubEnv("R2_BUCKET", "honto-installers");
  vi.stubEnv("R2_PUBLIC_ENDPOINT", "https://downloads.honto.ai");
}

describe("presignDownloadUrl", () => {
  beforeEach(() => {
    getSignedUrlMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  const DMG = "honto.ops-0.1.0-beta.1-arm64.dmg";

  it("returns null when no credentials are configured", async () => {
    expect(await presignDownloadUrl(DMG)).toBeNull();
    expect(getSignedUrlMock).not.toHaveBeenCalled();
  });

  it("calls getSignedUrl with a 5-minute TTL and the prefixed key", async () => {
    stubCreds();
    getSignedUrlMock.mockResolvedValue(
      "https://downloads.honto.ai/signed-blob"
    );

    const url = await presignDownloadUrl(DMG);

    expect(url).toBe("https://downloads.honto.ai/signed-blob");
    expect(getSignedUrlMock).toHaveBeenCalledTimes(1);
    const command = getSignedUrlMock.mock.calls[0]![1] as {
      input: { Key: string; Bucket: string };
    };
    expect(command.input.Key).toBe(`desktop/beta/${DMG}`);
    expect(command.input.Bucket).toBe("honto-installers");
    const opts = getSignedUrlMock.mock.calls[0]![2] as { expiresIn: number };
    expect(opts.expiresIn).toBe(300);
  });

  it("returns null when credentials are incomplete", async () => {
    vi.stubEnv("R2_ACCOUNT_ID", "acct");
    vi.stubEnv("R2_ACCESS_KEY_ID", "");
    vi.stubEnv("R2_SECRET_ACCESS_KEY", "secret");
    vi.stubEnv("R2_BUCKET", "honto-installers");
    expect(await presignDownloadUrl(DMG)).toBeNull();
  });
});

describe("getObjectText", () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null when no credentials are configured", async () => {
    expect(await getObjectText("desktop/beta/beta-mac.yml")).toBeNull();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("reads the object body from the configured bucket and key", async () => {
    stubCreds();
    sendMock.mockResolvedValue({
      Body: { transformToString: async () => "version: 0.1.0-beta.1" },
    });

    const text = await getObjectText("desktop/beta/beta-mac.yml");

    expect(text).toBe("version: 0.1.0-beta.1");
    const command = sendMock.mock.calls[0]![0] as {
      input: { Key: string; Bucket: string };
    };
    expect(command.input.Key).toBe("desktop/beta/beta-mac.yml");
    expect(command.input.Bucket).toBe("honto-installers");
  });

  it("returns null when the object has no body", async () => {
    stubCreds();
    sendMock.mockResolvedValue({});
    expect(await getObjectText("desktop/beta/beta-mac.yml")).toBeNull();
  });

  it("returns null when the read throws (missing object / access error)", async () => {
    stubCreds();
    sendMock.mockRejectedValue(new Error("NoSuchKey"));
    expect(await getObjectText("desktop/beta/beta-mac.yml")).toBeNull();
  });
});
