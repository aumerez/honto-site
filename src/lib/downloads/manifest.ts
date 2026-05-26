/**
 * Resolve the current installer for a platform from the desktop release
 * manifest, instead of hardcoding versioned filenames.
 *
 * The honto.ops desktop app publishes installers to a public Cloudflare R2
 * bucket alongside electron-builder update manifests. The installer filenames
 * are versioned (they change every release), but the manifest filenames are
 * fixed — so we read the manifest to discover the current version + asset.
 *
 *   <base>/<channel>/<channel>-mac.yml    → macOS  (.dmg)
 *   <base>/<channel>/<channel>.yml        → Windows (.exe)
 *   <base>/<channel>/<channel>-linux.yml  → Linux  (.AppImage)
 *
 * Fetched server-side only: the r2.dev public URLs do not send permissive
 * CORS headers, so a browser fetch() from the site origin would fail. Callers
 * are route handlers / server components, so this is never bundled client-side.
 */

import yaml from "js-yaml";
import type { Platform } from "@/lib/downloads/platforms";

// Public bucket + channel. These are public (not secret) and bumped in code
// the same way the bucket layout is — no env vars. Switch CHANNEL to "latest"
// once production releases are cut to it (it is not populated yet).
const MANIFEST_BASE =
  "https://pub-d082782d774141a9a040e770bdba5f2d.r2.dev/desktop";
const CHANNEL = "beta";

// Manifests change every release; cache for minutes, not days, or we serve a
// stale version/URL. Next dedupes + revalidates on this window.
const MANIFEST_TTL_SECONDS = 300;

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
  /** Absolute, percent-encoded public download URL. */
  url: string;
}

interface ManifestFile {
  url?: unknown;
}
interface Manifest {
  version?: unknown;
  files?: unknown;
}

/**
 * Fetch + parse the manifest for one platform and resolve the download.
 * Returns null on any failure (network, 404, malformed YAML, missing asset);
 * callers translate that into an opaque 503 / "unavailable" state.
 */
export async function resolveRelease(
  platform: Platform
): Promise<ResolvedRelease | null> {
  const channelDir = `${MANIFEST_BASE}/${CHANNEL}/`;
  const manifestUrl = `${channelDir}${CHANNEL}${MANIFEST_SUFFIX[platform]}.yml`;

  let text: string;
  try {
    const res = await fetch(manifestUrl, {
      next: { revalidate: MANIFEST_TTL_SECONDS },
    });
    if (!res.ok) return null;
    text = await res.text();
  } catch {
    return null;
  }

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

  // Build the absolute URL against the channel dir. `new URL` percent-encodes
  // spaces in the Windows filename ("honto.ops Setup …exe" → %20).
  let url: string;
  try {
    url = new URL(file.url, channelDir).href;
  } catch {
    return null;
  }

  // Defense in depth: a tampered manifest must not be able to redirect the
  // download to a foreign origin — the resolved URL has to stay under base.
  if (!url.startsWith(`${MANIFEST_BASE}/`)) return null;

  return { version: doc.version, filename: file.url, url };
}
