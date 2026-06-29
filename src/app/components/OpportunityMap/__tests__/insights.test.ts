import { describe, it, expect } from "vitest";
import {
  EMPTY_SUBMISSION,
  EMPTY_TECH_STACK,
  type OpportunityMapSubmission,
} from "../schema";
import { generateInsights } from "../insights";

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
    priorityOutcomes: ["cost", "speed", "visibility"],
    urgentArea: "operations",
    timeframe: "asap",
  };
  s.process = {
    manualWorkLevel: "5",
    repetitiveWorkflows: ["dataEntry", "reporting"],
    approvalBottlenecks: "severe",
    reportingPain: "4",
    dataCopyPaste: "constant",
    commFragmentation: "high",
  };
  s.team = {
    overloadedFunctions: ["operations", "finance", "support"],
    knowledgeConcentration: ["finance"],
    decisionBottlenecks: "frequent",
    knowledgeRisk: "5",
    handoffIssues: "often",
  };
  s.techStack = {
    ...EMPTY_TECH_STACK,
    crm: ["salesforce"],
    integrationReadiness: "low",
    dataReadiness: "messy",
    apiAvailability: "few",
    securityRequirements: ["soc2"],
  };
  s.techSkipped = false;
  return s;
}

describe("insights generation", () => {
  it("produces all four maps with answer-driven content", () => {
    const i = generateInsights(richSubmission());
    expect(i.businessLeverage.length).toBeGreaterThan(0);
    expect(i.processDrag.length).toBeGreaterThan(0);
    expect(i.expertLeverage.length).toBeGreaterThan(0);
    expect(i.systemReadiness.items.length).toBeGreaterThan(0);
  });

  it("reflects specific answers, not generic filler", () => {
    const i = generateInsights(richSubmission());
    expect(i.processDrag.some((x) => x.key === "manualWork")).toBe(true);
    expect(i.processDrag.some((x) => x.key === "dataCopyPaste")).toBe(true);
    expect(i.expertLeverage.some((x) => x.key === "overloaded")).toBe(true);
    expect(i.systemReadiness.items.some((x) => x.key === "siloed")).toBe(true);
  });

  it("gives every insight a suggested Honto action", () => {
    const i = generateInsights(richSubmission());
    const all = [
      ...i.businessLeverage,
      ...i.processDrag,
      ...i.expertLeverage,
      ...i.systemReadiness.items,
    ];
    all.forEach((item) => {
      expect(item.action.length).toBeGreaterThan(0);
      expect(item.label.length).toBeGreaterThan(0);
    });
  });

  it("marks readiness as estimated when tech is provided", () => {
    expect(generateInsights(richSubmission()).systemReadiness.confidence).toBe(
      "estimated"
    );
  });

  it("returns a lighter, approximate readiness when tech is skipped", () => {
    const s = richSubmission();
    s.techStack = null;
    s.techSkipped = true;
    const readiness = generateInsights(s).systemReadiness;
    expect(readiness.confidence).toBe("approximate");
    expect(readiness.items.length).toBeGreaterThan(0);
  });
});
