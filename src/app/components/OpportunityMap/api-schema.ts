/**
 * Honto AI Readiness Map — server-side submission validation.
 *
 * Re-validates and normalizes an incoming submission against the diagnostic
 * schema: copies only known fields (stripping unknown ones), coerces enums,
 * rejects payloads containing obvious private/credential field names, and checks
 * required contact + diagnostic fields. Mirrors the small-custom-validator style
 * used by the existing contact and onboarding routes (no external validator).
 */

import {
  API_AVAILABILITY,
  APPROVAL_BOTTLENECKS,
  COMM_FRAGMENTATION,
  COMPANY_SIZES,
  DATA_COPY_FREQ,
  DATA_READINESS,
  DECISION_BOTTLENECKS,
  DEPLOYMENT_MODELS,
  FIELD_LIMITS,
  HANDOFF_FREQ,
  INDUSTRIES,
  INTEGRATION_READINESS,
  OUTCOMES,
  PRESSURES,
  REPETITIVE_WORKFLOWS,
  ROLES,
  SCALE_LEVELS,
  SECURITY_REQUIREMENTS,
  STAGES,
  TEAM_FUNCTIONS,
  TECH_OPTIONS,
  TIMEFRAMES,
  URGENT_AREAS,
  isBusinessComplete,
  isCompanyProfileComplete,
  isProcessComplete,
  isTeamComplete,
  isValidUrl,
  validateContact,
  type OpportunityMapSubmission,
  type TechStackAnswers,
} from "./schema";

/* ── Banned / private field rejection ────────────────────────────────── */

const BANNED_KEY_TOKENS = [
  "password",
  "passwd",
  "apikey",
  "secret",
  "token",
  "credential",
  "privatekey",
  "oauth",
  "bearer",
  "ssh",
  "upload",
  "attachment",
  "file",
  "document",
  "privaterepo",
  "privatechat",
  "employeelinkedin",
  "employee",
  "ssn",
  "salary",
  "payroll",
  "compensation",
  "bankaccount",
  "creditcard",
  "iban",
];

