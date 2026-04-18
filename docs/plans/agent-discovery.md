# Agent Discovery Plan

**Status:** Complete (initial bundle)
**Created:** 2026-04-18
**Last reviewed:** 2026-04-18

## Goal

Make `honto.ai` discoverable, parseable, and actionable by AI agents and search crawlers — Claude, ChatGPT, Perplexity, Copilot, Google, etc. Ship an initial bundle that combines standard SEO hygiene with two LLM-native signals (`llms.txt`) and a genuinely novel angle: an **agent-submittable contact form** discoverable via a well-known URL.

## Branch

`feat/agent-discovery` (branched from `main` at the PR #6 merge commit).

## Scope (this PR)

1. **`robots.txt`** — static file at `src/app/robots.ts` (Next.js convention) with explicit allow-list for GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, CCBot, Google-Extended, GoogleBot, Bingbot, etc., pointing to the sitemap.
2. **`sitemap.xml`** — dynamic, via `src/app/sitemap.ts`. Includes both `/en/*` and `/es/*` URLs for the landing, `/honto-ops`, and the two case-study pages, with correct `hreflang` alternates.
3. **JSON-LD structured data** — `Organization` schema on every layout; `Product` schema on `/honto-ops`. Emit via `<script type="application/ld+json">` tags in the relevant layouts/pages.
4. **`llms.txt`** — static file at the site root (`public/llms.txt`) following the emerging Jeremy Howard standard. Lists the site's purpose, primary URLs (EN + ES), and a pointer to `llms-full.txt` if we include one.
5. **Agent-submittable contact form** — publish `/.well-known/lead-form.json` describing the `/api/contact` schema (field names, types, required/optional, descriptions). Link to it from `llms.txt` and surface it in a human-visible spot (e.g. a small footer link or meta tag).

## Out of scope (follow-up PRs)

- FAQ section with `FAQPage` JSON-LD (copy-heavy work).
- `ai-policy.txt` declaring AI content usage policy.
- Page-speed audit and DOM pruning.
- `llms-full.txt` with every rendered page's markdown (do after the above ships).

## Decisions already made

- We keep the contact form API route as the source of truth; the well-known descriptor is generated from the same TypeScript types to avoid drift (or at minimum documented to match).
- Robots allow-list is opt-in by bot: we explicitly list who's allowed, rather than a blanket `User-agent: *`.
- Sitemap generated at request time (`src/app/sitemap.ts`), not committed as XML — easier to keep in sync with routes.
- JSON-LD is rendered server-side in the layout; no client JS needed.

## Open questions (resolve before merge)

- What exact copy should appear in `llms.txt`? (2–3 paragraph summary of what honto does; needs human sign-off.)
- Do we want an `Organization` JSON-LD `sameAs` pointing to GitHub, LinkedIn, etc.? Need the handles.
- What's the canonical base URL? Assumed `https://honto.ai` — confirm before hardcoding.

## Task checklist

- [x] Add `src/app/robots.ts` with allow-list
- [x] Add `src/app/sitemap.ts` with EN + ES alternates
- [x] Add `Organization` JSON-LD in `src/app/[locale]/layout.tsx`
- [x] Add `Product` JSON-LD in `src/app/[locale]/honto-ops/page.tsx`
- [x] Add `public/llms.txt`
- [x] Add `/.well-known/lead-form.json` route handler backed by shared descriptor
- [x] Extract `CONTACT_FIELDS` into `src/app/api/contact/descriptor.ts`; route validation now reads limits from it so descriptor and validator can't drift
- [x] Add tests (robots, sitemap, structured data, lead-form descriptor)
- [x] Full verify: lint, format, typecheck, test (84/84), dead-code, build

## Resume checklist (if stopping partway)

1. `git checkout feat/agent-discovery`
2. `git status` — confirm working tree state
3. Re-read this doc; strike completed items in the task checklist
4. Continue with the next unchecked task
