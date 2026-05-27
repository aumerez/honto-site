# Authenticated desktop installer downloads

**Status:** Active
**Created:** 2026-05-22
**Last reviewed:** 2026-05-23

---

## Context

The desktop installers for the honto.ops app must not be accessible to anonymous internet users — only to authenticated honto.ops accounts. The authoritative requirements live in `.project/AUTHENTICATED-DOWNLOADS-SPEC.md`. This document records the implementation decisions made for `honto.ai` and the work that was explicitly deferred.

## Hidden route

The download experience lives at a single hidden top-level page: `/app-download`. The route is intentionally **not** linked from the header, footer, sitemap, or any other internal navigation. It exports `metadata: { robots: { index: false, follow: false } }`, is added to `src/proxy.ts`'s locale-skip list, and is included in the `DISALLOWED_PATHS` list inside `src/app/robots.ts` so even the allow-listed bots are blocked from crawling it. Access is by direct URL only.

The page renders either the login panel (when the request has no valid session) or the download panel (when authenticated). There is no separate `/login` route.

## Decisions answered from spec §10

| #   | Spec question          | Decision                                                                                                                                                                                                                                                                                     |
| --- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hosting                | **Vercel (Node host)**. We use `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` against R2's S3-compatible endpoint. The native Cloudflare R2 binding option (§5.1) is not used.                                                                                                       |
| 2   | Validation mode (§4.3) | **Mode A — `/auth/me` round-trip.** honto.ai never holds `JWT_SECRET`. Token revocations and RBAC changes apply immediately. The latency cost is negligible for a once-per-install action.                                                                                                   |
| 3   | Sign-up flow           | **Admin-only.** No self-serve signup. The login panel surfaces "Need an account? Contact us to get access." Will revisit when honto.ops adds a public `POST /auth/register` endpoint.                                                                                                        |
| 4   | Versioning             | **Latest by default — code constant.** `LATEST_VERSION` lives in `src/lib/downloads/platforms.ts` and is bumped per release in source (no env var). A future `?version=` override for QA is straightforward to add.                                                                          |
| 5   | Audit log destination  | **honto.ops** when the endpoint exists. Until then, `AUDIT_LOG_URL` is unset and `logDownload()` is a no-op — production rollout requires honto.ops `POST /audit/download` (see Blockers below).                                                                                             |
| 6   | Custom domain          | **`downloads.honto.ai`** via the configurable `R2_PUBLIC_ENDPOINT` env var (private-bucket presigning mode). Falls back to the raw `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` host only if the public endpoint is unset. For the dev public-bucket mode, see "Storage modes" below. |
| 7   | Wholograph readiness   | **Email + password only**, per spec §3.4. The SSO swap is isolated to two files (`src/app/app-download/LoginPanel.tsx` and `src/app/api/auth/login/route.ts`); see "Future SSO migration" below.                                                                                             |

## Implementation summary

### Auth flow

- Login form POSTs to `src/app/api/auth/login/route.ts`. The route validates input shape (no XSS surface — backend never echoes the body), proxies to honto.ops `POST /auth/login`, and on success sets two cookies: `honto_access_token` and `honto_refresh_token`. Both are `HttpOnly; Secure; SameSite=Lax; Path=/`. The response body returns only `{ ok: true, user: { id, email } }` — never the tokens themselves.
- Each request to `/api/downloads/[platform]` validates the session by forwarding the access cookie to honto.ops `GET /auth/me`. On 401 we attempt one refresh against `POST /auth/refresh` with **single-in-flight dedup** (see `src/lib/auth/refresh.ts`) to mirror the desktop's behavior and avoid the refresh-token-rotation race described in spec §3.2.
- Successful refresh rotates both cookies on the next response.
- Logout best-effort calls honto.ops `POST /auth/logout` and always clears local cookies.

### Download flow

`GET /api/downloads/[platform]`:

1. CSRF guard: rejects 403 unless `Origin` (or `Referer` fallback) exactly matches `SITE_ORIGIN`.
2. Per-IP rate limit: 60 requests/hour.
3. Mode-A session validation (with refresh-on-401).
4. Per-user rate limit: 20 requests/hour.
5. Strict platform allow-list: only `"mac" | "win" | "linux"` accepted; any case variant or traversal attempt returns 400.
6. R2 env presence check: returns 503 "Downloads are not available right now." when `R2_*` is missing (no leak of which env var is unset).
7. Presigned URL minted via the AWS SDK with **`expiresIn: 300`** (5 minutes, spec §4.6) and `ResponseContentDisposition: attachment; filename="…"`. No user identity in the URL.
8. Audit emission (fire-and-forget) with timestamp, user id, platform, version, IP, UA, outcome.
9. 302 redirect to the presigned URL with `Referrer-Policy: strict-origin-when-cross-origin` and `Cache-Control: no-store`.

