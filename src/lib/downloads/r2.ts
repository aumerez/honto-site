/**
 * Two-mode URL minting for the installer download. The bucket key layout
 * (path prefix + filenames + version) is centralized in
 * src/lib/downloads/platforms.ts so all bumping happens in one place.
 *
 *   1. Public-bucket mode (R2_PUBLIC_BASE_URL is set):
 *      Returns ${R2_PUBLIC_BASE_URL}/<key> verbatim. No SDK call, no
 *      credentials needed. Dev-friendly path against a public bucket —
 *      but anyone with the URL can download, so the cookie gate becomes
 *      a soft UX gate, not a security boundary. Spec (§2, §4.6) calls for
 *      a private bucket + presigned URLs; switching to mode 2 restores that.
 *
 *   2. Private-bucket mode (R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY +
 *      R2_ACCOUNT_ID set, no R2_PUBLIC_BASE_URL):
 *      Mints a 5-minute presigned URL via the AWS SDK against R2's S3
 *      endpoint. Spec §4.6 compliant.
 *
 * Returns null when neither mode is configured — the route handler turns
 * that into an opaque 503 without leaking which var is missing.
 */

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  bucketKeyFor,
  filenameFor,
  type Platform,
} from "@/lib/downloads/platforms";

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

interface PresignedDownload {
  url: string;
  filename: string;
}

export async function presignDownloadUrl(
  platform: Platform,
  version: string
): Promise<PresignedDownload | null> {
  const filename = filenameFor(platform, version);
  const key = bucketKeyFor(platform, version);

  // Mode 1: public bucket. Stitch the URL directly; no SDK call, no creds.
  const publicBase = process.env.R2_PUBLIC_BASE_URL?.trim();
  if (publicBase) {
    const base = publicBase.replace(/\/+$/, "");
    return { url: `${base}/${key}`, filename };
  }

  // Mode 2: private bucket — full presigning.
  const config = readConfig();
  if (!config) return null;

  const client = makeClient(config);
  const command = new GetObjectCommand({
    Bucket: config.bucket,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  });
  const url = await getSignedUrl(client, command, {
    expiresIn: PRESIGN_TTL_SECONDS,
  });
  return { url, filename };
}
