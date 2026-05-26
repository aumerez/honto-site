/**
 * Optional private-bucket presigning for the installer download.
 *
 * Today the installer is served from the public auto-update bucket and its URL
 * comes straight from the release manifest (src/lib/downloads/manifest.ts), so
 * this returns null and the route falls back to that public URL.
 *
 * If a dedicated private `honto-installers` bucket is provisioned (spec §2,
 * §4.6), set R2_ACCOUNT_ID + R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY and this
 * mints a 5-minute presigned URL for the same manifest-resolved filename,
 * upgrading the gate from soft to a real boundary — no caller change needed.
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
  // honto-updates is the existing public auto-update bucket where the beta
  // installers currently live; switch to honto-installers once the dedicated
  // private bucket is provisioned.
  const bucket = process.env.R2_BUCKET ?? "honto-updates";
  if (!accountId || !accessKeyId || !secretAccessKey) return null;
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
 * Presign a 5-minute download URL for a manifest-resolved installer filename.
 * Returns null when no private-bucket credentials are configured, signalling
 * the caller to fall back to the public manifest URL.
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
