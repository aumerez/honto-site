import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { locales, defaultLocale } from "@/lib/locales";

/**
 * Routes (excluding the locale prefix) that should appear in the sitemap.
 * Add new pages here when they ship.
 */
const ROUTES = [
  { path: "", changeFrequency: "monthly" as const, priority: 1 },
  { path: "/honto-ops", changeFrequency: "monthly" as const, priority: 0.9 },
  { path: "/case-studies", changeFrequency: "monthly" as const, priority: 0.8 },
  {
    path: "/case-studies/bulwark",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
  {
    path: "/case-studies/engram",
    changeFrequency: "monthly" as const,
    priority: 0.7,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority:
        locale === defaultLocale ? route.priority : route.priority * 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${route.path}`])
        ),
      },
    }))
  );
}
