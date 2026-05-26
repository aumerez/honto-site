/**
 * Strict platform allow-list (spec §4.8) + installer bucket layout.
 *
 * The versioned filename is no longer hardcoded here — it is resolved per
 * request from the release manifest (see src/lib/downloads/manifest.ts), so
 * filenames change with each release without a code bump. KEY_PREFIX is the
 * path inside the (optional) private bucket used for presigning; switch it to
 * `desktop/v<version>` if the honto-installers private bucket comes online
 * (spec §7).
 */

export const PLATFORMS = ["mac", "win", "linux"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const KEY_PREFIX = "desktop/beta";

export function isPlatform(value: unknown): value is Platform {
  return (
    typeof value === "string" &&
    (PLATFORMS as readonly string[]).includes(value)
  );
}

/** Object key for presigning a manifest-resolved filename in the bucket. */
export function bucketKeyFor(filename: string): string {
  return `${KEY_PREFIX}/${filename}`;
}
