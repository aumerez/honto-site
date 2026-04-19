import { SITE_URL } from "./site";
import type { Locale } from "./locales";

type JsonLd = Record<string, unknown>;

export function organizationSchema(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "honto",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "honto builds production-grade AI systems — agents, skills, RAG, and operational intelligence — grounded in your company's expertise, data, and decisions.",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Palo Alto",
        addressRegion: "CA",
        addressCountry: "US",
      },
    },
    email: "info@honto.ai",
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@honto.ai",
      contactType: "sales",
      availableLanguage: ["en", "es"],
    },
    sameAs: ["https://www.linkedin.com/company/honto-ai"],
  };
}

export function productSchema(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/${locale}/honto-ops#product`,
    name: "honto.ops",
    brand: { "@type": "Brand", name: "honto" },
    description:
      "honto.ops is the expert second brain for your teams — it watches your systems, reads your docs, and answers the questions your senior experts field fifty times a week, with citations and full audit trails.",
    url: `${SITE_URL}/${locale}/honto-ops`,
    category: "B2B SaaS / AI Operations Platform",
    manufacturer: { "@id": `${SITE_URL}/#organization` },
  };
}
