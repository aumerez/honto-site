#!/usr/bin/env node

/**
 * Internal markdown link checker.
 *
 * Validates that markdown links pointing to local files resolve correctly.
 * Does NOT check external URLs (those are flaky and outside our control).
 *
 * Checks:
 * - [text](relative/path.md) → file exists
 * - [text](relative/path) → file or directory exists
 * - Skips URLs (http://, https://, mailto:, #anchors-only)
 */

import { readdir, readFile, access } from "node:fs/promises";
import { join, dirname, relative, resolve } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");

const EXCLUDED_PATHS = ["node_modules", ".next", ".venv", ".git", ".brv"];

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

function extractLinks(content) {
  const links = [];
  // Match [text](target) but not ![image](src)
  const regex = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push({ text: match[1], target: match[2], index: match.index });
  }
  return links;
}

function isExternal(target) {
  return (
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:") ||
    target.startsWith("#")
  );
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function getLineNumber(content, charIndex) {
  return content.substring(0, charIndex).split("\n").length;
}

async function main() {
  const files = await findMarkdownFiles(ROOT);
  const errors = [];

  for (const filePath of files) {
    const rel = relative(ROOT, filePath);
    const content = await readFile(filePath, "utf-8");
    const links = extractLinks(content);

    for (const link of links) {
      if (isExternal(link.target)) continue;

      // Strip anchor from target for file resolution
      const targetPath = link.target.split("#")[0];
      if (!targetPath) continue; // pure anchor link within same file

      const resolvedPath = resolve(dirname(filePath), targetPath);
      const exists = await fileExists(resolvedPath);

      if (!exists) {
        const line = getLineNumber(content, link.index);
        errors.push(
          `${rel}:${line}: broken link [${link.text}](${link.target})`
        );
      }
    }
  }

  if (errors.length > 0) {
    console.error("Broken internal links:");
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  } else {
    console.log("Internal links: all links resolve correctly.");
  }
}

main();
