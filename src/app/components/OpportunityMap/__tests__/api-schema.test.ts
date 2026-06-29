import { describe, it, expect } from "vitest";
import { normalizeSubmission } from "../api-schema";
import { EMPTY_SUBMISSION, type OpportunityMapSubmission } from "../schema";

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

function valid(): OpportunityMapSubmission {
  const s = clone(EMPTY_SUBMISSION);
  s.company = {
    companyName: "Acme",
    website: "",
    industry: "tech",
    companySize: "51-200",
    stage: "scaling",
    mainPressure: "growth",
  };
  s.business = {
    priorityOutcomes: ["cost"],
    urgentArea: "operations",
    timeframe: "asap",
  };
  s.process = { ...s.process, manualWorkLevel: "4" };
  s.team = { ...s.team, overloadedFunctions: ["operations"] };
  s.contact = {
    contactName: "Dana",
    email: "dana@acme.com",
    role: "founderExec",
    company: "Acme",
    phone: "",
    companyLinkedin: "",
    consent: true,
  };
  return s;
}

describe("normalizeSubmission", () => {
  it("accepts a complete, valid submission", () => {
    const r = normalizeSubmission(valid());
    expect(r.ok).toBe(true);
  });

  it("rejects a non-object payload", () => {
    expect(normalizeSubmission(null).ok).toBe(false);
    expect(normalizeSubmission("x").ok).toBe(false);
  });

  it("rejects missing required contact and diagnostic fields", () => {
    const r = normalizeSubmission(EMPTY_SUBMISSION);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.issues.length).toBeGreaterThan(0);
  });

  it("rejects an invalid email", () => {
    const s = valid();
    s.contact.email = "nope";
    const r = normalizeSubmission(s);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.issues.some((i) => /valid email/i.test(i))).toBe(true);
  });

  it("rejects an invalid website when provided", () => {
    const s = valid();
    s.company.website = "ftp:bad";
    const r = normalizeSubmission(s);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.issues.some((i) => /website/i.test(i))).toBe(true);
  });

  it("rejects banned/private field names", () => {
    const cases = [
      { ...valid(), password: "x" },
      { ...valid(), apiKey: "x" },
      { ...valid(), credentials: { token: "x" } },
      (() => {
        const s = valid() as unknown as { contact: Record<string, unknown> };
        s.contact.employeeLinkedin = "https://linkedin.com/in/x";
        return s;
      })(),
    ];
    for (const c of cases) {
      const r = normalizeSubmission(c);
      expect(r.ok).toBe(false);
    }
  });

  it("strips unknown harmless fields", () => {
    const s = {
      ...valid(),
      trackingPixel: "abc",
      company: { ...valid().company, extra: 1 },
    };
    const r = normalizeSubmission(s);
    expect(r.ok).toBe(true);
    if (r.ok) {
      const serialized = JSON.stringify(r.submission);
      expect(serialized).not.toContain("trackingPixel");
      expect(serialized).not.toContain("extra");
    }
  });

  it("carries the company name onto the contact record", () => {
    const r = normalizeSubmission(valid());
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.submission.contact.company).toBe("Acme");
  });
});
