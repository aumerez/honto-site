/**
 * Honto AI Readiness Map (internal: Opportunity Map) — diagnostic data model.
 *
 * Self-contained domain model for the V1 flow: enums, typed answer structures,
 * empty defaults, field limits, and typed validation helpers. No external
 * validation library is used (the repo convention is small custom validators,
 * mirroring api/contact + api/onboarding).
 *
 * Question definitions live in `questions.ts`; banned-data guards in
 * `privacy.ts`. This module is the dependency root — it imports neither, so the
 * three files form a clean acyclic graph (questions → schema, privacy → schema).
 *
 * Question/option copy is authored inline as source English; localized strings
 * live in the locale dictionaries.
 */

/* ── Flow sections (the full 10-state journey) ───────────────────────── */

export const SECTIONS = [
  "LANDING",
  "BUSINESS_CONTEXT",
  "BUSINESS_GOALS",
  "PROCESS_DRAG",
  "EXPERT_LEVERAGE",
  "TEASER_RESULT",
  "SYSTEM_LANDSCAPE",
  "CONTACT_GATE",
  "READINESS_REPORT",
  "SALES_CTA",
] as const;
export type Section = (typeof SECTIONS)[number];

/** Sections that actually collect input. */
export const QUESTION_SECTIONS = [
  "BUSINESS_CONTEXT",
  "BUSINESS_GOALS",
  "PROCESS_DRAG",
  "EXPERT_LEVERAGE",
  "SYSTEM_LANDSCAPE",
  "CONTACT_GATE",
] as const;
export type QuestionSection = (typeof QUESTION_SECTIONS)[number];

/** SYSTEM_LANDSCAPE (tech stack) is optional — the user may skip it. */
export const SKIPPABLE_SECTIONS: readonly QuestionSection[] = [
  "SYSTEM_LANDSCAPE",
];

export function isSkippableSection(section: QuestionSection): boolean {
  return SKIPPABLE_SECTIONS.includes(section);
}

/* ── Field types ─────────────────────────────────────────────────────── */

export const FIELD_TYPES = [
  "text",
  "textarea",
  "select",
  "multiselect",
  "scale",
  "checkbox",
  "url",
  "email",
] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export type QuestionOption = { value: string; label: string };

export type Question = {
  id: string;
  section: QuestionSection;
  type: FieldType;
  label: string;
  helper?: string;
  required: boolean;
  options?: readonly QuestionOption[];
  maxLength?: number;
  /** URL fields that must point to a public page (company site / public LinkedIn). */
  isPublic?: boolean;
};

/* ── Enums ───────────────────────────────────────────────────────────── */

export const INDUSTRIES = [
  "fintech",
  "healthcare",
  "retail",
  "manufacturing",
  "logistics",
  "tech",
  "services",
  "publicSector",
  "other",
] as const;
export type Industry = (typeof INDUSTRIES)[number];

export const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-1000",
  "1000+",
] as const;
export type CompanySize = (typeof COMPANY_SIZES)[number];

export const STAGES = [
  "startup",
  "scaling",
  "established",
  "transforming",
] as const;
export type Stage = (typeof STAGES)[number];

export const PRESSURES = [
  "growth",
  "margin",
  "competition",
  "retention",
  "efficiency",
  "compliance",
  "other",
] as const;
export type Pressure = (typeof PRESSURES)[number];

export const OUTCOMES = [
  "growth",
  "cost",
  "speed",
  "quality",
  "cx",
  "compliance",
  "visibility",
] as const;
export type Outcome = (typeof OUTCOMES)[number];

export const URGENT_AREAS = [
  "sales",
  "marketing",
  "operations",
  "finance",
  "support",
  "product",
  "data",
  "hr",
  "other",
] as const;
export type UrgentArea = (typeof URGENT_AREAS)[number];

export const TIMEFRAMES = [
  "asap",
  "1-3mo",
  "3-6mo",
  "6-12mo",
  "exploring",
] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

/** Shared 1–5 intensity scale (manual work, reporting pain, knowledge risk). */
export const SCALE_LEVELS = ["1", "2", "3", "4", "5"] as const;
export type ScaleLevel = (typeof SCALE_LEVELS)[number];

