/**
 * Strict platform allow-list (spec §4.8) + installer bucket layout.
 *
 * The versioned filename is no longer hardcoded here — it is resolved per
 * request from the release manifest (see src/lib/downloads/manifest.ts), so
 * filenames change with each release without a code bump. KEY_PREFIX is the
 * path inside the private R2 bucket (R2_BUCKET) holding both the manifests and
 * the installers they name; bump it if the bucket layout changes.
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
