# honto-site

A Next.js + TypeScript website repository with development guardrails established before feature work.

## Current Status

**Guardrail setup is complete.** All 10 phases of the guardrails rollout have been implemented. The repo is ready for application development.

The tech stack is **Next.js + TypeScript**. A minimal app shell exists. No features have been built yet — the focus so far has been on establishing quality infrastructure for group LLM-assisted development.

## Documentation

All planning and policy documents live in [`docs/guardrails/`](docs/guardrails/):

| Document                                                          | Purpose                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------ |
| [Implementation Plan](docs/guardrails/implementation_plan.md)     | Master plan for guardrail rollout                      |
| [Repository Policy](docs/guardrails/repo_policy.md)               | Contribution rules and structural constraints          |
| [Docs Freshness Policy](docs/guardrails/docs_freshness_policy.md) | How documentation is kept current                      |
| [Phased Backlog](docs/guardrails/phased_backlog.md)               | Concrete execution phases with completion criteria     |
| [Stack Decision](docs/guardrails/stack_decision.md)               | Framework choice rationale and downstream implications |
| [Final Closure Report](docs/guardrails/final_closure_report.md)   | Summary of all implemented guardrails                  |

## Developer Setup

```sh
# Install Node dependencies
npm install

# Install pre-commit hooks (file hygiene, format enforcement, security)
python3 -m venv .venv
source .venv/bin/activate
pip install pre-commit
pre-commit install
```

## Available Commands

| Command                        | Purpose                                  |
| ------------------------------ | ---------------------------------------- |
| `npm run lint`                 | Run ESLint on all source files           |
| `npm run lint:fix`             | Run ESLint with auto-fix                 |
| `npm run format`               | Format all files with Prettier           |
| `npm run format:check`         | Check formatting without modifying files |
| `npm test`                     | Run tests (Vitest)                       |
| `npm run test:watch`           | Run tests in watch mode                  |
| `npm run test:coverage`        | Run tests with coverage report           |
| `npm run typecheck`            | Run TypeScript type checking             |
| `npm run build`                | Production build (Next.js)               |
| `npm run check:dead-code`      | Detect unused deps, exports, and files   |
| `npm run check:docs`           | Run all docs health checks               |
| `npm run check:docs-freshness` | Check docs metadata and staleness        |
| `npm run check:links`          | Validate internal markdown links         |
| `npm run check:todos`          | Check TODO/FIXME policy compliance       |
| `npm run check:deps`           | Report outdated dependencies             |
| `npm run check:hygiene`        | Run all scheduled hygiene checks         |
| `npm run verify`               | Run full local validation suite          |
| `pre-commit run --all-files`   | Run all pre-commit hooks manually        |

## Stack

**Next.js + TypeScript** with npm. See [Stack Decision](docs/guardrails/stack_decision.md) for full rationale.

Guardrails setup is complete. The repo is ready for feature development.

## CI and PR Process

GitHub Actions runs on every push to `main` and on all pull requests. The workflow validates: lint, format, typecheck, tests, dead-code detection, docs health, and build. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

All PRs use a [template](.github/pull_request_template.md) that requires test impact and docs impact statements. Code ownership is defined in [CODEOWNERS](.github/CODEOWNERS). See [Repository Policy](docs/guardrails/repo_policy.md) for full contribution rules.

A [scheduled hygiene workflow](.github/workflows/hygiene.yml) runs weekly to check TODO/FIXME policy compliance, dependency freshness, and docs staleness.

## What Has Not Been Decided

- Styling approach (Tailwind, CSS Modules, etc.)
- Component library
- Deployment target
- State management
- Database or CMS
