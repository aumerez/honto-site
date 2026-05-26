import { describe, it, expect, afterEach, vi } from "vitest";
import { resolveRelease } from "@/lib/downloads/manifest";

const BASE = "https://pub-d082782d774141a9a040e770bdba5f2d.r2.dev/desktop/beta";

function mockFetch(body: string, status = 200) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockResolvedValue(new Response(body, { status }));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("resolveRelease", () => {
  it("reads <channel>-mac.yml and picks the .dmg, not the updater .zip", async () => {
    const spy = mockFetch(
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

    expect(spy).toHaveBeenCalledWith(`${BASE}/beta-mac.yml`, expect.anything());
    expect(release).toEqual({
      version: "0.1.0-beta.1",
      filename: "honto.ops-0.1.0-beta.1-arm64.dmg",
      url: `${BASE}/honto.ops-0.1.0-beta.1-arm64.dmg`,
    });
  });

  it("reads <channel>.yml for Windows and percent-encodes the spaced filename", async () => {
    const spy = mockFetch(
      [
        "version: 0.1.0-beta.1",
        "files:",
        "  - url: honto.ops Setup 0.1.0-beta.1.exe",
        "    sha512: x",
        "    size: 3",
      ].join("\n")
    );

    const release = await resolveRelease("win");

    expect(spy).toHaveBeenCalledWith(`${BASE}/beta.yml`, expect.anything());
    expect(release?.filename).toBe("honto.ops Setup 0.1.0-beta.1.exe");
    expect(release?.url).toBe(`${BASE}/honto.ops%20Setup%200.1.0-beta.1.exe`);
  });

  it("reads <channel>-linux.yml and picks the .AppImage over the .deb", async () => {
    const spy = mockFetch(
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

    expect(spy).toHaveBeenCalledWith(
      `${BASE}/beta-linux.yml`,
      expect.anything()
    );
    expect(release?.filename).toBe("honto.ops-0.1.0-beta.1.AppImage");
  });

  it("returns null on a non-200 manifest response", async () => {
    mockFetch("not found", 404);
    expect(await resolveRelease("mac")).toBeNull();
  });

  it("returns null on a network error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));
    expect(await resolveRelease("mac")).toBeNull();
  });

  it("returns null on malformed YAML", async () => {
    mockFetch("version: [unterminated");
    expect(await resolveRelease("mac")).toBeNull();
  });

  it("returns null when version or files are missing", async () => {
    mockFetch("files:\n  - url: honto.ops-0.1.0.dmg");
    expect(await resolveRelease("mac")).toBeNull();
  });

  it("returns null when no asset matches the platform extension", async () => {
    mockFetch(
      [
        "version: 0.1.0-beta.1",
        "files:",
        "  - url: honto.ops-0.1.0-beta.1-arm64-mac.zip",
        "    sha512: aaa",
      ].join("\n")
    );
    expect(await resolveRelease("mac")).toBeNull();
  });

  it("rejects a manifest that points the asset at a foreign origin", async () => {
    mockFetch(
      [
        "version: 0.1.0-beta.1",
        "files:",
        "  - url: https://evil.example/malware.dmg",
        "    sha512: aaa",
      ].join("\n")
    );
    expect(await resolveRelease("mac")).toBeNull();
  });
});
