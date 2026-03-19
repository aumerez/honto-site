# Stack Decision

**Status:** Active
**Created:** 2026-03-19
**Last reviewed:** 2026-03-19

---

## Chosen Stack

**Next.js + TypeScript**

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict mode)
- **Package manager:** npm
- **Runtime:** Node.js

## Why This Stack

This repository will be developed by a group using LLM-assisted workflows. The stack must minimize ambiguity for both human and LLM contributors while supporting strong guardrails. Next.js + TypeScript is chosen because it scores highest across the decision criteria that matter for this project.

**LLM compatibility.** React and Next.js have the largest representation in LLM training data. Code generation tools produce higher-quality, more idiomatic output for this stack than for any alternative. This directly reduces review burden in an LLM-assisted workflow.

**Ecosystem maturity.** Next.js has the largest ecosystem of linting rules (`eslint-config-next`), testing patterns (React Testing Library, Vitest), type-checking tooling, and CI recipes. Every guardrail phase in our backlog has well-documented implementations for this stack.

**TypeScript strictness.** TypeScript with strict mode enabled enforces the "no untyped boundaries" goal from our implementation plan. Type errors are caught at compile time, not in review.

**Contributor familiarity.** React is the most widely known frontend framework. New contributors are most likely to have React experience, reducing onboarding friction.

**CI friendliness.** Next.js builds are deterministic, cacheable, and produce clear error output. GitHub Actions workflows for Next.js are well-established.

## Alternatives Considered

### Astro + TypeScript

**Strengths:**

- Purpose-built for content websites; ships zero JavaScript by default
- Excellent performance characteristics out of the box
- Supports multiple UI frameworks (React, Svelte, Vue) via islands
- Simpler mental model for static content

**Why not chosen:**

- Smaller ecosystem means fewer lint rules, fewer testing patterns, and less CI documentation
- LLMs produce less consistent Astro code compared to React/Next.js
- The islands architecture, while elegant, introduces a less familiar pattern that increases ambiguity for group contributors
- If the project later needs interactive features, the component islands model adds conceptual overhead

**Verdict:** Strong contender for a purely static content site. Would reconsider if the project scope were confirmed as content-only with no interactive features.

### Vite + React + TypeScript (no meta-framework)

**Strengths:**

- Minimal and fast; no framework opinions about routing or data fetching
- Full control over architecture decisions
- Vite's dev server is exceptionally fast

**Why not chosen:**

- Requires assembling routing, SSR/SSG, and other concerns manually—each decision is an ambiguity point for group contributors
- More setup decisions means more surface area for LLM-generated sprawl
- The guardrails backlog assumes a framework with built-in conventions (routing, build output); a bare Vite setup defers too many decisions

**Verdict:** Good for experienced teams building custom architectures. Too many open decisions for a group project with guardrails-first priorities.

### SvelteKit + TypeScript

**Strengths:**

- Less boilerplate than React; reactive model is intuitive
- Built-in routing, SSR, and form handling
- Growing ecosystem and strong developer satisfaction

**Why not chosen:**

- Significantly smaller ecosystem for linting, testing, and CI tooling
- LLMs produce noticeably lower-quality Svelte code due to less training data
- Fewer contributors will have Svelte experience, increasing onboarding time
- TypeScript integration, while good, has edge cases around Svelte-specific syntax (`.svelte` files with `<script lang="ts">`)

**Verdict:** Excellent framework on its own merits. Ecosystem size and LLM familiarity gaps make it a riskier choice for this project's constraints.

## Tradeoff Summary

| Criterion               | Next.js + TS | Astro + TS | Vite + React + TS | SvelteKit + TS |
| ----------------------- | ------------ | ---------- | ----------------- | -------------- |
| LLM code quality        | High         | Medium     | High              | Low-Medium     |
| Ecosystem maturity      | High         | Medium     | High              | Medium         |
| Lint/format tooling     | Excellent    | Good       | Excellent         | Good           |
| Test tooling            | Excellent    | Good       | Excellent         | Good           |
| CI recipes              | Excellent    | Good       | Good              | Fair           |
| Onboarding simplicity   | Good         | Good       | Fair              | Fair           |
| Fit for website         | Good         | Excellent  | Fair              | Good           |
| Complexity risk         | Medium       | Low        | Low               | Low            |
| Guardrail compatibility | Excellent    | Good       | Good              | Good           |

Next.js carries a medium complexity risk due to App Router features (server components, server actions, middleware). This is managed by establishing clear conventions about which features to use—documented below.

## Consequences for Future Phases

### Phase 2: Lint/Format Foundation

- **Linter:** ESLint with `eslint-config-next` and `@typescript-eslint`
- **Formatter:** Recommend evaluating Biome (unified lint+format) vs ESLint + Prettier. Decision made in Phase 2.
- **Config files:** `eslint.config.mjs` (flat config) or `biome.json`

### Phase 3: Test Infrastructure Baseline

- **Test runner:** Vitest (Vite-native, fast, Jest-compatible API)
- **Component testing:** React Testing Library
- **Config:** `vitest.config.ts`

### Phase 4: Typecheck/Build Gates

- **Type checker:** `tsc --noEmit` with strict mode
- **Build:** `next build`
- **Config:** `tsconfig.json` with strict settings enabled from day one

### Phase 5: CI Workflow

- **Build step:** `next build` (produces clear pass/fail)
- **Cache:** `node_modules` and `.next/cache` can be cached in GitHub Actions
- **Node version:** Pin to current LTS (v22.x as of this writing)

### Phase 7: Dead Code Guardrails

- **Tool:** Knip (purpose-built for JS/TS projects, supports Next.js entry points)
- **Config:** `knip.json` with Next.js plugin

### Package Manager

- **npm** is chosen over yarn or pnpm for simplicity and zero additional setup. `package-lock.json` will be committed. This avoids tool sprawl and keeps onboarding to `npm install`.

### .gitignore Additions Needed

When the project is scaffolded, `.gitignore` must be updated to include:

- `node_modules/`
- `.next/`
- `out/`
- `.env*.local`

## What This Decision Enables

1. All stack-dependent guardrail phases (2-5, 7) can now proceed with concrete tool choices.
2. Future prompts can reference specific tools (ESLint, Vitest, tsc) instead of generic placeholders.
3. The phased backlog entries for lint, test, typecheck, and CI can be refined with exact commands and config file names.

## What This Decision Intentionally Does Not Decide

- **Styling approach:** CSS Modules, Tailwind, styled-components, etc. Deferred until feature development begins.
- **State management:** Context, Zustand, Jotai, etc. Deferred until interactive features are needed.
- **Data fetching:** Static generation vs server-side rendering vs client-side. Decided per-page when pages are built.
- **Deployment target:** Vercel, self-hosted, static export, etc. Deferred until deployment phase.
- **Component library:** Headless UI, Radix, shadcn/ui, custom, etc. Deferred until UI development begins.
- **Database or CMS:** No backend decisions are made. The site may remain fully static.
- **App Router conventions:** Which Next.js App Router features to use (route groups, parallel routes, intercepting routes, server actions) will be decided when routing structure is designed. The default posture is to use the simplest pattern that works.
