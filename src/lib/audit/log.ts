/**
 * Audit emission for download attempts.
 *
 * Spec §4.7: every download attempt (granted or rejected) is logged with
 * timestamp, user, platform, version, IP, UA, outcome. Honto.ops is the
 * intended sink via POST /audit/download with a service-to-service token,
 * but until that endpoint ships the helper is a no-op (no AUDIT_LOG_URL).
 *
 * Fire-and-forget: never blocks the caller, never throws.
 */

export type Outcome =
  | "granted"
  | `rejected:${"unauthenticated" | "forbidden_origin" | "invalid_platform" | "rate_limited" | "presign_failed" | "downloads_not_configured"}`;

interface DownloadAuditEvent {
  user: string;
  platform: string;
  version: string;
  ip: string;
  ua: string;
  outcome: Outcome;
}

interface AuditPayload extends DownloadAuditEvent {
  timestamp: string;
}

export function logDownload(event: DownloadAuditEvent): void {
  const url = process.env.AUDIT_LOG_URL;
  if (!url) return;

  const token = process.env.AUDIT_LOG_TOKEN;
  const payload: AuditPayload = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["X-Service-Token"] = token;

  // Fire-and-forget. Errors are swallowed so audit problems never break
  // the user-facing download flow.
  fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // intentional: audit failures must not surface to caller
  });
}
