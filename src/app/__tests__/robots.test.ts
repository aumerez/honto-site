import { describe, it, expect } from "vitest";
import robots from "../robots";

describe("robots", () => {
  const result = robots();

  it("lists a dedicated rule for each major AI crawler", () => {
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const agents = rules.map((r) => r.userAgent as string);
    for (const bot of [
      "GPTBot",
      "ClaudeBot",
      "anthropic-ai",
      "PerplexityBot",
      "Googlebot",
      "Google-Extended",
      "Bingbot",
      "CCBot",
    ]) {
      expect(agents).toContain(bot);
    }
  });

  it("defaults unknown bots to disallowed", () => {
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules];
    const wildcard = rules.find((r) => r.userAgent === "*");
    expect(wildcard).toBeDefined();
    expect(wildcard?.disallow).toBe("/");
  });

  it("points to the sitemap", () => {
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