export const REPETITIVE_WORKFLOWS = [
  "dataEntry",
  "reporting",
  "scheduling",
  "invoicing",
  "onboarding",
  "reconciliation",
  "statusUpdates",
  "other",
] as const;
export type RepetitiveWorkflow = (typeof REPETITIVE_WORKFLOWS)[number];

export const APPROVAL_BOTTLENECKS = [
  "none",
  "minor",
  "frequent",
  "severe",
] as const;
export type ApprovalBottleneck = (typeof APPROVAL_BOTTLENECKS)[number];

export const DATA_COPY_FREQ = [
  "rare",
  "sometimes",
  "often",
  "constant",
] as const;
export type DataCopyFreq = (typeof DATA_COPY_FREQ)[number];

export const COMM_FRAGMENTATION = ["low", "medium", "high"] as const;
export type CommFragmentation = (typeof COMM_FRAGMENTATION)[number];

export const TEAM_FUNCTIONS = [
  "engineering",
  "product",
  "sales",
  "marketing",
  "operations",
  "finance",
  "data",
  "support",
  "leadership",
] as const;
export type TeamFunction = (typeof TEAM_FUNCTIONS)[number];

export const DECISION_BOTTLENECKS = ["none", "some", "frequent"] as const;
export type DecisionBottleneck = (typeof DECISION_BOTTLENECKS)[number];

export const HANDOFF_FREQ = ["rare", "sometimes", "often"] as const;
export type HandoffFreq = (typeof HANDOFF_FREQ)[number];

export const API_AVAILABILITY = [
  "most",
  "some",
  "few",
  "none",
  "dontKnow",
] as const;
export type ApiAvailability = (typeof API_AVAILABILITY)[number];

export const INTEGRATION_READINESS = [
  "high",
  "medium",
  "low",
  "dontKnow",
] as const;
export type IntegrationReadiness = (typeof INTEGRATION_READINESS)[number];

export const DATA_READINESS = ["clean", "mixed", "messy", "dontKnow"] as const;
export type DataReadiness = (typeof DATA_READINESS)[number];

export const SECURITY_REQUIREMENTS = [
  "gdpr",
  "hipaa",
  "soc2",
  "pci",
  "internal",
  "none",
] as const;
export type SecurityRequirement = (typeof SECURITY_REQUIREMENTS)[number];

export const DEPLOYMENT_MODELS = [
  "cloud",
  "hybrid",
  "onPrem",
  "regulated",
] as const;
export type DeploymentModel = (typeof DEPLOYMENT_MODELS)[number];

export const ROLES = [
  "founderExec",
  "engineeringLead",
  "opsProduct",
  "other",
] as const;
export type Role = (typeof ROLES)[number];

export const TECH_CATEGORIES = [
  "crm",
  "erp",
  "warehouse",
  "comms",
  "ticketing",
  "identity",
  "productivity",
  "databases",
  "customApps",
] as const;
export type TechCategory = (typeof TECH_CATEGORIES)[number];

export const TECH_OPTIONS: Record<TechCategory, readonly string[]> = {
  crm: [
    "salesforce",
    "hubspot",
    "pipedrive",
    "zoho",
    "dynamics",
    "none",
    "other",
  ],
  erp: [
    "sap",
    "netsuite",
    "dynamics",
    "quickbooks",
    "xero",
    "contpaqi",
    "none",
    "other",
  ],
  warehouse: [
    "snowflake",
    "bigquery",
    "redshift",
    "databricks",
    "none",
    "other",
  ],
  comms: ["slack", "teams", "googleWorkspace", "emailOnly", "other"],
  ticketing: ["zendesk", "intercom", "freshdesk", "jira", "none", "other"],
  identity: ["okta", "entra", "googleWorkspace", "auth0", "none", "other"],
  productivity: ["notion", "confluence", "sharepoint", "googleDrive", "other"],
  databases: [
    "postgres",
    "mysql",
    "mongodb",
    "sqlserver",
    "oracle",
    "none",
    "other",
  ],
  customApps: [
    "internalTools",
    "customerPortal",
    "dataPipelines",
    "none",
    "other",
  ],
};

/* ── Answer structures ───────────────────────────────────────────────── */

