# Guardrails Implementation Plan

**Status:** Complete
**Created:** 2026-03-19
**Last reviewed:** 2026-03-19

---

## Objective

Establish development guardrails for the honto-site repository _before_ any application code is written. The goal is to prevent quality debt from accumulating during the first wave of development, especially given that LLM-assisted contributions will be a primary workflow.

## Assumptions

- The repo is brand new with no application code, no package manager config, and no CI.
- The tech stack is **Next.js + TypeScript** (see [stack_decision.md](stack_decision.md)). Stack-dependent phases can now proceed.
- Multiple contributors (human and LLM-assisted) will work on the repo.
- The project is a website built with Next.js (App Router).
- GitHub is the hosting platform. GitHub Actions is the expected CI system.
- All guardrails should be enforceable locally and in CI, not just documented.

## Phased Rollout Plan

Guardrails are implemented in phases, ordered by dependency and risk. Each phase must be completed and validated before starting the next.

| Phase | Name                         | Depends On     | Stack-Dependent? |
| ----- | ---------------------------- | -------------- | ---------------- |
| 1     | Pre-commit and local hygiene | None           | No               |
| 2     | Lint/format foundation       | Stack decision | Yes              |
| 3     | Test infrastructure baseline | Stack decision | Yes              |
| 4     | Typecheck/build gates        | Stack decision | Yes              |
| 5     | CI workflow                  | Phases 1-4     | Yes              |
| 6     | PR/CODEOWNERS/governance     | Phase 5        | No               |
| 7     | Dead code guardrails         | Phase 2        | Partially        |
| 8     | Docs anti-rot system         | Phase 6        | No               |
| 9     | Scheduled hygiene workflow   | Phase 5        | No               |
| 10    | Final verification           | All above      | No               |

### Recommended Implementation Order

Phases 1 through 4 should happen in sequence. Phases 5 and 6 can overlap. Phases 7-9 are independent and can run in parallel after phase 6. Phase 10 is the capstone.

**Critical gate:** ~~The tech stack must be selected before phases 2-4 can begin.~~ Stack selected: Next.js + TypeScript. Phases 2-4 are unblocked.

## Local Gates vs CI Gates

| Gate                    | Local (pre-commit)    | CI (GitHub Actions)            |
| ----------------------- | --------------------- | ------------------------------ |
| File naming conventions | Yes                   | Yes                            |
| Lint                    | Yes                   | Yes                            |
| Format check            | Yes (auto-fix)        | Yes (check-only, fail on diff) |
| Unit tests              | Optional (fast suite) | Yes (full suite)               |
| Type checking           | Yes                   | Yes                            |
| Build                   | No                    | Yes                            |
| Dead code detection     | No                    | Yes (scheduled + PR)           |
| Docs freshness check    | No                    | Yes (scheduled)                |
| Dependency audit        | No                    | Yes (scheduled)                |
| CODEOWNERS validation   | No                    | Yes                            |

**Principle:** Local gates should be fast (<10 seconds). CI gates are authoritative. Local gates are a convenience to catch issues early; CI gates are the enforcement layer.

## Code Health Goals

1. **No dead exports.** Every exported function, type, or component must have at least one consumer or test.
2. **No orphan files.** Every source file must be reachable from an entry point or test.
3. **No unused dependencies.** Every entry in the dependency manifest must be imported somewhere.
4. **No untyped boundaries.** Public function signatures must have explicit types (once a typed language/framework is chosen).
5. **No skipped tests.** `.skip` or equivalent markers must not persist beyond a single PR. CI should fail on skipped tests in main.
6. **No TODO debt accumulation.** TODOs must include a tracking reference (issue number or author + date). Unreferenced TODOs older than 30 days should trigger a CI warning.

## Documentation Freshness Goals

1. Every directory containing source code must have a README explaining its purpose.
2. READMEs must be updated in the same PR that changes the directory's purpose or public interface.
3. Top-level docs must carry a metadata header with `last-reviewed` date.
4. Docs not reviewed in 90 days are flagged as potentially stale.
5. Speculative or aspirational docs must be clearly labeled and are subject to deletion if they remain unimplemented after 60 days.

See [docs_freshness_policy.md](docs_freshness_policy.md) for full details.

## Manual Platform Tasks

These require human action in GitHub settings and cannot be automated via code:

1. **Branch protection on `main`:** Require PR reviews, require status checks to pass, disallow force-push.
2. **Required status checks:** Link CI workflow jobs as required checks once CI is live.
3. **CODEOWNERS file activation:** Enable "Require review from Code Owners" in branch protection.
4. **GitHub Actions permissions:** Restrict Actions to only run approved workflows.
5. **Secrets management:** Add any deployment secrets only when deployment is configured.
6. **Repository visibility:** Confirm public/private setting matches project intent.

## Non-Goals for First Phases

The following are explicitly **not** in scope for phases 1-4:

- ~~Choosing the frontend framework or language~~ (decided: Next.js + TypeScript)
- Writing any application code
- Setting up deployment pipelines
- Configuring preview environments
- Performance budgets or Lighthouse CI
- Security scanning (SAST/DAST) beyond basic dependency audit
- Monorepo tooling (unless the project becomes a monorepo)
- Docker or containerization
- Database schema or migration tooling
