import { describe, it, expect } from "vitest";
import { organizationSchema, productSchema } from "../structuredData";

describe("organizationSchema", () => {
  it("returns a valid schema.org Organization", () => {
    const schema = organizationSchema("en");
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("honto");
    expect(schema.url).toMatch(/\/en$/);
  });

  it("switches the URL per locale", () => {
    const es = organizationSchema("es");
    expect(es.url).toMatch(/\/es$/);
    const pt = organizationSchema("pt");
    expect(pt.url).toMatch(/\/pt$/);
  });

  it("advertises all supported languages on the contact point", () => {
    const schema = organizationSchema("en");
    const cp = schema.contactPoint as { availableLanguage: string[] };
    expect(cp.availableLanguage).toEqual(["en", "es", "pt"]);
  });

  it("includes the LinkedIn page in sameAs", () => {
    const schema = organizationSchema("en");
    expect(schema.sameAs).toEqual([
      "https://www.linkedin.com/company/honto-ai",
    ]);
  });
});

describe("productSchema", () => {
  it("returns a valid schema.org Product for honto.ops", () => {
    const schema = productSchema("en");
    expect(schema["@type"]).toBe("Product");
    expect(schema.name).toBe("honto.ops");
    expect(schema.url).toMatch(/\/en\/honto-ops$/);
  });

  it("references the organization by @id", () => {
    const schema = productSchema("en");
    expect((schema.manufacturer as { "@id": string })["@id"]).toMatch(
      /#organization$/
    );
  });
});
