import { describe, it, expect, beforeEach, vi } from "vitest";

const getObjectTextMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/downloads/r2", () => ({
  getObjectText: getObjectTextMock,
}));

import { resolveRelease } from "@/lib/downloads/manifest";

beforeEach(() => {
  getObjectTextMock.mockReset();
});

describe("resolveRelease", () => {
  it("reads desktop/beta/beta-mac.yml and picks the .dmg, not the updater .zip", async () => {
    getObjectTextMock.mockResolvedValue(
      [
        "version: 0.1.0-beta.1",
        "files:",
        "  - url: honto.ops-0.1.0-beta.1-arm64-mac.zip",
        "    sha512: aaa",
        "    size: 1",
        "  - url: honto.ops-0.1.0-beta.1-arm64.dmg",
        "    sha512: bbb",
        "    size: 2",
        "path: honto.ops-0.1.0-beta.1-arm64-mac.zip",
        "releaseDate: '2026-05-26T21:28:30.916Z'",
      ].join("\n")
    );

    const release = await resolveRelease("mac");

    expect(getObjectTextMock).toHaveBeenCalledWith("desktop/beta/beta-mac.yml");
    expect(release).toEqual({
      version: "0.1.0-beta.1",
      filename: "honto.ops-0.1.0-beta.1-arm64.dmg",
    });
  });

  it("reads desktop/beta/beta.yml for Windows and keeps the spaced filename", async () => {
    getObjectTextMock.mockResolvedValue(
      [
        "version: 0.1.0-beta.1",
        "files:",
        "  - url: honto.ops Setup 0.1.0-beta.1.exe",
        "    sha512: x",
        "    size: 3",
      ].join("\n")
    );

    const release = await resolveRelease("win");

    expect(getObjectTextMock).toHaveBeenCalledWith("desktop/beta/beta.yml");
    expect(release?.filename).toBe("honto.ops Setup 0.1.0-beta.1.exe");
  });

  it("reads desktop/beta/beta-linux.yml and picks the .AppImage over the .deb", async () => {
    getObjectTextMock.mockResolvedValue(
      [
        "version: 0.1.0-beta.1",
        "files:",
        "  - url: honto-ops-desktop_0.1.0-beta.1_amd64.deb",
        "    sha512: y",
        "  - url: honto.ops-0.1.0-beta.1.AppImage",
        "    sha512: z",
      ].join("\n")
    );

    const release = await resolveRelease("linux");

    expect(getObjectTextMock).toHaveBeenCalledWith(
      "desktop/beta/beta-linux.yml"
    );
    expect(release?.filename).toBe("honto.ops-0.1.0-beta.1.AppImage");
  });

  it("returns null when the manifest object cannot be read", async () => {
    getObjectTextMock.mockResolvedValue(null);
    expect(await resolveRelease("mac")).toBeNull();
  });

  it("returns null on malformed YAML", async () => {
    getObjectTextMock.mockResolvedValue("version: [unterminated");
    expect(await resolveRelease("mac")).toBeNull();
  });

  it("returns null when version or files are missing", async () => {
    getObjectTextMock.mockResolvedValue("files:\n  - url: honto.ops-0.1.0.dmg");
    expect(await resolveRelease("mac")).toBeNull();
  });

  it("returns null when no asset matches the platform extension", async () => {
    getObjectTextMock.mockResolvedValue(
      [
        "version: 0.1.0-beta.1",
        "files:",
        "  - url: honto.ops-0.1.0-beta.1-arm64-mac.zip",
        "    sha512: aaa",
      ].join("\n")
    );
    expect(await resolveRelease("mac")).toBeNull();
  });

  it("rejects a filename containing a path separator (key traversal)", async () => {
    getObjectTextMock.mockResolvedValue(
      [
        "version: 0.1.0-beta.1",
        "files:",
        "  - url: ../../secrets/evil.dmg",
        "    sha512: aaa",
      ].join("\n")
    );
    expect(await resolveRelease("mac")).toBeNull();
  });
});
