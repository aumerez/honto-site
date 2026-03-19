#!/usr/bin/env node

/**
 * Dependency freshness reporter.
 *
 * Reports outdated npm packages. This is informational only —
 * it does not fail the build or auto-update anything.
 *
 * Uses `npm outdated` which compares installed versions against
 * the registry. Exit code is always 0 (report-only).
 */

import { execSync } from "node:child_process";

function main() {
  try {
    const output = execSync("npm outdated --long 2>&1", {
      encoding: "utf-8",
      cwd: new URL("..", import.meta.url).pathname,
    });

    if (output.trim()) {
      console.log("Outdated dependencies (informational):\n");
      console.log(output);
    } else {
      console.log("Dependencies: all packages are up to date.");
    }
  } catch (err) {
    // npm outdated exits with code 1 when outdated packages exist.
    // This is expected behavior, not an error.
    if (err.stdout && err.stdout.trim()) {
      console.log("Outdated dependencies (informational):\n");
      console.log(err.stdout);
    } else {
      console.log("Dependencies: all packages are up to date.");
    }
  }

  // Always exit 0. This is a report, not a gate.
  process.exit(0);
}

main();
