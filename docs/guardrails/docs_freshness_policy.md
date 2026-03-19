# Documentation Freshness Policy

**Status:** Active
**Created:** 2026-03-19
**Last reviewed:** 2026-03-19

---

## Purpose

Prevent documentation rot. Outdated docs mislead contributors and waste time. This policy defines how docs are categorized, when they must be reviewed, and what happens when they go stale.

## Document Categories

### Active Docs

Active docs describe the current state of the project. They live in `docs/` or as README files within source directories.

**Requirements:**

- Must have a metadata header (see below)
- Must be accurate as of their `last-reviewed` date
- Must be updated when the code they describe changes

### Archived Docs

Archived docs describe decisions, designs, or states that are no longer current. They live in `docs/archive/`.

**Requirements:**

- Must have an archive header noting when and why they were archived
- Must not be deleted (they preserve project history)
- Must not be referenced as current guidance

### Speculative Docs

Speculative docs describe features, designs, or plans that have not been implemented.

**Rules:**

- Must be clearly labeled as speculative in their header: `Status: Speculative`
- Must include an expected resolution date
- If still speculative after 60 days with no linked implementation work, they should be archived or deleted
- Speculative docs must never be cited as justification for code changes

## Required Metadata Header

Every markdown doc in the repo (except the root README) must begin with:

```markdown
# Document Title

**Status:** [Active | Speculative | Archived]
**Created:** YYYY-MM-DD
**Last reviewed:** YYYY-MM-DD
```

For archived docs, add:

```markdown
**Archived:** YYYY-MM-DD
**Archive reason:** Brief explanation
```

## When a README Is Required

A README.md is required in:

1. The repo root
2. Every directory under `src/` that represents a module, feature, or significant boundary
3. The `docs/` directory itself
4. The `scripts/` directory (explaining what each script does)

A README is **not** required in:

- Deeply nested implementation directories where the parent README covers the purpose
- `node_modules`, build output, or generated directories
- `.github/` (GitHub has its own conventions)

## When a README Must Be Updated

A README must be updated in the same PR if:

1. The directory's purpose changes
2. A public interface exposed by the directory changes
3. Setup or usage instructions become incorrect
4. Files referenced in the README are renamed or deleted

## Signals That a Doc Is Stale

A doc should be considered potentially stale if any of these are true:

1. `last-reviewed` date is more than 90 days old
2. Files or functions referenced in the doc no longer exist
3. The doc describes a process or architecture that has been replaced
4. The doc references dependencies or tools no longer in `package.json` (or equivalent)
5. A contributor reports that the doc does not match reality

## Review Cadence

| Doc Type                     | Review Trigger                        | Maximum Staleness                |
| ---------------------------- | ------------------------------------- | -------------------------------- |
| Root README                  | Any significant project change        | 60 days                          |
| Source directory READMEs     | When directory contents change        | 90 days                          |
| Policy docs (this directory) | Quarterly or when policy changes      | 90 days                          |
| Architecture/decision docs   | When referenced decision is revisited | None (but archive if superseded) |
| Speculative docs             | Every 30 days                         | 60 days before auto-archive      |

## Enforcement

### Phase 1 (Manual)

- PR reviewers check that docs are updated alongside code changes.
- Quarterly manual review of all docs with `last-reviewed` older than 90 days.

### Phase 2 (Automated, future)

- CI script scans for docs with stale `last-reviewed` dates and comments on PRs.
- CI script checks for broken internal links in markdown files.
- Scheduled workflow lists docs exceeding staleness thresholds and opens tracking issues.

## How to Handle Speculative Docs

1. Before writing a speculative doc, ask: "Is there an issue or decision tracking this?" If not, create one first.
2. Write the doc with `Status: Speculative` and link the tracking issue.
3. When the feature is implemented, update the doc to `Status: Active` and set `last-reviewed` to the implementation date.
4. If the feature is abandoned, archive the doc with `Archive reason: Feature not pursued. See #issue-number.`
