import { describe, it, expect } from "vitest";
import sitemap from "../sitemap";

describe("sitemap", () => {
  const entries = sitemap();

  it("includes the landing in both locales", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://honto.ai/en");
    expect(urls).toContain("https://honto.ai/es");
  });

  it("includes the honto.ops product page in both locales", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://honto.ai/en/honto-ops");
    expect(urls).toContain("https://honto.ai/es/honto-ops");
  });

  it("includes case study pages in both locales", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://honto.ai/en/case-studies/bulwark");
    expect(urls).toContain("https://honto.ai/es/case-studies/bulwark");
    expect(urls).toContain("https://honto.ai/en/case-studies/engram");
    expect(urls).toContain("https://honto.ai/es/case-studies/engram");
  });

  it("annotates each entry with hreflang alternates for every locale", () => {
    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual({
        en: expect.stringMatching(/^https:\/\/honto\.ai\/en/),
        es: expect.stringMatching(/^https:\/\/honto\.ai\/es/),
      });
    }
  });

  it("gives the default locale the highest priority", () => {
    const enLanding = entries.find((e) => e.url === "https://honto.ai/en");
    const esLanding = entries.find((e) => e.url === "https://honto.ai/es");
    expect(enLanding?.priority).toBeGreaterThan(esLanding?.priority ?? 0);
  });
});
