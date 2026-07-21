/**
 * Honto AI Readiness Map — V1 question definitions (data-driven).
 *
 * Source copy is authored inline as English; localized strings live in the
 * locale dictionaries. Every question carries a stable `id` (reused as the
 * locale key), section, type, required flag, and options where applicable.
 * All wording is privacy-safe — see `privacy.ts`.
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
  TECH_CATEGORIES,
  TECH_OPTIONS,
  TIMEFRAMES,
  URGENT_AREAS,
  isSkippableSection,
  type Question,
  type QuestionOption,
  type QuestionSection,
} from "./schema";

function toOptions(
  values: readonly string[],
  labels: Record<string, string>
): QuestionOption[] {
  return values.map((value) => ({ value, label: labels[value] ?? value }));
}

/* ── Label maps ──────────────────────────────────────────────────────── */

const INDUSTRY_LABELS: Record<string, string> = {
  fintech: "Financial services",
  healthcare: "Healthcare",
  retail: "Retail / eCommerce",
  manufacturing: "Manufacturing",
  logistics: "Logistics",
  tech: "Tech / SaaS",
  services: "Professional services",
  publicSector: "Public sector",
  other: "Other",
};

const COMPANY_SIZE_LABELS: Record<string, string> = {
  "1-10": "1–10",
  "11-50": "11–50",
  "51-200": "51–200",
  "201-1000": "201–1,000",
  "1000+": "1,000+",
};

const STAGE_LABELS: Record<string, string> = {
  startup: "Early-stage startup",
  scaling: "Scaling",
  established: "Established",
  transforming: "Transforming / modernizing",
};

const PRESSURE_LABELS: Record<string, string> = {
  growth: "Pressure to grow",
  margin: "Protecting margins",
  competition: "Competitive pressure",
  retention: "Customer retention",
  efficiency: "Operational efficiency",
  compliance: "Compliance / risk",
  other: "Other",
};

const OUTCOME_LABELS: Record<string, string> = {
  growth: "Grow revenue",
  cost: "Cut cost",
  speed: "Move faster",
  quality: "Improve quality",
  cx: "Better customer experience",
  compliance: "Reduce compliance risk",
  visibility: "More visibility / reporting",
};

const URGENT_AREA_LABELS: Record<string, string> = {
  sales: "Sales",
  marketing: "Marketing",
  operations: "Operations",
  finance: "Finance",
  support: "Customer support",
  product: "Product",
  data: "Data / analytics",
  hr: "People / HR",
  other: "Other",
};

const TIMEFRAME_LABELS: Record<string, string> = {
  asap: "As soon as possible",
  "1-3mo": "1–3 months",
  "3-6mo": "3–6 months",
  "6-12mo": "6–12 months",
  exploring: "Just exploring",
};

const SCALE_LABELS: Record<string, string> = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "5": "5",
};

const REPETITIVE_LABELS: Record<string, string> = {
  dataEntry: "Manual data entry",
  reporting: "Building reports",
  scheduling: "Scheduling / coordination",
  invoicing: "Invoicing / billing",
  onboarding: "Customer or staff onboarding",
  reconciliation: "Reconciliation",
  statusUpdates: "Status updates / chasing",
  other: "Other",
};

const APPROVAL_LABELS: Record<string, string> = {
  none: "No real bottlenecks",
  minor: "Minor delays",
  frequent: "Frequent delays",
  severe: "Severe / blocking delays",
};

const DATA_COPY_LABELS: Record<string, string> = {
  rare: "Rarely",
  sometimes: "Sometimes",
  often: "Often",
  constant: "Constantly",
};

const COMM_LABELS: Record<string, string> = {
  low: "Low — mostly in one place",
  medium: "Medium — a few tools",
  high: "High — scattered across many tools",
};

const FUNCTION_LABELS: Record<string, string> = {
  engineering: "Engineering",
  product: "Product",
  sales: "Sales",
  marketing: "Marketing",
  operations: "Operations",
  finance: "Finance",
  data: "Data / analytics",
  support: "Customer support",
  leadership: "Leadership",
};

const DECISION_LABELS: Record<string, string> = {
  none: "No",
  some: "Sometimes",
  frequent: "Frequently",
};

const HANDOFF_LABELS: Record<string, string> = {
  rare: "Rarely",
  sometimes: "Sometimes",
  often: "Often",
};

const API_LABELS: Record<string, string> = {
  most: "Most systems have APIs",
  some: "Some do",
  few: "Few do",
  none: "None / unsure",
  dontKnow: "Don't know",
};

