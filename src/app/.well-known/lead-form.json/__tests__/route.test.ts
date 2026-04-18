import { describe, it, expect } from "vitest";
import { GET } from "../route";
import { CONTACT_FIELDS } from "@/app/api/contact/descriptor";

describe("/.well-known/lead-form.json GET", () => {
  it("returns a JSON descriptor describing the contact form", async () => {
    const res = GET();
    expect(res.status).toBe(200);

    const body = (await res.json()) as {
      endpoint: { url: string; method: string };
      fields: Array<{ name: string; required: boolean; maxLength: number }>;
      humanUrl: { en: string; es: string };
    };

    expect(body.endpoint.method).toBe("POST");
    expect(body.endpoint.url).toMatch(/\/api\/contact$/);
    expect(body.humanUrl.en).toMatch(/\/en#contact$/);
    expect(body.humanUrl.es).toMatch(/\/es#contact$/);
  });

  it("mirrors the shared CONTACT_FIELDS definition", async () => {
    const res = GET();
    const body = (await res.json()) as {
      fields: Array<{ name: string; required: boolean; maxLength: number }>;
    };

    expect(body.fields.map((f) => f.name)).toEqual(
      CONTACT_FIELDS.map((f) => f.name)
    );
    for (let i = 0; i < CONTACT_FIELDS.length; i += 1) {
      expect(body.fields[i].required).toBe(CONTACT_FIELDS[i].required);
      expect(body.fields[i].maxLength).toBe(CONTACT_FIELDS[i].maxLength);
    }
  });

  it("sets a reasonable cache header", () => {
    const res = GET();
    const cacheControl = res.headers.get("cache-control") ?? "";
    expect(cacheControl).toContain("max-age");
    expect(cacheControl).toContain("public");
  });
});
