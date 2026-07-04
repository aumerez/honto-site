/**
 * Honto AI Readiness Map — deterministic scoring.
 *
 * Two independent scores:
 *   • AI Opportunity Signal (0–100) — how much leverage Honto can create.
 *     Higher = more opportunity, NOT a "better" company.
 *   • Implementation Complexity — difficulty, expressed as Simple / Structured /
 *     Advanced (never "Medium").
 *
 * Every score is a pure function of the answers (no Date, no Math.random) and
 * returns its contributing factors so the result is fully traceable.
 */

import type {
  ComplexityBand,
  ComplexityResult,
  OpportunityMapSubmission,
  ScoreFactor,
  ScoreResult,
  SignalBand,
  SignalResult,
} from "./schema";

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function factor(key: string, label: string, points: number): ScoreFactor {
  return { key, label, points };
}

function sum(factors: ScoreFactor[]): number {
  return factors.reduce((t, f) => t + f.points, 0);
}

/** Non-zero contributors, highest first (stable). */
function activeFactors(factors: ScoreFactor[]): ScoreFactor[] {
  return factors
    .filter((f) => f.points > 0)
    .sort((a, b) => b.points - a.points || a.key.localeCompare(b.key));
}

/* ── AI Opportunity Signal ───────────────────────────────────────────── */

const MANUAL_POINTS: Record<string, number> = {
  "1": 0,
  "2": 5,
  "3": 10,
  "4": 15,
  "5": 20,
};
const URGENCY_POINTS: Record<string, number> = {
  asap: 15,
  "1-3mo": 11,
  "3-6mo": 7,
  "6-12mo": 3,
  exploring: 0,
};
const STAGE_POINTS: Record<string, number> = {
  transforming: 8,
  scaling: 6,
  established: 5,
  startup: 3,
};
const SIZE_POINTS: Record<string, number> = {
  "1-10": 2,
  "11-50": 4,
  "51-200": 6,
  "201-1000": 8,
  "1000+": 10,
};

function integrationPainPoints(s: OpportunityMapSubmission): number {
  if (s.techStack) {
    switch (s.techStack.integrationReadiness) {
      case "low":
        return 15;
      case "medium":
        return 8;
      case "dontKnow":
        return 8;
      default:
        return 0;
    }
  }
  // Fallback when tech is skipped: manual data movement is the proxy.
  switch (s.process.dataCopyPaste) {
    case "constant":
      return 15;
    case "often":
      return 10;
    case "sometimes":
      return 5;
    default:
      return 0;
  }
}

function dataFragmentationPoints(s: OpportunityMapSubmission): number {
  if (s.techStack) {
    switch (s.techStack.dataReadiness) {
      case "messy":
        return 12;
      case "mixed":
        return 6;
      case "dontKnow":
        return 6;
      default:
        return 0;
    }
  }
  switch (s.process.commFragmentation) {
    case "high":
      return 12;
    case "medium":
      return 6;
    default:
      return 0;
  }
}

export function signalBand(score: number): SignalBand {
  if (score <= 25) return "low";
  if (score <= 50) return "moderate";
  if (score <= 75) return "strong";
  return "veryHigh";
}

const SIGNAL_BAND_LABEL: Record<SignalBand, string> = {
  low: "Low immediate signal",
  moderate: "Moderate signal",
  strong: "Strong signal",
  veryHigh: "Very high signal",
};

export function signalBandLabel(band: SignalBand): string {
  return SIGNAL_BAND_LABEL[band];
}

export function computeSignal(s: OpportunityMapSubmission): SignalResult {
  const factors: ScoreFactor[] = [
    factor(
      "manualWork",
      "Heavy manual, repetitive workload",
      MANUAL_POINTS[s.process.manualWorkLevel] ?? 0
    ),
    factor("integrationPain", "Disconnected systems", integrationPainPoints(s)),
    factor("dataFragmentation", "Fragmented data", dataFragmentationPoints(s)),
    factor(
      "urgency",
      "Urgent timeframe",
      URGENCY_POINTS[s.business.timeframe] ?? 0
    ),
    factor(
      "adoptionReadiness",
      "Stage primed for change",
      STAGE_POINTS[s.company.stage] ?? 0
    ),
    factor(
      "companySize",
      "Organization scale",
      SIZE_POINTS[s.company.companySize] ?? 0
    ),
    factor(
      "overloadedAreas",
      "Multiple overloaded functions",
      Math.min(s.team.overloadedFunctions.length * 4, 10)
    ),
    factor(
      "highValueGoals",
      "Several high-value goals",
      Math.min(s.business.priorityOutcomes.length * 3, 10)
    ),
  ];

  const score = clamp(sum(factors));
  const band = signalBand(score);
  const top = activeFactors(factors).slice(0, 3);
  const explanation =
    top.length > 0
      ? `${SIGNAL_BAND_LABEL[band]}, driven by ${top
          .map((f) => f.label.toLowerCase())
          .join(", ")}.`
      : `${SIGNAL_BAND_LABEL[band]} — limited signal from the answers provided.`;

  return { score, band, explanation, factors: activeFactors(factors) };
}