const INTEGRATION_LABELS: Record<string, string> = {
  high: "Well integrated",
  medium: "Partly integrated",
  low: "Mostly siloed",
  dontKnow: "Don't know",
};

const DATA_READINESS_LABELS: Record<string, string> = {
  clean: "Clean and organized",
  mixed: "Mixed",
  messy: "Fragmented / messy",
  dontKnow: "Don't know",
};

const SECURITY_LABELS: Record<string, string> = {
  gdpr: "GDPR",
  hipaa: "HIPAA",
  soc2: "SOC 2",
  pci: "PCI",
  internal: "Internal-only data",
  none: "None",
};

const DEPLOYMENT_LABELS: Record<string, string> = {
  cloud: "Cloud-first",
  hybrid: "Hybrid",
  onPrem: "On-premise",
  regulated: "Regulated / restricted environment",
};

const ROLE_LABELS: Record<string, string> = {
  founderExec: "Founder / Executive",
  engineeringLead: "Engineering lead",
  opsProduct: "Ops / Product",
  other: "Other",
};

const TECH_CATEGORY_META: Record<
  (typeof TECH_CATEGORIES)[number],
  { label: string }
> = {
  crm: { label: "CRM" },
  erp: { label: "ERP / Finance" },
  warehouse: { label: "Data warehouse / lake" },
  comms: { label: "Communication" },
  ticketing: { label: "Ticketing / support" },
  identity: { label: "Identity / SSO" },
  productivity: { label: "Productivity / docs" },
  databases: { label: "Databases" },
  customApps: { label: "Custom applications" },
};

const TECH_OPTION_LABELS: Record<string, string> = {
  salesforce: "Salesforce",
  hubspot: "HubSpot",
  pipedrive: "Pipedrive",
  zoho: "Zoho",
  dynamics: "Microsoft Dynamics",
  sap: "SAP",
  netsuite: "Oracle NetSuite",
  quickbooks: "QuickBooks",
  xero: "Xero",
  contpaqi: "Contpaqi",
  snowflake: "Snowflake",
  bigquery: "BigQuery",
  redshift: "Redshift",
  databricks: "Databricks",
  slack: "Slack",
  teams: "Microsoft Teams",
  googleWorkspace: "Google Workspace",
  emailOnly: "Email only",
  zendesk: "Zendesk",
  intercom: "Intercom",
  freshdesk: "Freshdesk",
  jira: "Jira",
  okta: "Okta",
  entra: "Entra / Azure AD",
  auth0: "Auth0",
  notion: "Notion",
  confluence: "Confluence",
  sharepoint: "SharePoint",
  googleDrive: "Google Drive",
  postgres: "PostgreSQL",
  mysql: "MySQL",
  mongodb: "MongoDB",
  sqlserver: "SQL Server",
  oracle: "Oracle",
  internalTools: "Internal tools",
  customerPortal: "Customer portal",
  dataPipelines: "Data pipelines",
  none: "None",
  other: "Other",
};

/* ── Tech-category questions (SYSTEM_LANDSCAPE) ──────────────────────── */

const TECH_CATEGORY_QUESTIONS: Question[] = TECH_CATEGORIES.map((cat) => ({
  id: cat,
  section: "SYSTEM_LANDSCAPE" as const,
  type: "multiselect" as const,
  label: TECH_CATEGORY_META[cat].label,
  required: false,
  options: toOptions(TECH_OPTIONS[cat], TECH_OPTION_LABELS),
}));

/* ── Full question set ───────────────────────────────────────────────── */

