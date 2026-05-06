import { type Answers, SYSTEM_CATEGORIES, type SystemCategory } from "./schema";

export const DIMENSIONS = [
  "systems",
  "dataReadiness",
  "aiUsage",
  "governance",
  "talent",
] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_WEIGHTS: Record<Dimension, number> = {
  systems: 20,
  dataReadiness: 25,
  aiUsage: 25,
  governance: 15,
  talent: 15,
};

export const BANDS = [
  "foundational",
  "emerging",
  "operational",
  "advanced",
] as const;
export type Band = (typeof BANDS)[number];

type ScoreResult = {
  total: number;
  band: Band;
  dimensions: Record<Dimension, number>;
};

export const SIZES = ["S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number];

type SizingReason =
  | "manySystems"
  | "manyCustomApps"
  | "fragmentedData"
  | "undocumented"
  | "compliance"
  | "noTalent";

type SizingResult = {
  weeks: number;
  weeksMin: number;
  weeksMax: number | null;
  size: Size;
  reasons: SizingReason[];
};

const MODERN_CRM = new Set([
  "salesforce",
  "hubspot",
  "pipedrive",
  "zoho",
  "dynamics",
]);
const MODERN_ERP = new Set([
  "sap",
  "netsuite",
  "dynamics",
  "quickbooks",
  "xero",
]);
const MODERN_WAREHOUSE = new Set([
  "snowflake",
  "bigquery",
  "redshift",
  "databricks",
]);
const MODERN_IDENTITY = new Set(["okta", "entra", "googleWorkspace", "auth0"]);

function categoryScore(
  selections: string[],
  modernSet: Set<string>,
  ifModern: number,
  ifOther: number
): number {
  if (!selections.length) return 0;
  if (selections.some((v) => modernSet.has(v))) return ifModern;
  if (selections.includes("other")) return ifOther;
  return 0;
}

export function scoreSystems(answers: Answers): number {
  const s = answers.step2;
  let score = 0;
  score += categoryScore(s.crm, MODERN_CRM, 4, 2);
  score += categoryScore(s.erp, MODERN_ERP, 4, 2);
  // warehouse: postgres alone counts as legacy/0; modern warehouse is 5
  score += categoryScore(s.warehouse, MODERN_WAREHOUSE, 5, 2);
  score += categoryScore(s.identity, MODERN_IDENTITY, 4, 2);

  switch (answers.step3.integrated) {
    case "yes":
      score += 3;
      break;
    case "some":
      score += 1;
      break;
    default:
      break;
  }

  return score;
}

export function scoreDataReadiness(answers: Answers): number {
  const d = answers.step3;
  let score = 0;

  switch (d.dataLocation) {
    case "warehouse":
      score += 8;
      break;
    case "saas":
      score += 4;
      break;
    case "spreadsheets":
      score += 2;
      break;
    default:
      break;
  }

  if (d.dataVolume && d.dataVolume !== "dontKnow") score += 4;

  switch (d.documented) {
    case "yes":
      score += 8;
      break;
    case "partial":
      score += 5;
      break;
    case "no":
      score += 2;
      break;
    default:
      break;
  }

  switch (d.integrated) {
    case "yes":
      score += 5;
      break;
    case "some":
      score += 3;
      break;
    case "no":
      score += 1;
      break;
    default:
      break;
  }

  return score;
}

export function scoreAIUsage(answers: Answers): number {
  const a = answers.step4;
  let score = 0;

  switch (a.currentUse) {
    case "individual":
      score += 4;
      break;
    case "pilots":
      score += 8;
      break;
    case "production":
      score += 12;
      break;
    default:
      break;
  }

  switch (a.priorProjects) {
    case "incomplete":
      score += 2;
      break;
    case "mixed":
      score += 5;
      break;
    case "production":
      score += 8;
      break;
    default:
      break;
  }

  switch (a.llmFamiliarity) {
    case "low":
      score += 1;
      break;
    case "medium":
      score += 3;
      break;
    case "high":
      score += 5;
      break;
    default:
      break;
  }

  return score;
}

export function scoreGovernance(answers: Answers): number {
  const a = answers.step4;
  let score = 0;

  switch (a.governance) {
    case "informal":
      score += 3;
      break;
    case "written":
      score += 6;
      break;
    case "formal":
      score += 9;
      break;
    default:
      break;
  }

  if (a.privacy.length > 0) score += 6;

  return score;
}

export function scoreTalent(answers: Answers): number {
  switch (answers.step4.talent) {
    case "one":
      return 5;
    case "small":
      return 10;
    case "dedicated":
      return 15;
    default:
      return 0;
  }
}

export function bandFor(total: number): Band {
  if (total <= 25) return "foundational";
  if (total <= 50) return "emerging";
  if (total <= 75) return "operational";
  return "advanced";
}

export function computeScore(answers: Answers): ScoreResult {
  const dimensions: Record<Dimension, number> = {
    systems: scoreSystems(answers),
    dataReadiness: scoreDataReadiness(answers),
    aiUsage: scoreAIUsage(answers),
    governance: scoreGovernance(answers),
    talent: scoreTalent(answers),
  };
  const total =
    dimensions.systems +
    dimensions.dataReadiness +
    dimensions.aiUsage +
    dimensions.governance +
    dimensions.talent;

  return { total, band: bandFor(total), dimensions };
}

function countActiveSystemCategories(answers: Answers): number {
  return SYSTEM_CATEGORIES.reduce((count, cat: SystemCategory) => {
    const selections = answers.step2[cat];
    const hasReal = selections.some((v) => v !== "none");
    return hasReal ? count + 1 : count;
  }, 0);
}

export function sizeFor(weeks: number): Size {
  if (weeks <= 6) return "S";
  if (weeks <= 10) return "M";
  if (weeks <= 16) return "L";
  return "XL";
}

const SIZE_RANGES: Record<Size, [number, number | null]> = {
  S: [4, 6],
  M: [6, 10],
  L: [10, 16],
  XL: [16, null],
};

const HIGH_STAKES_COMPLIANCE = new Set(["hipaa", "pci", "soc2"]);

export function computeSizing(answers: Answers): SizingResult {
  let weeks = 4;
  const reasons: SizingReason[] = [];

  const activeCategories = countActiveSystemCategories(answers);
  if (activeCategories > 3) {
    weeks += activeCategories - 3;
    reasons.push("manySystems");
  }

  if (answers.step2.customApps === "11+") {
    weeks += 2;
    reasons.push("manyCustomApps");
  }

  if (
    answers.step3.dataLocation === "saas" ||
    answers.step3.dataLocation === "spreadsheets"
  ) {
    weeks += 2;
    reasons.push("fragmentedData");
  }

  if (
    answers.step3.documented === "no" ||
    answers.step3.documented === "dontKnow"
  ) {
    weeks += 2;
    reasons.push("undocumented");
  }

  const complianceHits = answers.step4.privacy.filter((p) =>
    HIGH_STAKES_COMPLIANCE.has(p)
  ).length;
  if (complianceHits > 0) {
    weeks += 2 * complianceHits;
    reasons.push("compliance");
  }

  if (answers.step4.talent === "none") {
    weeks += 1;
    reasons.push("noTalent");
  }

  const size = sizeFor(weeks);
  const [weeksMin, weeksMax] = SIZE_RANGES[size];

  return { weeks, weeksMin, weeksMax, size, reasons };
}

export type StrengthKey =
  | "modernSystems"
  | "dataReady"
  | "aiActive"
  | "governanceMature"
  | "talentInPlace";

export type GapKey =
  | "legacySystems"
  | "dataFragmented"
  | "aiNascent"
  | "noGovernance"
  | "noTalent";

type Narrative = {
  strengths: StrengthKey[];
  gaps: GapKey[];
};

const STRENGTH_THRESHOLDS: Array<[Dimension, number, StrengthKey]> = [
  ["systems", 0.75, "modernSystems"],
  ["dataReadiness", 0.7, "dataReady"],
  ["aiUsage", 0.6, "aiActive"],
  ["governance", 0.6, "governanceMature"],
  ["talent", 0.6, "talentInPlace"],
];

const GAP_THRESHOLDS: Array<[Dimension, number, GapKey]> = [
  ["systems", 0.3, "legacySystems"],
  ["dataReadiness", 0.3, "dataFragmented"],
  ["aiUsage", 0.2, "aiNascent"],
  ["governance", 0.3, "noGovernance"],
  ["talent", 0.3, "noTalent"],
];

export function computeNarrative(score: ScoreResult): Narrative {
  const ratios = (Object.keys(DIMENSION_WEIGHTS) as Dimension[]).map((d) => ({
    dim: d,
    ratio: score.dimensions[d] / DIMENSION_WEIGHTS[d],
  }));

  const sortedByRatioDesc = [...ratios].sort((a, b) => b.ratio - a.ratio);
  const sortedByRatioAsc = [...ratios].sort((a, b) => a.ratio - b.ratio);

  const strengths: StrengthKey[] = [];
  for (const { dim, ratio } of sortedByRatioDesc) {
    if (strengths.length >= 2) break;
    const match = STRENGTH_THRESHOLDS.find(
      ([d, threshold]) => d === dim && ratio >= threshold
    );
    if (match) strengths.push(match[2]);
  }

  const gaps: GapKey[] = [];
  for (const { dim, ratio } of sortedByRatioAsc) {
    if (gaps.length >= 2) break;
    const match = GAP_THRESHOLDS.find(
      ([d, threshold]) => d === dim && ratio < threshold
    );
    if (match) gaps.push(match[2]);
  }

  return { strengths, gaps };
}