/* ── Implementation Complexity ───────────────────────────────────────── */

const ENTERPRISE_SYSTEMS = new Set([
  "sap",
  "netsuite",
  "dynamics",
  "oracle",
  "okta",
  "entra",
  "sqlserver",
]);
const SECURITY_POINTS: Record<string, number> = {
  hipaa: 5,
  pci: 5,
  soc2: 3,
  gdpr: 2,
  internal: 1,
  none: 0,
};
const API_POINTS: Record<string, number> = {
  most: 0,
  some: 6,
  few: 12,
  none: 15,
  dontKnow: 10,
};
const SKIP_SIZE_POINTS: Record<string, number> = {
  "1-10": 15,
  "11-50": 30,
  "51-200": 45,
  "201-1000": 60,
  "1000+": 75,
};

export function complexityBand(score: number): ComplexityBand {
  if (score <= 33) return "simple";
  if (score <= 66) return "structured";
  return "advanced";
}

const PHASE_FOR_BAND: Record<ComplexityBand, string> = {
  simple: "1–3 weeks",
  structured: "3–6 weeks",
  advanced: "6–12+ weeks",
};

export function estimatedFirstPhase(band: ComplexityBand): string {
  return PHASE_FOR_BAND[band];
}

export function computeComplexity(
  s: OpportunityMapSubmission
): ComplexityResult {
  if (!s.techStack) {
    // Lighter, clearly-marked estimate from organization scale.
    const reasons: ScoreFactor[] = activeFactors([
      factor(
        "techSkipped",
        "System landscape not provided — estimate from company size",
        SKIP_SIZE_POINTS[s.company.companySize] ?? 30
      ),
    ]);
    const score = clamp(sum(reasons));
    const band = complexityBand(score);
    return {
      band,
      estimatedFirstPhase: estimatedFirstPhase(band),
      confidence: "approximate",
      reasons,
    };
  }

  const t = s.techStack;
  const systemCount = (
    [
      t.crm,
      t.erp,
      t.warehouse,
      t.comms,
      t.ticketing,
      t.identity,
      t.productivity,
      t.databases,
    ] as string[][]
  )
    .flat()
    .filter((v) => v !== "none").length;
  const enterpriseCount = [
    ...t.crm,
    ...t.erp,
    ...t.warehouse,
    ...t.identity,
    ...t.databases,
  ].filter((v) => ENTERPRISE_SYSTEMS.has(v)).length;
  const customCount = t.customApps.filter((v) => v !== "none").length;
  const securityPoints = t.securityRequirements.reduce(
    (total, r) => total + (SECURITY_POINTS[r] ?? 0),
    0
  );

  const reasons: ScoreFactor[] = [
    factor(
      "systems",
      "Many systems to integrate",
      Math.min(systemCount * 3, 22)
    ),
    factor(
      "enterprise",
      "Enterprise systems in play",
      Math.min(enterpriseCount * 5, 13)
    ),
    factor("customApps", "Custom applications", Math.min(customCount * 4, 10)),
    factor(
      "api",
      "Limited API availability",
      API_POINTS[t.apiAvailability] ?? 8
    ),
    factor(
      "security",
      "Security / compliance requirements",
      Math.min(securityPoints, 12)
    ),
    factor(
      "dataQuality",
      "Data quality work needed",
      t.dataReadiness === "messy"
        ? 10
        : t.dataReadiness === "mixed"
          ? 5
          : t.dataReadiness === "dontKnow"
            ? 6
            : t.dataReadiness === ""
              ? 5
              : 0
    ),
    factor(
      "integration",
      "Integration groundwork",
      t.integrationReadiness === "low"
        ? 10
        : t.integrationReadiness === "medium"
          ? 5
          : t.integrationReadiness === "dontKnow"
            ? 6
            : t.integrationReadiness === ""
              ? 5
              : 0
    ),
    factor(
      "deployment",
      "On-premise / regulated environment",
      t.deploymentModel === "onPrem" || t.deploymentModel === "regulated"
        ? 8
        : t.deploymentModel === "hybrid"
          ? 4
          : t.deploymentModel === ""
            ? 2
            : 0
    ),
  ];

  const score = clamp(sum(reasons));
  const band = complexityBand(score);
  return {
    band,
    estimatedFirstPhase: estimatedFirstPhase(band),
    confidence: "estimated",
    reasons: activeFactors(reasons),
  };
}

export function computeScores(s: OpportunityMapSubmission): ScoreResult {
  return { signal: computeSignal(s), complexity: computeComplexity(s) };
}
