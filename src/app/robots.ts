import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Explicit bot allow-list. We name each agent deliberately rather than using
 * a blanket `User-agent: *` so that unknown / hostile crawlers must opt
 * themselves in by naming a User-agent we've approved.
 */
const ALLOWED_BOTS = [
  "Googlebot",
  "Google-Extended",
  "Bingbot",
  "DuckDuckBot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "CCBot",
  "Applebot",
  "Applebot-Extended",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
  "Bytespider",
  "YouBot",
];

const DISALLOWED_PATHS = ["/api/", "/_next/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...ALLOWED_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
        disallow: DISALLOWED_PATHS,
      })),
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
