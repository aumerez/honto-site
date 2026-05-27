/**
 * Resolve the current installer for a platform from the desktop release
 * manifest, instead of hardcoding versioned filenames.
 *
 * The honto.ops desktop app publishes installers to the R2 bucket alongside
 * electron-builder update manifests. The installer filenames are versioned
 * (they change every release), but the manifest filenames are fixed — so we
 * read the manifest to discover the current version + asset:
 *
 *   <prefix>/<channel>-mac.yml    → macOS  (.dmg)
 *   <prefix>/<channel>.yml        → Windows (.exe)
 *   <prefix>/<channel>-linux.yml  → Linux  (.AppImage)
 *
 * Both the manifest and the installer it names live in the private bucket
 * (R2_BUCKET); we read them with the R2 credentials via src/lib/downloads/r2.ts.
 * Server-side only — never bundled client-side.
 */

import yaml from "js-yaml";
import { bucketKeyFor, type Platform } from "@/lib/downloads/platforms";
import { getObjectText } from "@/lib/downloads/r2";

// Release channel; bumped in code the same way the bucket layout is — no env
// vars. Switch to "latest" once production releases are cut to it.
const CHANNEL = "beta";

/** Suffix on the channel manifest name, per platform. Windows has none. */
const MANIFEST_SUFFIX: Record<Platform, string> = {
  mac: "-mac",
  win: "",
  linux: "-linux",
};

/** Installer extension to offer — never the `.zip`/`.blockmap` updater deltas. */
const ASSET_EXT: Record<Platform, string> = {
  mac: ".dmg",
  win: ".exe",
  linux: ".AppImage",
};

interface ResolvedRelease {
  /** Version string from the manifest, e.g. "0.1.0-beta.1". */
  version: string;
  /** Versioned installer filename, e.g. "honto.ops-0.1.0-beta.1-arm64.dmg". */
  filename: string;
}

interface ManifestFile {
  url?: unknown;
}
interface Manifest {
  version?: unknown;
  files?: unknown;
}

/**
 * Read + parse the manifest for one platform and resolve the installer
 * version + filename. Returns null on any failure (missing credentials,
 * network, 404, malformed YAML, missing asset); callers translate that into
 * an opaque 503 / "unavailable" state.
 */
export async function resolveRelease(
  platform: Platform
): Promise<ResolvedRelease | null> {
  const manifestKey = bucketKeyFor(
    `${CHANNEL}${MANIFEST_SUFFIX[platform]}.yml`
  );

  const text = await getObjectText(manifestKey);
  if (text === null) return null;

  let doc: Manifest;
  try {
    doc = yaml.load(text) as Manifest;
  } catch {
    return null;
  }
  if (!doc || typeof doc.version !== "string" || !Array.isArray(doc.files)) {
    return null;
  }

  const ext = ASSET_EXT[platform].toLowerCase();
  const file = (doc.files as ManifestFile[]).find(
    (f) => typeof f?.url === "string" && f.url.toLowerCase().endsWith(ext)
  );
  if (!file || typeof file.url !== "string") return null;

  // Defense in depth: the filename becomes an object key (bucketKeyFor), so a
  // tampered manifest must not be able to escape the prefix via path segments.
  if (file.url.includes("/") || file.url.includes("\\")) return null;

  return { version: doc.version, filename: file.url };
}
