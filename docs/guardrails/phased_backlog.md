# Phased Execution Backlog

**Status:** Complete
**Created:** 2026-03-19
**Last reviewed:** 2026-03-19

---

This backlog translates the [implementation plan](implementation_plan.md) into concrete execution phases. Each phase is self-contained and must meet its completion criteria before the next phase begins.

---

## Phase 1: Pre-commit and Local Hygiene

**Objective:** Install and configure pre-commit hooks so that basic quality checks run before every commit, regardless of stack.

**Expected files to create/modify:**

- `.pre-commit-config.yaml` or `.husky/` directory (depending on tooling choice)
- `.gitignore` (add hook-related ignores)
- `scripts/setup-hooks.sh` (one-command developer setup)
- `docs/guardrails/implementation_plan.md` (update status)

**Validation goal:**

- A commit with a trailing-whitespace file is blocked locally.
- A commit with a merge conflict marker is blocked locally.
- Large files (>1MB) trigger a warning.

**Risks to avoid:**

- Installing Node.js-specific tooling (like Husky) before the stack decision. Use a language-agnostic tool like `pre-commit` (Python-based) or shell-based git hooks if the stack is not yet chosen.
- Making hooks so slow that developers bypass them.

**Completion criteria:**

- [ ] Pre-commit hooks run on every contributor's machine after running setup script
- [ ] At least 3 basic checks are active (whitespace, merge markers, file size)
- [ ] Hook setup is documented in root README

---

## Phase 2: Lint/Format Foundation

**Objective:** Establish a single linter and a single formatter. All source files must pass both.

**Prerequisite:** Tech stack must be selected.

**Expected files to create/modify:**

- Linter config (e.g., `.eslintrc.json`, `biome.json`)
- Formatter config (e.g., `.prettierrc`, integrated in linter)
- `package.json` (lint and format scripts)
- `.pre-commit-config.yaml` (add lint/format hooks)
- `.editorconfig` (consistent editor settings)

**Validation goal:**

- Running `npm run lint` (or equivalent) checks all source files.
- Running `npm run format:check` exits non-zero if any file is unformatted.
- Pre-commit hook runs format and lint on staged files.

**Risks to avoid:**

- Installing both a standalone linter and a formatter that overlap (e.g., ESLint + Prettier with conflicting rules). Choose tools that integrate cleanly or use a unified tool like Biome.
- Overly strict rules that generate noise. Start with recommended presets and customize sparingly.

**Completion criteria:**

- [ ] One linter configured with a documented rule set
- [ ] One formatter configured with a documented style
- [ ] Both run in pre-commit hooks
- [ ] Both have npm scripts (or equivalent)
- [ ] No conflicts between linter and formatter rules

---

## Phase 3: Test Infrastructure Baseline

**Objective:** Set up the test runner and write at least one canary test proving the infrastructure works.

**Prerequisite:** Tech stack must be selected.

**Expected files to create/modify:**

- Test runner config (e.g., `vitest.config.ts`, `jest.config.js`)
- `package.json` (test scripts)
- One canary test file (e.g., `tests/canary.test.ts` or `src/__tests__/canary.test.ts`)

**Validation goal:**

- `npm test` runs and passes with at least one test.
- Test output is clean and shows pass/fail clearly.
- Coverage tooling is configured but not yet enforced.

**Risks to avoid:**

- Creating a test directory full of placeholder test files. Only create the canary test.
- Choosing a test runner without considering the framework's recommendations (e.g., Vitest for Vite-based projects).
- Setting a coverage threshold too early before knowing the codebase shape.

**Completion criteria:**

- [ ] Test runner installed and configured
- [ ] Canary test passes
- [ ] `npm test` script works
- [ ] Coverage reporting is available (not enforced)

---

## Phase 4: Typecheck/Build Gates

**Objective:** Ensure the project compiles/typechecks cleanly. No implicit `any`, no build warnings.

**Prerequisite:** Tech stack must be selected.

**Expected files to create/modify:**

- `tsconfig.json` (if TypeScript) or equivalent config
- `package.json` (build and typecheck scripts)
- `.pre-commit-config.yaml` (add typecheck hook, if fast enough)

**Validation goal:**

- `npm run typecheck` exits non-zero on type errors.
- `npm run build` produces output without warnings.
- Strict mode is enabled from day one.

**Risks to avoid:**

- Starting with loose type settings and planning to tighten later. Strictness is easier to maintain than to retrofit.
- Making the typecheck hook too slow for pre-commit. If it takes >10 seconds, move it to CI only.

**Completion criteria:**

- [ ] Typecheck script passes with strict settings
- [ ] Build script produces clean output
- [ ] No `// @ts-ignore` or equivalent suppressions exist

---

## Phase 5: CI Workflow

**Objective:** Create a GitHub Actions workflow that runs all local gates plus build verification on every push and PR.

**Prerequisite:** Phases 1-4 complete.

**Expected files to create/modify:**

- `.github/workflows/ci.yml`
- `docs/guardrails/implementation_plan.md` (update manual tasks checklist)

**Validation goal:**

- Pushing a branch triggers CI.
- CI runs: lint, format check, typecheck, test, build.
- CI fails visibly on any gate failure.
- CI completes in under 5 minutes for an empty/small project.

**Risks to avoid:**

- Over-engineering the CI with matrix builds, caching, and artifact uploads before there is real code to justify them.
- Not pinning action versions (use `@v4` not `@latest`).
- Not restricting workflow permissions.

