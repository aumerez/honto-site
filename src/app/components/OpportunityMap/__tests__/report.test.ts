import { describe, it, expect } from "vitest";
import {
  EMPTY_SUBMISSION,
  EMPTY_TECH_STACK,
  type OpportunityMapSubmission,
} from "../schema";
import { generateReport } from "../report";

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

function richSubmission(): OpportunityMapSubmission {
  const s = clone(EMPTY_SUBMISSION);
  s.company = {
    companyName: "Acme",
    website: "",
    industry: "tech",
    companySize: "201-1000",
    stage: "scaling",
    mainPressure: "efficiency",
  };
  s.business = {
    priorityOutcomes: ["cost", "speed"],
    urgentArea: "operations",
    timeframe: "asap",
  };
  s.process = {
    ...s.process,
    manualWorkLevel: "5",
    repetitiveWorkflows: ["dataEntry"],
    dataCopyPaste: "constant",
  };
  s.team = { ...s.team, overloadedFunctions: ["operations", "finance"] };
  s.techStack = {
    ...EMPTY_TECH_STACK,
    crm: ["salesforce"],
    integrationReadiness: "low",
    dataReadiness: "messy",
  };
  s.techSkipped = false;
  return s;
}

describe("report generation", () => {
  it("is deterministic", () => {
    const s = richSubmission();
    expect(JSON.stringify(generateReport(s))).toBe(
      JSON.stringify(generateReport(s))
    );
  });

  it("returns exactly three first moves", () => {
    expect(generateReport(richSubmission()).firstMoves).toHaveLength(3);
  });

  it("pads to three first moves even with an empty submission", () => {
    expect(generateReport(EMPTY_SUBMISSION).firstMoves).toHaveLength(3);
  });

  it("produces a four-week operating plan", () => {
    const plan = generateReport(richSubmission()).thirtyDayPlan;
    expect(plan).toHaveLength(4);
    plan.forEach((w) => {
      expect(w.focus.length).toBeGreaterThan(0);
      expect(w.detail.length).toBeGreaterThan(0);
    });
  });

  it("includes a sales angle and a demo scenario", () => {
    const r = generateReport(richSubmission());
    expect(r.salesAngle.length).toBeGreaterThan(0);
    expect(r.demoScenario.length).toBeGreaterThan(0);
    expect(r.salesAngle).toContain("Acme");
  });

  it("only ever uses Simple / Structured / Advanced complexity", () => {
    const r = generateReport(richSubmission());
    expect(["simple", "structured", "advanced"]).toContain(r.complexity.band);
    expect(r.complexity.estimatedFirstPhase).not.toMatch(/medium/i);
  });

  it("still produces a valid, lighter report when tech is skipped", () => {
    const s = richSubmission();
    s.techStack = null;
    s.techSkipped = true;
    const r = generateReport(s);
    expect(r.techSkipped).toBe(true);
    expect(r.complexity.confidence).toBe("approximate");
    expect(r.insights.systemReadiness.confidence).toBe("approximate");
    expect(r.firstMoves).toHaveLength(3);
    expect(r.thirtyDayPlan).toHaveLength(4);
  });
});