The download UI shows two explicit buttons — Windows and macOS. Linux remains backend-supported (`/api/downloads/linux` works) but has no button; a third button can be added without backend changes.

### Storage modes

`src/lib/downloads/r2.ts` supports two modes, selected by env vars:

| Mode                            | Trigger                                                                                     | URL produced                                                                | Spec posture                                                                                                                            |
| ------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Public bucket**            | `R2_PUBLIC_BASE_URL` is set                                                                 | `${R2_PUBLIC_BASE_URL}/<KEY_PREFIX>/<file>` (default prefix `desktop/beta`) | Dev only — anyone who knows the URL can download. Cookie gate becomes a soft UX gate, not a security boundary. Deviates from spec §4.6. |
| **2. Private bucket + presign** | `R2_ACCOUNT_ID` + `R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY` set (no `R2_PUBLIC_BASE_URL`) | 5-minute presigned URL via AWS SDK against the S3-compatible R2 endpoint    | Spec-compliant (§4.6). Required for production.                                                                                         |
| **3. Unconfigured**             | Neither set                                                                                 | Route returns opaque 503                                                    | n/a                                                                                                                                     |

The route handler's behavior is identical in both modes (cookie gate, origin guard, allow-list, audit, 302 with `Referrer-Policy`). Switching modes is purely an env-var change. Production cutover sets the credential vars and leaves `R2_PUBLIC_BASE_URL` empty.

## Environment variables

All env vars are **server-side only** — none use the `NEXT_PUBLIC_` prefix, none are exposed to the browser bundle.

The installer version + filename layout are intentionally **NOT** env vars — they're code constants in `src/lib/downloads/platforms.ts` (`LATEST_VERSION`, `KEY_PREFIX`, `FILENAMES`). Bumping a release means a one-line code change, not an env update.

| Var                    | Required                                  | Purpose                                                                                                                                                   |
| ---------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_ORIGIN`          | Yes (prod)                                | Exact-match for the CSRF Origin/Referer guard. Defaults to `https://honto.ai`. Dev: set to `http://localhost:3000`.                                       |
| `BACKEND_URL`          | Yes                                       | honto.ops base URL for `/auth/login`, `/auth/refresh`, `/auth/me`, `/auth/logout`. Today this is a Cloudflare tunnel.                                     |
| `R2_PUBLIC_BASE_URL`   | Mode 1 only                               | Public bucket base URL. When set, route returns a direct URL (no presigning). Dev-only — security trade-off documented.                                   |
| `R2_ACCOUNT_ID`        | Mode 2 only                               | Cloudflare R2 account id.                                                                                                                                 |
| `R2_ACCESS_KEY_ID`     | Mode 2 only                               | R2 read-only token.                                                                                                                                       |
| `R2_SECRET_ACCESS_KEY` | Mode 2 only                               | R2 secret for the read-only token.                                                                                                                        |
| `R2_BUCKET`            | Mode 2 only — defaults to `honto-updates` | Bucket name. Today points at the existing public auto-update bucket's beta channel; switch to `honto-installers` once that private bucket is provisioned. |
| `R2_PUBLIC_ENDPOINT`   | Mode 2 only — recommended                 | Custom-domain endpoint (e.g. `https://downloads.honto.ai`). Falls back to the raw R2 host.                                                                |
| `AUDIT_LOG_URL`        | Optional                                  | When set, fire-and-forget POSTs to this URL for audit ingest. Unset → no audit emission.                                                                  |
| `AUDIT_LOG_TOKEN`      | Optional                                  | Service-to-service token sent as `X-Service-Token` on audit POSTs.                                                                                        |

## Security posture

