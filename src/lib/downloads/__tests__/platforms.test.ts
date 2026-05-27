import { describe, it, expect } from "vitest";
import {
  isPlatform,
  bucketKeyFor,
  KEY_PREFIX,
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

describe("bucketKeyFor", () => {
  it("composes the key as KEY_PREFIX/filename", () => {
    expect(bucketKeyFor("honto.ops-0.1.0-beta.1-arm64.dmg")).toBe(
      `${KEY_PREFIX}/honto.ops-0.1.0-beta.1-arm64.dmg`
    );
    expect(bucketKeyFor("honto.ops Setup 1.2.3.exe")).toBe(
      `${KEY_PREFIX}/honto.ops Setup 1.2.3.exe`
    );
  });

  it("uses the beta channel layout today (no v<version> segment)", () => {
    expect(KEY_PREFIX).toBe("desktop/beta");
    expect(bucketKeyFor("x.AppImage").startsWith("desktop/beta/")).toBe(true);
  });
});