export const QUESTIONS: Question[] = [
  // BUSINESS_CONTEXT
  {
    id: "companyName",
    section: "BUSINESS_CONTEXT",
    type: "text",
    label: "Company name",
    required: true,
    maxLength: FIELD_LIMITS.shortText,
  },
  {
    id: "website",
    section: "BUSINESS_CONTEXT",
    type: "url",
    label: "Company website",
    helper: "Optional — your public company website.",
    required: false,
    isPublic: true,
    maxLength: FIELD_LIMITS.url,
  },
  {
    id: "industry",
    section: "BUSINESS_CONTEXT",
    type: "select",
    label: "Industry",
    required: true,
    options: toOptions(INDUSTRIES, INDUSTRY_LABELS),
  },
  {
    id: "companySize",
    section: "BUSINESS_CONTEXT",
    type: "select",
    label: "Company size",
    required: true,
    options: toOptions(COMPANY_SIZES, COMPANY_SIZE_LABELS),
  },
  {
    id: "stage",
    section: "BUSINESS_CONTEXT",
    type: "select",
    label: "Stage / operating model",
    required: true,
    options: toOptions(STAGES, STAGE_LABELS),
  },
  {
    id: "mainPressure",
    section: "BUSINESS_CONTEXT",
    type: "select",
    label: "Main business pressure right now",
    required: true,
    options: toOptions(PRESSURES, PRESSURE_LABELS),
  },

  // BUSINESS_GOALS
  {
    id: "priorityOutcomes",
    section: "BUSINESS_GOALS",
    type: "multiselect",
    label: "Priority outcomes",
    helper: "Select all that apply.",
    required: true,
    options: toOptions(OUTCOMES, OUTCOME_LABELS),
  },
  {
    id: "urgentArea",
    section: "BUSINESS_GOALS",
    type: "select",
    label: "Most urgent area",
    required: true,
    options: toOptions(URGENT_AREAS, URGENT_AREA_LABELS),
  },
  {
    id: "timeframe",
    section: "BUSINESS_GOALS",
    type: "select",
    label: "Desired timeframe",
    required: true,
    options: toOptions(TIMEFRAMES, TIMEFRAME_LABELS),
  },

  // PROCESS_DRAG
  {
    id: "manualWorkLevel",
    section: "PROCESS_DRAG",
    type: "scale",
    label: "How much manual, repetitive work does the team carry?",
    helper: "1 = minimal, 5 = severe.",
    required: true,
    options: toOptions(SCALE_LEVELS, SCALE_LABELS),
  },
  {
    id: "repetitiveWorkflows",
    section: "PROCESS_DRAG",
    type: "multiselect",
    label: "Which repetitive workflows take the most time?",
    required: false,
    options: toOptions(REPETITIVE_WORKFLOWS, REPETITIVE_LABELS),
  },
  {
    id: "approvalBottlenecks",
    section: "PROCESS_DRAG",
    type: "select",
    label: "Approval bottlenecks",
    required: false,
    options: toOptions(APPROVAL_BOTTLENECKS, APPROVAL_LABELS),
  },
  {
    id: "reportingPain",
    section: "PROCESS_DRAG",
    type: "scale",
    label: "How painful is reporting today?",
    helper: "1 = effortless, 5 = very painful.",
    required: false,
    options: toOptions(SCALE_LEVELS, SCALE_LABELS),
  },
  {
    id: "dataCopyPaste",
    section: "PROCESS_DRAG",
    type: "select",
    label: "How often is data copied between systems by hand?",
    required: false,
    options: toOptions(DATA_COPY_FREQ, DATA_COPY_LABELS),
  },
  {
    id: "commFragmentation",
    section: "PROCESS_DRAG",
    type: "select",
    label: "Communication fragmentation",
    required: false,
    options: toOptions(COMM_FRAGMENTATION, COMM_LABELS),
  },

  // EXPERT_LEVERAGE
  {
    id: "overloadedFunctions",
    section: "EXPERT_LEVERAGE",
    type: "multiselect",
    label: "Which teams or functions are overloaded?",
    required: true,
    options: toOptions(TEAM_FUNCTIONS, FUNCTION_LABELS),
  },
  {
    id: "knowledgeConcentration",
    section: "EXPERT_LEVERAGE",
    type: "multiselect",
    label: "Where is critical know-how concentrated?",
    helper: "By function only — do not name individuals.",
    required: false,
    options: toOptions(TEAM_FUNCTIONS, FUNCTION_LABELS),
  },
  {
    id: "decisionBottlenecks",
    section: "EXPERT_LEVERAGE",
    type: "select",
    label: "Do decisions get stuck waiting on a few people?",
    required: false,
    options: toOptions(DECISION_BOTTLENECKS, DECISION_LABELS),
  },
  {
    id: "knowledgeRisk",
    section: "EXPERT_LEVERAGE",
    type: "scale",
    label: "Risk if a key function were suddenly unavailable",
    helper: "1 = low, 5 = critical.",
    required: false,
    options: toOptions(SCALE_LEVELS, SCALE_LABELS),
  },
  {
    id: "handoffIssues",
    section: "EXPERT_LEVERAGE",
    type: "select",
    label: "Do handoffs between teams cause problems?",
    required: false,
    options: toOptions(HANDOFF_FREQ, HANDOFF_LABELS),
  },

  // SYSTEM_LANDSCAPE (optional / skippable)
  ...TECH_CATEGORY_QUESTIONS,
  {
    id: "apiAvailability",
    section: "SYSTEM_LANDSCAPE",
    type: "select",
    label: "API availability across your systems",
    required: false,
    options: toOptions(API_AVAILABILITY, API_LABELS),
  },
  {
    id: "integrationReadiness",
    section: "SYSTEM_LANDSCAPE",
    type: "select",
    label: "Integration readiness",
    required: false,
    options: toOptions(INTEGRATION_READINESS, INTEGRATION_LABELS),
  },
  {
    id: "dataReadiness",
    section: "SYSTEM_LANDSCAPE",
    type: "select",
    label: "Data readiness",
    required: false,
    options: toOptions(DATA_READINESS, DATA_READINESS_LABELS),
  },
  {
    id: "securityRequirements",
    section: "SYSTEM_LANDSCAPE",
    type: "multiselect",
    label: "Security / compliance requirements",
    required: false,
    options: toOptions(SECURITY_REQUIREMENTS, SECURITY_LABELS),
  },
  {
    id: "deploymentModel",
    section: "SYSTEM_LANDSCAPE",
    type: "select",
    label: "Deployment model",
    helper: "On-premise or compliance-heavy needs.",
    required: false,
    options: toOptions(DEPLOYMENT_MODELS, DEPLOYMENT_LABELS),
  },

  // CONTACT_GATE
  {
    id: "contactName",
    section: "CONTACT_GATE",
    type: "text",
    label: "Your name",
    required: true,
    maxLength: FIELD_LIMITS.shortText,
  },
  {
    id: "email",
    section: "CONTACT_GATE",
    type: "email",
    label: "Work email",
    required: true,
    maxLength: FIELD_LIMITS.email,
  },
  {
    id: "role",
    section: "CONTACT_GATE",
    type: "select",
    label: "Your role",
    required: true,
    options: toOptions(ROLES, ROLE_LABELS),
  },
  {
    id: "phone",
    section: "CONTACT_GATE",
    type: "text",
    label: "Phone",
    helper: "Optional.",
    required: false,
    maxLength: FIELD_LIMITS.phone,
  },
  {
    id: "companyLinkedin",
    section: "CONTACT_GATE",
    type: "url",
    label: "Company LinkedIn page",
    helper: "Optional — your public company page only.",
    required: false,
    isPublic: true,
    maxLength: FIELD_LIMITS.url,
  },
  {
    id: "consent",
    section: "CONTACT_GATE",
    type: "checkbox",
    label: "I agree to be contacted about my results.",
    required: true,
  },
];

