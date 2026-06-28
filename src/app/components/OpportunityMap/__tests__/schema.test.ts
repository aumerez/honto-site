import { describe, it, expect } from "vitest";
import {
  EMPTY_BUSINESS,
  EMPTY_COMPANY,
  EMPTY_CONTACT,
  EMPTY_PROCESS,
  EMPTY_SUBMISSION,
  EMPTY_TEAM,
  EMPTY_TECH_STACK,
  SECTIONS,
  isBusinessComplete,
  isCompanyProfileComplete,
  isContactComplete,
  isProcessComplete,
  isSkippableSection,
  isTeamComplete,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  validateContact,
  type ContactInfo,
  type OpportunityInsights,
  type OpportunityReport,
  type ScoreResult,
  type Section,
} from "../schema";

describe("OpportunityMap schema", () => {
  it("defines the full 10-state flow", () => {
    const first: Section = SECTIONS[0];
    expect(first).toBe("LANDING");
    expect(SECTIONS).toHaveLength(10);
    expect(SECTIONS).toContain("TEASER_RESULT");
    expect(SECTIONS).toContain("CONTACT_GATE");
    expect(SECTIONS).toContain("SALES_CTA");
  });

  it("provides an empty tech-stack default for the optional section", () => {
    expect(EMPTY_TECH_STACK.crm).toEqual([]);
    expect(EMPTY_TECH_STACK.deploymentModel).toBe("");
  });

  it("marks the tech stack section as skippable", () => {
    expect(isSkippableSection("SYSTEM_LANDSCAPE")).toBe(true);
    expect(isSkippableSection("CONTACT_GATE")).toBe(false);
  });

  describe("field validators", () => {
    it("accepts valid emails and rejects malformed ones", () => {
      expect(isValidEmail("ceo@acme.com")).toBe(true);
      expect(isValidEmail("not-an-email")).toBe(false);
      expect(isValidEmail("a@b")).toBe(false);
    });

    it("validates normal public company URLs", () => {
      expect(isValidUrl("https://acme.com")).toBe(true);
      expect(isValidUrl("http://www.acme.co.uk/about")).toBe(true);
      expect(isValidUrl("acme.com")).toBe(false);
      expect(isValidUrl("javascript:alert(1)")).toBe(false);
    });

    it("validates digit-only phone numbers", () => {
      expect(isValidPhone("5551234567")).toBe(true);
      expect(isValidPhone("+1 555 123")).toBe(false);
    });
  });

  describe("validateContact", () => {
    const valid: ContactInfo = {
      contactName: "Dana Lee",
      email: "dana@acme.com",
      role: "founderExec",
      company: "Acme",
      phone: "",
      companyLinkedin: "",
      consent: true,
    };

    it("passes a complete, valid contact", () => {
      expect(validateContact(valid).ok).toBe(true);
      expect(isContactComplete(valid)).toBe(true);
    });

    it("rejects an invalid email", () => {
      const r = validateContact({ ...valid, email: "nope" });
      expect(r.ok).toBe(false);
      expect(r.errors.email).toBe("invalid");
    });

    it("requires name, company, role, and consent", () => {
      const r = validateContact(EMPTY_CONTACT);
      expect(r.ok).toBe(false);
      expect(r.errors.contactName).toBe("required");
      expect(r.errors.company).toBe("required");
      expect(r.errors.role).toBe("required");
      expect(r.errors.consent).toBe("required");
    });

    it("rejects a malformed phone and a non-URL company LinkedIn", () => {
      const r = validateContact({
        ...valid,
        phone: "abc",
        companyLinkedin: "linkedin",
      });
      expect(r.ok).toBe(false);
      expect(r.errors.phone).toBe("invalid");
      expect(r.errors.companyLinkedin).toBe("invalid");
    });
  });

  describe("section completion", () => {
    it("treats empty diagnostic answers as incomplete", () => {
      expect(isCompanyProfileComplete(EMPTY_COMPANY)).toBe(false);
      expect(isBusinessComplete(EMPTY_BUSINESS)).toBe(false);
      expect(isProcessComplete(EMPTY_PROCESS)).toBe(false);
      expect(isTeamComplete(EMPTY_TEAM)).toBe(false);
    });

    it("recognizes complete sections", () => {
      expect(
        isCompanyProfileComplete({
          companyName: "Acme",
          website: "",
          industry: "tech",
          companySize: "51-200",
          stage: "scaling",
          mainPressure: "growth",
        })
      ).toBe(true);
      expect(
        isBusinessComplete({
          priorityOutcomes: ["growth"],
          urgentArea: "sales",
          timeframe: "asap",
        })
      ).toBe(true);
      expect(
        isProcessComplete({ ...EMPTY_PROCESS, manualWorkLevel: "4" })
      ).toBe(true);
      expect(
        isTeamComplete({ ...EMPTY_TEAM, overloadedFunctions: ["operations"] })
      ).toBe(true);
    });
  });

  describe("result type contracts", () => {
    it("describes a well-formed ScoreResult / insights / report", () => {
      const score: ScoreResult = {
        signal: 62,
        signalBand: "strong",
        complexity: "structured",
        complexityConfidence: "estimated",
        factors: ["high manual work"],
      };
      const insights: OpportunityInsights = {
        items: [
          { key: "procAutomateManual", pillar: "PROCESS_DRAG", impact: "high" },
        ],
      };
      const report: OpportunityReport = {
        cards: [
          {
            code: "[02]",
            titleKey: "signal",
            impact: "high",
            actionKey: "act",
          },
        ],
        firstMoves: ["Automate reporting"],
        thirtyDayPlan: ["Week 1: discovery"],
      };
      expect(score.signal).toBe(62);
      expect(insights.items[0].pillar).toBe("PROCESS_DRAG");
      expect(report.cards).toHaveLength(1);
      // The submission model defaults to a skipped tech stack.
      expect(EMPTY_SUBMISSION.techStack).toBeNull();
      expect(EMPTY_SUBMISSION.techSkipped).toBe(false);
    });
  });
});
