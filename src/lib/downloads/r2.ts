/**
 * Private-bucket access for the gated installer download.
 *
 * Everything is read from the bucket named in R2_BUCKET using the R2
 * credentials (R2_ACCOUNT_ID + R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY):
 *
 *   - getObjectText()      reads the release manifest (so we can resolve the
 *                          current version + installer filename, see
 *                          src/lib/downloads/manifest.ts).
 *   - presignDownloadUrl() mints a 5-minute presigned URL for that installer.
 *
 * The bucket can therefore stay fully private — no object is served over a
 * public URL. When the credentials are absent both helpers return null and the
 * route reports the download as unavailable (503).
 */

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { bucketKeyFor } from "@/lib/downloads/platforms";

const PRESIGN_TTL_SECONDS = 300; // 5 minutes; spec §4.6 max validity.

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicEndpoint: string | null;
}

function readConfig(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicEndpoint: process.env.R2_PUBLIC_ENDPOINT?.trim() || null,
  };
}

function makeClient(config: R2Config): S3Client {
  // When R2_PUBLIC_ENDPOINT is set (e.g. https://downloads.honto.ai), use it
  // so the presigned URL hostname is the custom domain rather than the raw
  // R2 account host (spec §4.9 — keeps the account id off the wire).
  const endpoint =
    config.publicEndpoint ??
    `https://${config.accountId}.r2.cloudflarestorage.com`;
  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: !!config.publicEndpoint,
  });
}

/**
 * Read a UTF-8 object (the release manifest) from the private bucket.
 * Returns null when the credentials are missing or the object can't be read
 * (network, 404, access error); callers translate that into "unavailable".
 */
export async function getObjectText(key: string): Promise<string | null> {
  const config = readConfig();
  if (!config) return null;

  const client = makeClient(config);
  try {
    const res = await client.send(
      new GetObjectCommand({ Bucket: config.bucket, Key: key })
    );
    if (!res.Body) return null;
    return await res.Body.transformToString();
  } catch {
    return null;
  }
}

/**
 * Presign a 5-minute download URL for a manifest-resolved installer filename.
 * Returns null when no credentials are configured; the caller then reports the
 * download as unavailable (there is no public fallback — the bucket is private).
 */
export async function presignDownloadUrl(
  filename: string
): Promise<string | null> {
  const config = readConfig();
  if (!config) return null;

  const client = makeClient(config);
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: bucketKeyFor(filename),
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  });
  return getSignedUrl(client, command, { expiresIn: PRESIGN_TTL_SECONDS });
}
