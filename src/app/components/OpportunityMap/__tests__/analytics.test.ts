import { describe, it, expect, vi, afterEach } from "vitest";
import { trackOpportunityMapEvent } from "../analytics";

const g = globalThis as { honto?: unknown };

afterEach(() => {
  delete g.honto;
});

describe("trackOpportunityMapEvent", () => {
  it("does not throw when no analytics provider is present", () => {
    delete g.honto;
    expect(() =>
      trackOpportunityMapEvent("opportunity_map_page_viewed", {
        section: "LANDING",
        locale: "en",
      })
    ).not.toThrow();
  });

  it("forwards only non-identifying metadata to a global sink", () => {
    const spy = vi.fn();
    g.honto = { track: spy };
    trackOpportunityMapEvent("contact_submitted", {
      section: "CONTACT_GATE",
      locale: "en",
      techSkipped: false,
      scoreBand: "strong",
      complexityBand: "structured",
    });

    expect(spy).toHaveBeenCalledTimes(1);
    const [event, meta] = spy.mock.calls[0] as [
      string,
      Record<string, unknown>,
    ];
    expect(event).toBe("contact_submitted");
    expect(Object.keys(meta).sort()).toEqual([
      "complexityBand",
      "locale",
      "scoreBand",
      "section",
      "techSkipped",
    ]);
    // No contact info or raw answers are ever forwarded.
    const serialized = JSON.stringify(meta).toLowerCase();
    for (const banned of [
      "email",
      "@",
      "phone",
      "contactname",
      "companyname",
    ]) {
      expect(serialized).not.toContain(banned);
    }
  });

  it("never throws even if the sink throws", () => {
    g.honto = {
      track: () => {
        throw new Error("boom");
      },
    };
    expect(() => trackOpportunityMapEvent("report_generated")).not.toThrow();
  });
});