export type CompanyProfile = {
  companyName: string;
  website: string;
  industry: Industry | "";
  companySize: CompanySize | "";
  stage: Stage | "";
  mainPressure: Pressure | "";
};

export type BusinessAnswers = {
  priorityOutcomes: Outcome[];
  urgentArea: UrgentArea | "";
  timeframe: Timeframe | "";
};

export type ProcessAnswers = {
  manualWorkLevel: ScaleLevel | "";
  repetitiveWorkflows: RepetitiveWorkflow[];
  approvalBottlenecks: ApprovalBottleneck | "";
  reportingPain: ScaleLevel | "";
  dataCopyPaste: DataCopyFreq | "";
  commFragmentation: CommFragmentation | "";
};

export type TeamAnswers = {
  overloadedFunctions: TeamFunction[];
  knowledgeConcentration: TeamFunction[];
  decisionBottlenecks: DecisionBottleneck | "";
  knowledgeRisk: ScaleLevel | "";
  handoffIssues: HandoffFreq | "";
};

export type TechStackAnswers = {
  crm: string[];
  erp: string[];
  warehouse: string[];
  comms: string[];
  ticketing: string[];
  identity: string[];
  productivity: string[];
  databases: string[];
  customApps: string[];
  apiAvailability: ApiAvailability | "";
  integrationReadiness: IntegrationReadiness | "";
  dataReadiness: DataReadiness | "";
  securityRequirements: SecurityRequirement[];
  deploymentModel: DeploymentModel | "";
  /** Free text to name systems chosen as "Other" (optional). */
  otherSystems: string;
};

export type ContactInfo = {
  contactName: string;
  email: string;
  role: Role | "";
  company: string;
  phone: string;
  /** Optional public company LinkedIn page only — never an employee profile. */
  companyLinkedin: string;
  consent: boolean;
};

export type OpportunityMapSubmission = {
  company: CompanyProfile;
  business: BusinessAnswers;
  process: ProcessAnswers;
  team: TeamAnswers;
  /** null when the optional SYSTEM_LANDSCAPE section is skipped. */
  techStack: TechStackAnswers | null;
  techSkipped: boolean;
  contact: ContactInfo;
};

/* ── Result contracts (implemented in scoring.ts / insights.ts / report.ts) ── */

export type SignalBand = "low" | "moderate" | "strong" | "veryHigh";
export type ComplexityBand = "simple" | "structured" | "advanced";
export type Confidence = "estimated" | "approximate";
export type ImpactLevel = "low" | "medium" | "high";

/** A single, traceable contributor to a score. */
export type ScoreFactor = { key: string; label: string; points: number };

export type SignalResult = {
  /** AI Opportunity Signal, 0–100 — higher = more leverage for Honto. */
  score: number;
  band: SignalBand;
  explanation: string;
  factors: ScoreFactor[];
};

export type ComplexityResult = {
  band: ComplexityBand;
  estimatedFirstPhase: string;
  /** "approximate" when the tech section was skipped. */
  confidence: Confidence;
  reasons: ScoreFactor[];
};

export type ScoreResult = {
  signal: SignalResult;
  complexity: ComplexityResult;
};

/** A generated insight with a suggested Honto action. */
export type InsightItem = {
  key: string;
  label: string;
  impact: ImpactLevel;
  action: string;
};

export type SystemReadiness = {
  summary: string;
  confidence: Confidence;
  items: InsightItem[];
};

export type OpportunityInsights = {
  businessLeverage: InsightItem[];
  processDrag: InsightItem[];
  expertLeverage: InsightItem[];
  systemReadiness: SystemReadiness;
};

export type ThirtyDayWeek = { week: number; focus: string; detail: string };

export type ExecutiveSummary = {
  summary: string;
  strongest: string;
  constraint: string;
};

export type OpportunityReport = {
  executive: ExecutiveSummary;
  signal: SignalResult;
  complexity: ComplexityResult;
  insights: OpportunityInsights;
  /** Exactly three, ordered by impact. */
  firstMoves: string[];
  thirtyDayPlan: ThirtyDayWeek[];
  salesAngle: string;
  demoScenario: string;
  techSkipped: boolean;
};

/* ── Empty defaults ──────────────────────────────────────────────────── */

