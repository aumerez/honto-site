import { describe, it, expect } from "vitest";
import {
  isPlatform,
  filenameFor,
  bucketKeyFor,
  LATEST_VERSION,
  KEY_PREFIX,
  PLATFORMS,
} from "@/lib/downloads/platforms";

describe("isPlatform", () => {
  it("accepts the three canonical platforms", () => {
    expect(isPlatform("mac")).toBe(true);
    expect(isPlatform("win")).toBe(true);
    expect(isPlatform("linux")).toBe(true);
  });

  it("rejects empty string", () => {
    expect(isPlatform("")).toBe(false);
  });

  it("rejects case variants", () => {
    expect(isPlatform("MAC")).toBe(false);
    expect(isPlatform("Win")).toBe(false);
    expect(isPlatform("LINUX")).toBe(false);
  });

  it("rejects unknown platforms", () => {
    expect(isPlatform("solaris")).toBe(false);
    expect(isPlatform("ios")).toBe(false);
    expect(isPlatform("android")).toBe(false);
  });

  it("rejects traversal attempts", () => {
    expect(isPlatform("../etc/passwd")).toBe(false);
    expect(isPlatform("mac/../win")).toBe(false);
  });

  it("rejects non-string inputs", () => {
    expect(isPlatform(undefined)).toBe(false);
    expect(isPlatform(null)).toBe(false);
    expect(isPlatform(123)).toBe(false);
    expect(isPlatform(["mac"])).toBe(false);
  });
});

describe("filenameFor", () => {
  it("produces expected filenames per platform", () => {
    expect(filenameFor("mac", "0.1.0")).toBe("honto.ops-0.1.0-arm64.dmg");
    expect(filenameFor("win", "0.1.0")).toBe("honto.ops Setup 0.1.0.exe");
    expect(filenameFor("linux", "0.1.0")).toBe("honto.ops-0.1.0.AppImage");
  });

  it("covers every platform in PLATFORMS", () => {
    for (const p of PLATFORMS) {
      expect(filenameFor(p, "9.9.9")).toContain("9.9.9");
    }
  });
});

describe("bucketKeyFor", () => {
  it("composes the key as KEY_PREFIX/filename", () => {
    expect(bucketKeyFor("mac", LATEST_VERSION)).toBe(
      `${KEY_PREFIX}/honto.ops-${LATEST_VERSION}-arm64.dmg`
    );
    expect(bucketKeyFor("win", "1.2.3")).toBe(
      `${KEY_PREFIX}/honto.ops Setup 1.2.3.exe`
    );
    expect(bucketKeyFor("linux", "9.9.9")).toBe(
      `${KEY_PREFIX}/honto.ops-9.9.9.AppImage`
    );
  });

  it("uses the beta channel layout today (no v<version> segment)", () => {
    expect(KEY_PREFIX).toBe("desktop/beta");
    expect(bucketKeyFor("mac", "0.1.0").startsWith("desktop/beta/")).toBe(true);
  });
});