| Control                                               | Status                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTPS only (HSTS)                                     | Relies on Vercel edge config — not enforced in app code. Documented for production cutover.                                                                                                                                                                                             |
| Cookies HttpOnly+Secure+SameSite=Lax                  | Enforced in `src/lib/auth/cookies.ts`. Secure flag toggles on `NODE_ENV=production`.                                                                                                                                                                                                    |
| Cookie scope (no `Domain` attribute)                  | Deliberately omitted, making them **host-only** cookies scoped to the exact serving origin. Stricter than spec §4.2's `Domain=honto.ai` (no subdomain leakage) and dev/prod-portable (localhost vs honto.ai). Add `Domain=honto.ai` only if a session must be shared across subdomains. |
| No tokens in JS / localStorage / non-HttpOnly cookies | Enforced — all token reads/writes are server-side.                                                                                                                                                                                                                                      |
| JWT validation                                        | Mode A — honto.ops validates. `alg: none` etc. are backend concerns.                                                                                                                                                                                                                    |
| CSRF (Origin/Referer) on downloads                    | Enforced.                                                                                                                                                                                                                                                                               |
| Strict platform allow-list                            | Enforced.                                                                                                                                                                                                                                                                               |
| Presigned URL ≤ 5 min                                 | Enforced via constant `PRESIGN_TTL_SECONDS = 300`.                                                                                                                                                                                                                                      |
| Refresh single-use rotation, dedup                    | Single-in-flight dedup mirrors the desktop pattern. Per-process; cross-instance races are possible on Vercel but resolve to a benign re-login.                                                                                                                                          |
| Audit log w/o token leakage                           | Audit payload contains user id, platform, version, IP, UA, outcome — no tokens or URLs.                                                                                                                                                                                                 |
| Bounded public errors                                 | All public responses use generic messages — no stack traces, no backend payloads echoed.                                                                                                                                                                                                |
| Rate limiting                                         | In-memory sliding window (per lambda instance). Sufficient for early stage; production should move to Upstash / Cloudflare RL (see Deferred).                                                                                                                                           |
| Read-only R2 token                                    | Enforced by the token's R2 scope, not by app code. Coordinate with provisioning.                                                                                                                                                                                                        |

## Future SSO migration (Wholograph) — design seam

honto.ops will replace email + password with a new SSO method (Wholograph). To keep the swap small, the email/password mechanism is intentionally isolated to two files:

- `src/app/app-download/LoginPanel.tsx` — credential-collection UI.
- `src/app/api/auth/login/route.ts` — credential exchange handler.

Everything else (session validation, refresh dedup, cookies, origin guard, logout, download route) is independent of how the session was minted. The SSO swap replaces these two files; no other code changes.

## Tests

- Unit tests in `src/lib/**/__tests__/` cover rate-limit math, cookie shape, origin allow-list (with adversarial inputs), refresh dedup, platform allow-list, and audit no-op behavior.
- Integration tests in `src/app/api/**/__tests__/` cover login happy/401/429/500/502, logout cookie clearing with and without backend reachability, and the full download contract (origin guard, redirect to `/app-download`, platform allow-list, R2 env gating, presign failure, refresh-on-401 with cookie rotation, rate-limit thresholds, audit emission shape).

## Deferred work (tracked here so it isn't forgotten)

| #   | Item                                                           | Why deferred                                                                                                                                      |
| --- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Playwright E2E (spec §8.3)                                     | Adding Playwright is a major dependency. Integration tests cover the same contracts via mocked fetch and presigner.                               |
| 2   | Distributed rate limiting via `@upstash/ratelimit` (spec §4.5) | In-memory rate limit mirrors the existing onboarding/contact pattern. Production-grade limits should move to Upstash or Cloudflare RL on cutover. |
| 3   | RS256 + JWKS migration (spec §6.2 (B)/(C))                     | Not a prerequisite for shipping. Mode A means honto.ai never holds the signing secret today.                                                      |
| 4   | `aud` claim per app (spec §6.2 (A)/(D))                        | Defense-in-depth. Backend ticket; cookie shape stays the same.                                                                                    |

## Backend blockers (honto.ops repo — coordinate, not implemented here)

These must land in honto.ops before the production cutover:

1. `POST /audit/download` endpoint with `X-Service-Token` auth (spec §6.1 #1). Until live, our audit helper no-ops on missing `AUDIT_LOG_URL`.
2. `HONTO_AI_AUDIT_TOKEN` service-to-service secret (spec §6.1 #2).
3. CORS allow-list for `https://honto.ai` on `/auth/login`, `/auth/refresh`, `/auth/me`, `/auth/logout` (spec §6.1 #3). Our `/api/auth/*` proxies sidestep this for now because backend calls happen server-side.
4. CI mirroring of installer artifacts from `honto-updates` → `s3://honto-installers/desktop/v<version>/` (spec §7).

## References

- Spec: `.project/AUTHENTICATED-DOWNLOADS-SPEC.md`
- Plan file: `/home/fegloff/.claude/plans/transient-sniffing-wozniak.md`