export const EMPTY_COMPANY: CompanyProfile = {
  companyName: "",
  website: "",
  industry: "",
  companySize: "",
  stage: "",
  mainPressure: "",
};

export const EMPTY_BUSINESS: BusinessAnswers = {
  priorityOutcomes: [],
  urgentArea: "",
  timeframe: "",
};

export const EMPTY_PROCESS: ProcessAnswers = {
  manualWorkLevel: "",
  repetitiveWorkflows: [],
  approvalBottlenecks: "",
  reportingPain: "",
  dataCopyPaste: "",
  commFragmentation: "",
};

export const EMPTY_TEAM: TeamAnswers = {
  overloadedFunctions: [],
  knowledgeConcentration: [],
  decisionBottlenecks: "",
  knowledgeRisk: "",
  handoffIssues: "",
};

export const EMPTY_TECH_STACK: TechStackAnswers = {
  crm: [],
  erp: [],
  warehouse: [],
  comms: [],
  ticketing: [],
  identity: [],
  productivity: [],
  databases: [],
  customApps: [],
  apiAvailability: "",
  integrationReadiness: "",
  dataReadiness: "",
  securityRequirements: [],
  deploymentModel: "",
  otherSystems: "",
};

export const EMPTY_CONTACT: ContactInfo = {
  contactName: "",
  email: "",
  role: "",
  company: "",
  phone: "",
  companyLinkedin: "",
  consent: false,
};

export const EMPTY_SUBMISSION: OpportunityMapSubmission = {
  company: EMPTY_COMPANY,
  business: EMPTY_BUSINESS,
  process: EMPTY_PROCESS,
  team: EMPTY_TEAM,
  techStack: null,
  techSkipped: false,
  contact: EMPTY_CONTACT,
};

export const FIELD_LIMITS = {
  shortText: 160,
  url: 200,
  email: 254,
  phone: 15,
  longText: 600,
  otherSystems: 250,
} as const;

/* ── Validation helpers (typed; no question-data dependency) ─────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;
const PHONE_RE = /^\d{7,15}$/;

export function isValidEmail(value: string): boolean {
  const v = value.trim();
  return v.length <= FIELD_LIMITS.email && EMAIL_RE.test(v);
}

export function isValidUrl(value: string): boolean {
  const v = value.trim();
  return v.length <= FIELD_LIMITS.url && URL_RE.test(v);
}

export function isValidPhone(value: string): boolean {
  return PHONE_RE.test(value.trim());
}

export type ContactValidation = { ok: boolean; errors: Record<string, string> };

/**
 * Contact fields are validated separately from the diagnostic answers — the
 * gate must pass before the report is unlocked.
 */
export function validateContact(contact: ContactInfo): ContactValidation {
  const errors: Record<string, string> = {};
  if (!contact.contactName.trim()) errors.contactName = "required";
  if (!contact.company.trim()) errors.company = "required";
  if (!contact.email.trim()) errors.email = "required";
  else if (!isValidEmail(contact.email)) errors.email = "invalid";
  if (!contact.role) errors.role = "required";
  if (!contact.consent) errors.consent = "required";
  if (contact.phone.trim() && !isValidPhone(contact.phone))
    errors.phone = "invalid";
  if (contact.companyLinkedin.trim() && !isValidUrl(contact.companyLinkedin))
    errors.companyLinkedin = "invalid";
  return { ok: Object.keys(errors).length === 0, errors };
}

/* ── Section completion (required diagnostic fields) ─────────────────── */

export function isCompanyProfileComplete(c: CompanyProfile): boolean {
  return Boolean(
    c.companyName.trim() &&
    c.industry &&
    c.companySize &&
    c.stage &&
    c.mainPressure
  );
}

export function isBusinessComplete(b: BusinessAnswers): boolean {
  return Boolean(b.priorityOutcomes.length > 0 && b.urgentArea && b.timeframe);
}

export function isProcessComplete(p: ProcessAnswers): boolean {
  return Boolean(p.manualWorkLevel);
}

export function isTeamComplete(t: TeamAnswers): boolean {
  return t.overloadedFunctions.length > 0;
}

export function isContactComplete(c: ContactInfo): boolean {
  return validateContact(c).ok;
}
