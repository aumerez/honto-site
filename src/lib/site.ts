/**
 * Canonical site URL. Override via NEXT_PUBLIC_SITE_URL at build time when
 * deploying to a different host (preview environments, staging, etc).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://honto.ai"
).replace(/\/$/, "");