**Completion criteria:**

- [ ] CI workflow file committed
- [ ] CI runs on push to main and on all PRs
- [ ] All 5 gates (lint, format, typecheck, test, build) are separate steps
- [ ] CI passes on current main branch
- [ ] Workflow uses pinned action versions

---

## Phase 6: PR/CODEOWNERS/Governance

**Objective:** Establish PR templates, CODEOWNERS, and branch protection to enforce review discipline.

**Prerequisite:** Phase 5 (CI must exist so required checks can be configured).

**Expected files to create/modify:**

- `.github/CODEOWNERS`
- `.github/pull_request_template.md`
- `.github/ISSUE_TEMPLATE/` (bug and feature templates)
- `docs/guardrails/repo_policy.md` (update with finalized PR rules)

**Validation goal:**

- PRs to main require at least one review.
- PRs to main require CI to pass.
- PR template prompts for test impact and docs impact.
- CODEOWNERS assigns reviewers for critical paths.

**Risks to avoid:**

- Making CODEOWNERS too granular before the codebase has clear ownership boundaries.
- Requiring too many reviewers, which slows development in a small team.

**Completion criteria:**

- [ ] CODEOWNERS file covers at least: root configs, docs/, and src/
- [ ] PR template includes test impact and docs impact sections
- [ ] Branch protection is configured on main (manual GitHub setting)
- [ ] At least one issue template exists

---

## Phase 7: Dead Code Guardrails

**Objective:** Detect and prevent dead exports, orphan files, and unused dependencies.

**Prerequisite:** Phase 2 (lint infrastructure must exist).

**Expected files to create/modify:**

- Lint rules or dedicated tool config (e.g., `knip.json` for JS/TS)
- `package.json` (dead code check script)
- `.github/workflows/ci.yml` (add dead code step)

**Validation goal:**

- Adding an unused export causes CI to fail.
- Adding a dependency without importing it causes CI to fail.
- An orphan file (not imported anywhere) is flagged.

**Risks to avoid:**

- False positives on entry points, config files, or dynamically imported modules. The tool must support an allowlist.
- Running dead code detection only on schedule instead of on every PR. PR-level checks catch issues at the source.

**Completion criteria:**

- [ ] Dead code tool configured with allowlist for known entry points
- [ ] Unused exports are detected
- [ ] Unused dependencies are detected
- [ ] Orphan files are detected
- [ ] CI step runs on every PR

---

## Phase 8: Docs Anti-Rot System

**Objective:** Automate detection of stale documentation and broken internal links.

**Prerequisite:** Phase 6 (governance must be in place).

**Expected files to create/modify:**

- `scripts/check-docs-freshness.sh` (or equivalent)
- `scripts/check-links.sh` (internal link checker)
- `.github/workflows/docs-health.yml` (scheduled workflow)

**Validation goal:**

- A doc with `last-reviewed` older than 90 days is flagged.
- A broken internal markdown link is flagged.
- The workflow opens an issue (or comments) when staleness is detected.

**Risks to avoid:**

- Generating too many automated issues that become noise. Batch findings into a single weekly issue.
- Checking external links (they break for reasons outside our control and cause flaky CI).

**Completion criteria:**

- [ ] Freshness check script works on all docs
- [ ] Link check script catches broken relative links
- [ ] Scheduled workflow runs weekly
- [ ] Findings are reported as a single issue, not spammed

---

## Phase 9: Scheduled Hygiene Workflow

**Objective:** Run periodic checks for dependency updates, TODO age, and general repo hygiene.

**Prerequisite:** Phase 5 (CI must exist).

**Expected files to create/modify:**

- `.github/workflows/hygiene.yml`
- `scripts/check-todos.sh` (scan for aged TODOs)
- `scripts/check-deps.sh` (dependency freshness check)

**Validation goal:**

- TODOs older than 90 days without issue references are reported.
- Outdated dependencies are reported (not auto-updated).
- The workflow runs weekly and opens a tracking issue.

**Risks to avoid:**

- Auto-updating dependencies without review. Report only; humans decide.
- Running hygiene checks on every PR (too slow and noisy). Schedule only.

**Completion criteria:**

- [ ] TODO scanner identifies aged and unreferenced TODOs
- [ ] Dependency checker reports outdated packages
- [ ] Weekly workflow creates a summary issue
- [ ] No automated changes are made—report only

---

## Phase 10: Final Verification

**Objective:** Validate that all guardrails work end-to-end by running a comprehensive check.

**Prerequisite:** All previous phases complete.

**Expected files to create/modify:**

- `scripts/verify-guardrails.sh` (runs all checks in sequence)
- `docs/guardrails/implementation_plan.md` (mark as complete)
- `docs/guardrails/phased_backlog.md` (mark all phases complete)

**Validation goal:**

- All local hooks work on a fresh clone after running the setup script.
- All CI gates pass.
- All scheduled workflows are registered and have run at least once.
- Policy docs are current and accurate.

**Risks to avoid:**

- Declaring victory without actually testing from a clean state.
- Forgetting to update docs to reflect the final implemented state.

**Completion criteria:**

- [ ] Fresh clone + setup script results in fully working local environment
- [ ] CI passes with all gates green
- [ ] Scheduled workflows have executed at least once
- [ ] All policy docs have `last-reviewed` dates within the past week
- [ ] Root README accurately describes the project state
