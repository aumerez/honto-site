import { describe, it, expect } from "vitest";
import { EMPTY_SUBMISSION, type OpportunityMapSubmission } from "../schema";
import {
  canTransition,
  completedCount,
  flowPath,
  isFlowState,
  nextState,
  prevState,
  progressFor,
  sectionCompletion,
} from "../state";

describe("OpportunityMap flow state machine", () => {
  it("walks the full path in order", () => {
    expect(nextState("LANDING", false)).toBe("BUSINESS_CONTEXT");
    expect(nextState("BUSINESS_CONTEXT", false)).toBe("BUSINESS_GOALS");
    expect(nextState("EXPERT_LEVERAGE", false)).toBe("TEASER_RESULT");
    expect(nextState("TEASER_RESULT", false)).toBe("SYSTEM_LANDSCAPE");
    expect(nextState("SYSTEM_LANDSCAPE", false)).toBe("CONTACT_GATE");
    expect(nextState("CONTACT_GATE", false)).toBe("READINESS_REPORT");
    expect(nextState("READINESS_REPORT", false)).toBe("SALES_CTA");
    expect(nextState("SALES_CTA", false)).toBeNull();
  });

  it("walks backward and stops at LANDING", () => {
    expect(prevState("BUSINESS_CONTEXT", false)).toBe("LANDING");
    expect(prevState("LANDING", false)).toBeNull();
  });

  it("omits SYSTEM_LANDSCAPE from the path when tech is skipped", () => {
    expect(flowPath(true)).not.toContain("SYSTEM_LANDSCAPE");
    expect(flowPath(false)).toContain("SYSTEM_LANDSCAPE");
    expect(nextState("TEASER_RESULT", true)).toBe("CONTACT_GATE");
    expect(prevState("CONTACT_GATE", true)).toBe("TEASER_RESULT");
    expect(prevState("CONTACT_GATE", false)).toBe("SYSTEM_LANDSCAPE");
  });

  it("only allows adjacent transitions (and reset to LANDING)", () => {
    expect(canTransition("BUSINESS_CONTEXT", "BUSINESS_GOALS", false)).toBe(
      true
    );
    expect(canTransition("BUSINESS_GOALS", "BUSINESS_CONTEXT", false)).toBe(
      true
    );
    expect(canTransition("BUSINESS_CONTEXT", "CONTACT_GATE", false)).toBe(
      false
    );
    expect(canTransition("CONTACT_GATE", "LANDING", false)).toBe(true);
  });

  it("computes monotonic progress from 0 to 100", () => {
    expect(progressFor("LANDING", false)).toBe(0);
    expect(progressFor("SALES_CTA", false)).toBe(100);
    expect(progressFor("BUSINESS_CONTEXT", false)).toBeGreaterThan(0);
    expect(progressFor("BUSINESS_CONTEXT", false)).toBeLessThan(
      progressFor("CONTACT_GATE", false)
    );
  });

  it("validates flow-state strings", () => {
    expect(isFlowState("CONTACT_GATE")).toBe(true);
    expect(isFlowState("NONSENSE")).toBe(false);
    expect(isFlowState(42)).toBe(false);
  });

  describe("section completion", () => {
    it("reports an empty submission as incomplete", () => {
      const c = sectionCompletion(EMPTY_SUBMISSION);
      expect(c.BUSINESS_CONTEXT).toBe(false);
      expect(c.SYSTEM_LANDSCAPE).toBe(false);
      expect(completedCount(EMPTY_SUBMISSION)).toBe(0);
    });

    it("treats a skipped tech section as resolved", () => {
      const skipped: OpportunityMapSubmission = {
        ...EMPTY_SUBMISSION,
        techSkipped: true,
      };
      expect(sectionCompletion(skipped).SYSTEM_LANDSCAPE).toBe(true);
    });

    it("counts completed question sections", () => {
      const filled: OpportunityMapSubmission = {
        ...EMPTY_SUBMISSION,
        company: {
          companyName: "Acme",
          website: "",
          industry: "tech",
          companySize: "51-200",
          stage: "scaling",
          mainPressure: "growth",
        },
        process: { ...EMPTY_SUBMISSION.process, manualWorkLevel: "4" },
      };
      expect(sectionCompletion(filled).BUSINESS_CONTEXT).toBe(true);
      expect(completedCount(filled)).toBe(2);
    });
  });
});
