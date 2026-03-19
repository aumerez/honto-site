#!/usr/bin/env node

// check-todos: scans source for actionable code comments (to-do, fix-me, etc.)
// and enforces the format policy from docs/guardrails/repo_policy.md.

import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

const EXCLUDED_DIRS = [
  "node_modules",
  ".next",
  ".venv",
  ".git",
  ".github",
  ".brv",
  "out",
  "coverage",
];

const SOURCE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".css",
  ".sh",
];

const MARKERS = ["TODO", "FIXME", "HACK", "WORKAROUND"];

// Matches a comment-style line containing a marker.
// Requires the marker to appear after a comment prefix: //, /*, *, #
// This avoids flagging prose references, documentation examples, and strings.
const COMMENT_TODO = new RegExp(
  `^\\s*(?:\\/\\/|\\/\\*|\\*|#)\\s*.*\\b(${MARKERS.join("|")})\\b`,
  "i"
);

// Proper format: MARKER(author, 2026-03-19): description
const PROPER_FORMAT = new RegExp(
  `\\b(${MARKERS.join("|")})\\(([^,]+),\\s*(\\d{4}-\\d{2}-\\d{2})\\):\\s*(.+)`,
  "i"
);

const ISSUE_REF = /#\d+/;

function daysSince(dateStr) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

async function findSourceFiles(dir) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    if (EXCLUDED_DIRS.includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findSourceFiles(fullPath)));
    } else if (SOURCE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  const files = await findSourceFiles(ROOT);
  const errors = [];
  const warnings = [];
  let totalTodos = 0;

  for (const filePath of files) {
    const rel = relative(ROOT, filePath);
    const content = await readFile(filePath, "utf-8");
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!COMMENT_TODO.test(line)) continue;

      totalTodos++;
      const lineNum = i + 1;
      const markerMatch = line.match(
        new RegExp(`\\b(${MARKERS.join("|")})\\b`, "i")
      );
      const marker = markerMatch[1].toUpperCase();
      const loc = `${rel}:${lineNum}`;

      const formatMatch = line.match(PROPER_FORMAT);
      if (!formatMatch) {
        errors.push(
          `${loc}: ${marker} missing required format — expected: ${marker}(author, YYYY-MM-DD): description`
        );
        continue;
      }

      const dateStr = formatMatch[3];
      const rest = formatMatch[4];
      const age = daysSince(dateStr);
      const hasIssue = ISSUE_REF.test(rest);

      if (age !== null && age > 14 && !hasIssue) {
        errors.push(
          `${loc}: ${marker} is ${age} days old without an issue reference`
        );
      }

      if (age !== null && age > 90) {
        warnings.push(
          `${loc}: ${marker} is ${age} days old — consider resolving or re-justifying`
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error("TODO/FIXME policy violations:");
    for (const e of errors) console.error(`  ✗ ${e}`);
  }
  if (warnings.length > 0) {
    console.warn("TODO/FIXME age warnings:");
    for (const w of warnings) console.warn(`  ⚠ ${w}`);
  }

  if (errors.length === 0 && warnings.length === 0) {
    if (totalTodos === 0) {
      console.log("TODO check: no TODO/FIXME comments found.");
    } else {
      console.log(
        `TODO check: ${totalTodos} comment(s) found, all comply with policy.`
      );
    }
  }

  if (errors.length > 0) process.exit(1);
}

main();
