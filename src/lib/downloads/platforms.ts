/**
 * Strict platform allow-list (spec §4.8) + installer artifact layout.
 *
 * The three knobs below are bumped per release in code (not env):
 *   - LATEST_VERSION   the version stamped into installer filenames
 *   - KEY_PREFIX       the path prefix inside the bucket
 *   - FILENAMES        per-platform filename template
 *
 * Today the installer artifacts live at:
 *   honto-updates/desktop/beta/<filename>
 * which is the existing public auto-update bucket's beta channel. When the
 * dedicated honto-installers private bucket comes online, set R2_BUCKET to
 * it and switch KEY_PREFIX to `desktop/v<version>` (matches spec §7).
 */

export const PLATFORMS = ["mac", "win", "linux"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const LATEST_VERSION = "0.1.0";
export const KEY_PREFIX = "desktop/beta";

const FILENAMES: Record<Platform, (version: string) => string> = {
  mac: (v) => `honto.ops-${v}-arm64.dmg`,
  win: (v) => `honto.ops Setup ${v}.exe`,
  linux: (v) => `honto.ops-${v}.AppImage`,
};

export function isPlatform(value: unknown): value is Platform {
  return (
    typeof value === "string" &&
    (PLATFORMS as readonly string[]).includes(value)
  );
}

export function filenameFor(platform: Platform, version: string): string {
  return FILENAMES[platform](version);
}

export function bucketKeyFor(platform: Platform, version: string): string {
  return `${KEY_PREFIX}/${filenameFor(platform, version)}`;
}
