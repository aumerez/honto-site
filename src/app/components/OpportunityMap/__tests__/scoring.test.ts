import { describe, it, expect } from "vitest";
import {
  EMPTY_SUBMISSION,
  EMPTY_TECH_STACK,
  type OpportunityMapSubmission,
  type TechStackAnswers,
} from "../schema";
import {
  complexityBand,
  computeComplexity,
  computeScores,
  computeSignal,
  estimatedFirstPhase,
  signalBand,
} from "../scoring";

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

function withProcess(
  patch: Partial<OpportunityMapSubmission["process"]>
): OpportunityMapSubmission {
  const s = clone(EMPTY_SUBMISSION);
  s.process = { ...s.process, ...patch };
  return s;
}

function withTech(patch: Partial<TechStackAnswers>): OpportunityMapSubmission {
  const s = clone(EMPTY_SUBMISSION);
  s.techStack = { ...EMPTY_TECH_STACK, ...patch };
  s.techSkipped = false;
  return s;
}

const sumPts = (factors: { points: number }[]) =>
  factors.reduce((t, f) => t + f.points, 0);

describe("scoring — AI Opportunity Signal", () => {
  it("maps band boundaries exactly", () => {
    expect(signalBand(0)).toBe("low");
    expect(signalBand(25)).toBe("low");
    expect(signalBand(26)).toBe("moderate");
    expect(signalBand(50)).toBe("moderate");
    expect(signalBand(51)).toBe("strong");
    expect(signalBand(75)).toBe("strong");
    expect(signalBand(76)).toBe("veryHigh");
    expect(signalBand(100)).toBe("veryHigh");
  });

  it("is deterministic", () => {
    const s = withProcess({ manualWorkLevel: "4" });
    expect(JSON.stringify(computeSignal(s))).toBe(
      JSON.stringify(computeSignal(s))
    );
  });

  it("increases with higher manual workload", () => {
    expect(
      computeSignal(withProcess({ manualWorkLevel: "5" })).score
    ).toBeGreaterThan(
      computeSignal(withProcess({ manualWorkLevel: "1" })).score
    );
  });

  it("increases with higher integration pain", () => {
    const painful = computeSignal(withTech({ integrationReadiness: "low" }));
    const smooth = computeSignal(withTech({ integrationReadiness: "high" }));
    expect(painful.score).toBeGreaterThan(smooth.score);
  });

  it("returns traceable, non-empty factors with an explanation", () => {
    const s = withTech({ integrationReadiness: "low", dataReadiness: "messy" });
    s.process.manualWorkLevel = "5";
    s.business.timeframe = "asap";
    const result = computeSignal(s);
    expect(result.factors.length).toBeGreaterThan(0);
    result.factors.forEach((f) => expect(f.points).toBeGreaterThan(0));
    expect(result.explanation.length).toBeGreaterThan(0);
  });
});

describe("scoring — Implementation Complexity", () => {
  it("maps band boundaries exactly", () => {
    expect(complexityBand(0)).toBe("simple");
    expect(complexityBand(33)).toBe("simple");
    expect(complexityBand(34)).toBe("structured");
    expect(complexityBand(66)).toBe("structured");
    expect(complexityBand(67)).toBe("advanced");
    expect(complexityBand(100)).toBe("advanced");
  });

  it("maps each band to an estimated first phase (never 'Medium')", () => {
    expect(estimatedFirstPhase("simple")).toBe("1–3 weeks");
    expect(estimatedFirstPhase("structured")).toBe("3–6 weeks");
    expect(estimatedFirstPhase("advanced")).toBe("6–12+ weeks");
  });

  it("rises with more systems, custom apps, and security burden", () => {
    const light = computeComplexity(
      withTech({
        crm: ["hubspot"],
        apiAvailability: "most",
        dataReadiness: "clean",
        integrationReadiness: "high",
        deploymentModel: "cloud",
      })
    );
    const heavy = computeComplexity(
      withTech({
        crm: ["salesforce", "hubspot"],
        erp: ["sap", "netsuite"],
        databases: ["oracle", "sqlserver", "postgres"],
        customApps: ["internalTools", "customerPortal", "dataPipelines"],
        apiAvailability: "none",
        securityRequirements: ["hipaa", "pci", "soc2"],
        dataReadiness: "messy",
        integrationReadiness: "low",
        deploymentModel: "onPrem",
      })
    );
    expect(light.band).toBe("simple");
    expect(heavy.band).toBe("advanced");
    expect(sumPts(heavy.reasons)).toBeGreaterThan(sumPts(light.reasons));
    expect(heavy.confidence).toBe("estimated");
  });

  it("falls back to a lighter, approximate estimate when tech is skipped", () => {
    const skipped = clone(EMPTY_SUBMISSION);
    skipped.techStack = null;
    skipped.techSkipped = true;
    skipped.company.companySize = "1000+";
    const result = computeComplexity(skipped);
    expect(result.confidence).toBe("approximate");
    expect(["simple", "structured", "advanced"]).toContain(result.band);
    expect(result.estimatedFirstPhase.length).toBeGreaterThan(0);
  });

  it("computeScores bundles signal and complexity", () => {
    const r = computeScores(EMPTY_SUBMISSION);
    expect(r.signal).toBeDefined();
    expect(r.complexity).toBeDefined();
    expect(["simple", "structured", "advanced"]).toContain(r.complexity.band);
  });
});
