#!/usr/bin/env node

/**
 * Docs freshness checker.
 *
 * Enforces the metadata and staleness rules defined in
 * docs/guardrails/docs_freshness_policy.md:
 *
 * - Every markdown doc (except root README and .github/ files)
 *   must have Status, Created, and Last reviewed metadata.
 * - Docs with last-reviewed older than 90 days are flagged as stale.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const STALENESS_DAYS = 90;

const EXCLUDED_PATHS = [
  "node_modules",
  ".next",
  ".venv",
  ".git",
  ".github",
  ".brv",
];

const EXEMPT_FILES = ["README.md"];

async function findMarkdownFiles(dir) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (EXCLUDED_PATHS.includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findMarkdownFiles(fullPath)));
    } else if (entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

function isExempt(filePath) {
  const rel = relative(ROOT, filePath);
  return EXEMPT_FILES.includes(rel);
}

function parseMetadata(content) {
  const meta = {};
  const statusMatch = content.match(/^\*\*Status:\*\*\s*(.+)$/m);
  const createdMatch = content.match(/^\*\*Created:\*\*\s*(.+)$/m);
  const reviewedMatch = content.match(/^\*\*Last reviewed:\*\*\s*(.+)$/m);
  if (statusMatch) meta.status = statusMatch[1].trim();
  if (createdMatch) meta.created = createdMatch[1].trim();
  if (reviewedMatch) meta.lastReviewed = reviewedMatch[1].trim();
  return meta;
}

function daysSince(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  const now = new Date();
  return Math.floor((now - date) / (1000 * 60 * 60 * 24));
}

async function main() {
  const files = await findMarkdownFiles(ROOT);
  const errors = [];
  const warnings = [];

  for (const filePath of files) {
    if (isExempt(filePath)) continue;

    const rel = relative(ROOT, filePath);
    const content = await readFile(filePath, "utf-8");
    const meta = parseMetadata(content);

    if (!meta.status) {
      errors.push(`${rel}: missing **Status:** metadata`);
    }
    if (!meta.created) {
      errors.push(`${rel}: missing **Created:** metadata`);
    }
    if (!meta.lastReviewed) {
      errors.push(`${rel}: missing **Last reviewed:** metadata`);
    }

    if (meta.lastReviewed) {
      const age = daysSince(meta.lastReviewed);
      if (age === null) {
        errors.push(
          `${rel}: **Last reviewed:** date is not a valid date: ${meta.lastReviewed}`
        );
      } else if (age > STALENESS_DAYS) {
        warnings.push(
          `${rel}: last reviewed ${age} days ago (threshold: ${STALENESS_DAYS} days)`
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error("Docs freshness errors:");
    for (const e of errors) console.error(`  ✗ ${e}`);
  }
  if (warnings.length > 0) {
    console.warn("Docs freshness warnings (stale):");
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }
  if (errors.length === 0 && warnings.length === 0) {
    console.log(
      "Docs freshness: all docs have valid metadata and are current."
    );
  }

  // Errors are hard failures. Warnings are informational (staleness).
  if (errors.length > 0) process.exit(1);
}

main();
