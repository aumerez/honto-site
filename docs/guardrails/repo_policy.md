# Repository Policy

**Status:** Active
**Created:** 2026-03-19
**Last reviewed:** 2026-03-19

---

This document defines the structural and contribution rules for the honto-site repository. All contributors (human and LLM-assisted) must follow these policies.

## Allowed Top-Level Structure

The repo root may contain only these categories of items:

| Item                        | Purpose                                     | Required?               |
| --------------------------- | ------------------------------------------- | ----------------------- |
| `README.md`                 | Project overview                            | Yes                     |
| `docs/`                     | All documentation                           | Yes                     |
| `src/`                      | Application source code                     | When development begins |
| `tests/` or colocated tests | Test files                                  | When development begins |
| `scripts/`                  | Build, CI, and maintenance scripts          | When needed             |
| `public/` or `static/`      | Static assets                               | When development begins |
| Package manager files       | `package.json`, lock files, etc.            | When stack is chosen    |
| Config files                | `.eslintrc`, `tsconfig.json`, etc.          | When stack is chosen    |
| `.github/`                  | GitHub-specific config (Actions, templates) | When CI is set up       |
| `.gitignore`                | Git ignore rules                            | Yes                     |
| `.gitattributes`            | Git attributes                              | Already present         |

**Rule:** No top-level directory may be created without updating this table and getting PR approval. This prevents organic sprawl.

## Rules for Introducing New Directories

1. A new directory must have a clear, single purpose stated in a README.md within that directory.
2. The directory must be added to the structure table above (or a relevant sub-structure doc) in the same PR.
3. Directories must not duplicate the purpose of an existing directory.
4. Empty directories are not allowed. Git does not track them, and `.gitkeep` files are prohibited.
5. Nested directories deeper than 4 levels require justification in the PR description.

## Where Things Live

| Artifact                   | Location                                                       |
| -------------------------- | -------------------------------------------------------------- |
| Project documentation      | `docs/`                                                        |
| Guardrails and policy docs | `docs/guardrails/`                                             |
| Architecture decisions     | `docs/decisions/` (when needed)                                |
| Application source code    | `src/`                                                         |
| Tests                      | Colocated with source (preferred) or `tests/` mirroring `src/` |
| Scripts (build, CI, utils) | `scripts/`                                                     |
| GitHub workflows           | `.github/workflows/`                                           |
| PR and issue templates     | `.github/`                                                     |

## Policy Against Placeholder Files

**Placeholder files are prohibited.** A placeholder is any file that:

- Contains only a comment like "TODO: implement"
- Exists solely to "reserve" a directory or namespace
- Has no functional content and no meaningful documentation
- Was created "in case we need it later"

Every file committed must serve a current, concrete purpose. If a file is needed later, create it later.

## Policy Against Duplicate Configs and Tooling

1. Each concern (linting, formatting, testing, building) must have exactly one config file.
2. If a tool supports config in `package.json` and a standalone file, choose one and document which.
3. Do not install two tools that solve the same problem (e.g., both Prettier and dprint for formatting).
4. When replacing a tool, remove the old tool's config and dependencies in the same PR.

## Policy for TODO/FIXME Comments

TODO and FIXME comments are allowed but regulated:

**Required format:**

```
// TODO(username, 2026-03-19): Description of what needs to be done. See #issue-number.
// FIXME(username, 2026-03-19): Description of the bug. See #issue-number.
```

**Rules:**

1. Every TODO/FIXME must include the author and date.
2. Every TODO/FIXME should reference a tracking issue. If no issue exists, create one.
3. TODOs without an issue reference are flagged in CI after 14 days.
4. TODOs older than 90 days trigger a CI warning. The team should resolve or re-justify them.
5. `HACK` and `WORKAROUND` comments follow the same rules as TODO.

## Policy for LLM-Generated Changes

LLM-assisted development is a first-class workflow in this repo. To manage quality:

1. **LLM-generated code is held to the same quality bar as human-written code.** No exceptions.
2. **Review responsibility stays with the human.** The person submitting the PR is accountable for every line, regardless of who or what generated it.
3. **No bulk file creation.** LLM-driven PRs that create more than 5 new files require justification in the PR description for each new file.
4. **No speculative abstractions.** Do not accept LLM suggestions to "add a utility for future use" or create wrapper layers without immediate consumers.
5. **Watch for common LLM patterns to reject:**
   - Unnecessary re-exports or barrel files
   - Overly defensive error handling for impossible states
   - Verbose comments that restate obvious code
   - Config files for tools not yet in use
   - Placeholder or skeleton files
6. **Attribution is optional** but contributors may note LLM assistance in commit messages.

## Change Impact Requirements

Every PR must address these two questions in its description:

### Test Impact

- What tests were added, modified, or removed?
- If no tests were changed, why not?
- What is the risk if this change has a bug?

### Docs Impact

- What documentation was added, modified, or removed?
- If a public interface changed, was the relevant README updated?
- If no docs were changed, why not?

PRs that skip both sections without explanation should not be merged.

## Stale Docs Policy

Documentation must not silently rot. When a doc becomes outdated:

1. **Do not leave it in place hoping someone will update it.** Outdated docs are worse than no docs.
2. **If you can update it, update it** in the same PR that changed the underlying code.
3. **If you cannot update it now,** move it to `docs/archive/` with a note about why it was archived.
4. **Archived docs** must include a header noting the archive date and reason.

See [docs_freshness_policy.md](docs_freshness_policy.md) for the full freshness system.
