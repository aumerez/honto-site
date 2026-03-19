# CLAUDE.md

## Project Overview

**honto-site** — A Next.js + TypeScript website repository with development guardrails established before feature work. No application features have been built yet; only a minimal app shell exists.

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Package manager:** npm
- **Node version:** 22 LTS
- **Deployment:** Not configured. No deployment target has been chosen.
- **Environment variables:** None defined. No `.env` files exist.
- **Design system / styling:** Not configured. No CSS framework or component library has been chosen.

### Directory Structure

```
src/app/              # Next.js App Router pages and layouts
src/app/__tests__/    # Co-located tests (Vitest + React Testing Library)
scripts/              # Custom Node.js check scripts (.mjs)
docs/guardrails/      # Governance and policy documentation
.github/workflows/    # CI and scheduled hygiene workflows
.github/              # CODEOWNERS, PR template, issue template
```

### Key Commands

```sh
npm run dev              # Start dev server
npm run build            # Production build (Next.js + Turbopack)
npm run lint             # ESLint (eslint-config-next, flat config)
npm run lint:fix         # ESLint with auto-fix
npm run format           # Prettier write
npm run format:check     # Prettier check (CI mode)
npm run typecheck        # tsc --noEmit (strict)
npm test                 # Vitest run
npm run test:watch       # Vitest watch mode
npm run test:coverage    # Vitest with coverage
npm run check:dead-code  # Knip (unused deps/exports/files)
npm run check:docs       # Docs freshness + internal link check
npm run check:todos      # TODO/FIXME policy compliance
npm run check:deps       # Dependency freshness report (informational)
npm run check:hygiene    # TODOs + deps combined
npm run verify           # Full validation: lint → format → typecheck → test → dead-code → docs → todos → build
```

## Guardrails and Repo Workflow

This repo was built guardrails-first. Quality infrastructure is fully operational.

### Pre-Commit Hooks (via Python `pre-commit` framework)

Runs automatically on every commit:

- Trailing whitespace, end-of-file newline, mixed line endings (LF enforced)
- Merge conflict markers, JSON/YAML/TOML validation
- Large file prevention (>2 MB), case conflict detection
- Private key detection, secret scanning (`detect-secrets`)
- Prettier format enforcement on staged files

Setup: `python3 -m venv .venv && source .venv/bin/activate && pip install pre-commit && pre-commit install`

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every push to `main` and on all PRs. Single job, sequential steps:

1. Lint → 2. Format check → 3. Typecheck → 4. Test → 5. Dead code check → 6. Docs health → 7. Build

Node.js 22 LTS, npm cache via `actions/setup-node@v4`, permissions hardened to `contents: read`.

### Scheduled Hygiene (`.github/workflows/hygiene.yml`)

Runs weekly (Monday 09:00 UTC) and on manual dispatch:

1. TODO/FIXME policy compliance
2. Dependency freshness report (informational, never fails)
3. Docs freshness check (staleness detection)

### PR Governance

- **CODEOWNERS:** All paths require review from `@bpolania`
- **PR template:** Requires summary, test impact, docs impact, anti-sprawl checklist
- **Issue template:** Bug report with structured fields

### Manual GitHub Settings (not yet applied)

Branch protection on `main` must be configured manually:

- Require PR + 1 approval + Code Owner review
- Require `validate` status check to pass
- Require branches up to date before merging
- Disallow force pushes and deletions

### Full Verification

Run `npm run verify` before pushing. It chains all gates in sequence and fails on any error.

## Frontend Design Guidelines

Create distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement working code with exceptional attention to aesthetic details and creative choices.

Before coding UI, understand the context and commit to a clear aesthetic direction:

- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Commit to a specific aesthetic — brutally minimal, luxury/refined, editorial/magazine, playful, industrial, organic, retro-futuristic, etc. Be intentional, not generic.
- **Differentiation**: What makes this memorable? What's the one detail someone will remember?

Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

### Aesthetics Rules

- **Typography**: Choose distinctive, characterful fonts. Pair a display font with a refined body font. Never default to Inter, Roboto, Arial, or system fonts.
- **Color**: Commit to a cohesive palette. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Use CSS variables for consistency.
- **Motion**: Focus on high-impact moments — a well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.
- **Layout**: Embrace asymmetry, overlap, generous negative space, or controlled density. Avoid predictable, cookie-cutter component patterns.
- **Atmosphere**: Create depth with gradients, textures, shadows, or overlays rather than defaulting to flat solid colors.

Never use: generic AI aesthetics, purple-gradient-on-white cliches, overused font families, or predictable layouts that lack context-specific character.

Match implementation complexity to the aesthetic vision. Elegant minimalism needs restraint and precision. Maximalist designs need elaborate detail. Execute the vision fully.

## Code Conventions

- **App structure:** Next.js App Router at `src/app/`. Pages are `page.tsx`, layouts are `layout.tsx`.
- **Tests:** Co-located in `__tests__/` directories adjacent to the code they test. Named `*.test.tsx` or `*.test.ts`. Use Vitest + React Testing Library.
- **Lint:** ESLint 9 flat config at `eslint.config.mjs`. Uses `eslint-config-next/core-web-vitals`.
- **Format:** Prettier with config in `.prettierrc.json`. Semi, double quotes, 2-space indent, trailing commas (es5), 80 char width.
- **Path alias:** `@/*` maps to `./src/*` (configured in `tsconfig.json` and `vitest.config.ts`).
- **TODO format:** `TODO(author, YYYY-MM-DD): description` — enforced by `check:todos`. Must reference an issue after 14 days.
- **Dead code:** Knip config in `knip.json`. CI fails on unused exports, dependencies, or orphan files.
- **Docs metadata:** All docs under `docs/` must have `Status`, `Created`, and `Last reviewed` frontmatter fields.