function normKey(k: string): string {
  return k.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function hasBannedKeys(value: unknown, depth = 0): boolean {
  if (depth > 6 || !value || typeof value !== "object") return false;
  if (Array.isArray(value))
    return value.some((v) => hasBannedKeys(v, depth + 1));
  for (const [k, v] of Object.entries(value)) {
    const nk = normKey(k);
    if (BANNED_KEY_TOKENS.some((t) => nk.includes(t))) return true;
    if (hasBannedKeys(v, depth + 1)) return true;
  }
  return false;
}

/* ── Coercion helpers ────────────────────────────────────────────────── */

function trimmed(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  const t = v.trim();
  return t.length > max ? "" : t;
}

function asEnum<T extends string>(v: unknown, allowed: readonly T[]): T | "" {
  if (typeof v !== "string") return "";
  return (allowed as readonly string[]).includes(v) ? (v as T) : "";
}

function asEnumArray<T extends string>(v: unknown, allowed: readonly T[]): T[] {
  if (!Array.isArray(v)) return [];
  const set = new Set<string>(allowed);
  return v.filter((x): x is T => typeof x === "string" && set.has(x));
}

function normalizeTech(raw: unknown): TechStackAnswers {
  const t = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;
  return {
    crm: asEnumArray(t.crm, TECH_OPTIONS.crm),
    erp: asEnumArray(t.erp, TECH_OPTIONS.erp),
    warehouse: asEnumArray(t.warehouse, TECH_OPTIONS.warehouse),
    comms: asEnumArray(t.comms, TECH_OPTIONS.comms),
    ticketing: asEnumArray(t.ticketing, TECH_OPTIONS.ticketing),
    identity: asEnumArray(t.identity, TECH_OPTIONS.identity),
    productivity: asEnumArray(t.productivity, TECH_OPTIONS.productivity),
    databases: asEnumArray(t.databases, TECH_OPTIONS.databases),
    customApps: asEnumArray(t.customApps, TECH_OPTIONS.customApps),
    apiAvailability: asEnum(t.apiAvailability, API_AVAILABILITY),
    integrationReadiness: asEnum(t.integrationReadiness, INTEGRATION_READINESS),
    dataReadiness: asEnum(t.dataReadiness, DATA_READINESS),
    securityRequirements: asEnumArray(
      t.securityRequirements,
      SECURITY_REQUIREMENTS
    ),
    deploymentModel: asEnum(t.deploymentModel, DEPLOYMENT_MODELS),
  };
}

export type NormalizeResult =
  | { ok: true; submission: OpportunityMapSubmission }
  | { ok: false; issues: string[] };

export function normalizeSubmission(raw: unknown): NormalizeResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, issues: ["Invalid submission."] };
  }
  if (hasBannedKeys(raw)) {
    return { ok: false, issues: ["Unsupported data in submission."] };
  }

  const r = raw as Record<string, unknown>;
  const c = (r.company ?? {}) as Record<string, unknown>;
  const b = (r.business ?? {}) as Record<string, unknown>;
  const p = (r.process ?? {}) as Record<string, unknown>;
  const tm = (r.team ?? {}) as Record<string, unknown>;
  const ct = (r.contact ?? {}) as Record<string, unknown>;

  const company = {
    companyName: trimmed(c.companyName, FIELD_LIMITS.shortText),
    website: trimmed(c.website, FIELD_LIMITS.url),
    industry: asEnum(c.industry, INDUSTRIES),
    companySize: asEnum(c.companySize, COMPANY_SIZES),
    stage: asEnum(c.stage, STAGES),
    mainPressure: asEnum(c.mainPressure, PRESSURES),
  };
  const business = {
    priorityOutcomes: asEnumArray(b.priorityOutcomes, OUTCOMES),
    urgentArea: asEnum(b.urgentArea, URGENT_AREAS),
    timeframe: asEnum(b.timeframe, TIMEFRAMES),
  };
  const processAns = {
    manualWorkLevel: asEnum(p.manualWorkLevel, SCALE_LEVELS),
    repetitiveWorkflows: asEnumArray(
      p.repetitiveWorkflows,
      REPETITIVE_WORKFLOWS
    ),
    approvalBottlenecks: asEnum(p.approvalBottlenecks, APPROVAL_BOTTLENECKS),
    reportingPain: asEnum(p.reportingPain, SCALE_LEVELS),
    dataCopyPaste: asEnum(p.dataCopyPaste, DATA_COPY_FREQ),
    commFragmentation: asEnum(p.commFragmentation, COMM_FRAGMENTATION),
  };
  const team = {
    overloadedFunctions: asEnumArray(tm.overloadedFunctions, TEAM_FUNCTIONS),
    knowledgeConcentration: asEnumArray(
      tm.knowledgeConcentration,
      TEAM_FUNCTIONS
    ),
    decisionBottlenecks: asEnum(tm.decisionBottlenecks, DECISION_BOTTLENECKS),
    knowledgeRisk: asEnum(tm.knowledgeRisk, SCALE_LEVELS),
    handoffIssues: asEnum(tm.handoffIssues, HANDOFF_FREQ),
  };

  const techSkipped = r.techSkipped === true;
  const techStack =
    techSkipped || r.techStack == null ? null : normalizeTech(r.techStack);

  const contact = {
    contactName: trimmed(ct.contactName, FIELD_LIMITS.shortText),
    email: trimmed(ct.email, FIELD_LIMITS.email),
    role: asEnum(ct.role, ROLES),
    // Company name carries over from business context (never asked twice).
    company: company.companyName,
    phone: trimmed(ct.phone, FIELD_LIMITS.phone),
    companyLinkedin: trimmed(ct.companyLinkedin, FIELD_LIMITS.url),
    consent: ct.consent === true,
  };

  const submission: OpportunityMapSubmission = {
    company,
    business,
    process: processAns,
    team,
    techStack,
    techSkipped,
    contact,
  };

  const issues: string[] = [];
  const cv = validateContact(contact);
  if (cv.errors.company) issues.push("Company name is required.");
  if (cv.errors.contactName) issues.push("Contact name is required.");
  if (cv.errors.email)
    issues.push(
      cv.errors.email === "invalid"
        ? "A valid email is required."
        : "Email is required."
    );
  if (cv.errors.role) issues.push("Role is required.");
  if (cv.errors.consent) issues.push("Consent is required.");
  if (company.website && !isValidUrl(company.website))
    issues.push("Website must be a valid URL.");
  if (!isCompanyProfileComplete(company))
    issues.push("Business context is incomplete.");
  if (!isBusinessComplete(business))
    issues.push("Business goals are incomplete.");
  if (!isProcessComplete(processAns))
    issues.push("Process answers are incomplete.");
  if (!isTeamComplete(team)) issues.push("Team answers are incomplete.");

  if (issues.length > 0) return { ok: false, issues };
  return { ok: true, submission };
}