/* ── Question lookups & required-field validation ────────────────────── */

export function questionsForSection(section: QuestionSection): Question[] {
  return QUESTIONS.filter((q) => q.section === section);
}

export type AnswerValue = string | string[] | boolean;

/* ── Localization overlay ────────────────────────────────────────────────
 * English is the source copy authored above; localized strings live in the
 * locale dictionaries under `opportunityMap.questions`. The overlay replaces
 * a question's label/helper/option labels with localized text, falling back
 * to English for any missing key so a partial translation never breaks the
 * form. Structural fields (id, type, required) are never touched.
 */

export type OmQuestionsCopy = {
  labels?: Record<string, string>;
  helpers?: Record<string, string>;
  /** Per-question map of option value → localized label. */
  options?: Record<string, Record<string, string>>;
  /** "Other — {label}" template + helper for the tech-inventory free-text. */
  techOtherLabel?: string;
  techOtherHelper?: string;
};

export function localizeQuestion(
  q: Question,
  copy: OmQuestionsCopy | undefined
): Question {
  if (!copy) return q;
  const label = copy.labels?.[q.id] ?? q.label;
  const helper =
    q.helper != null ? (copy.helpers?.[q.id] ?? q.helper) : q.helper;
  const optMap = copy.options?.[q.id];
  const options =
    q.options && optMap
      ? q.options.map((o) => ({ ...o, label: optMap[o.value] ?? o.label }))
      : q.options;
  return { ...q, label, helper, options };
}

export function localizeQuestions(
  list: Question[],
  copy: OmQuestionsCopy | undefined
): Question[] {
  return copy ? list.map((q) => localizeQuestion(q, copy)) : list;
}

/**
 * Data-driven required-field check. Returns the ids of required questions that
 * are unanswered. Skippable sections never block (return an empty list).
 */
export function findMissingRequired(
  section: QuestionSection,
  values: Record<string, AnswerValue>
): string[] {
  if (isSkippableSection(section)) return [];
  return questionsForSection(section)
    .filter((q) => q.required)
    .filter((q) => {
      const v = values[q.id];
      if (Array.isArray(v)) return v.length === 0;
      if (typeof v === "boolean") return v === false;
      return v == null || String(v).trim() === "";
    })
    .map((q) => q.id);
}
