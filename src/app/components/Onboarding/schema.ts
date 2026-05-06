export const INDUSTRIES = [
  "fintech",
  "healthcare",
  "retail",
  "manufacturing",
  "logistics",
  "tech",
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

export const ROLES = [
  "founderExec",
  "engineeringLead",
  "opsProduct",
  "other",
] as const;
export type Role = (typeof ROLES)[number];

export const SYSTEM_CATEGORIES = [
  "crm",
  "erp",
  "warehouse",
  "comms",
  "ticketing",
  "identity",
  "productivity",
] as const;
export type SystemCategory = (typeof SYSTEM_CATEGORIES)[number];

export const SYSTEM_OPTIONS: Record<SystemCategory, readonly string[]> = {
  crm: [
    "salesforce",
    "hubspot",
    "pipedrive",
    "zoho",
    "dynamics",
    "none",
    "other",
  ],
  erp: ["sap", "netsuite", "dynamics", "quickbooks", "xero", "none", "other"],
  warehouse: [
    "snowflake",
    "bigquery",
    "redshift",
    "databricks",
    "postgres",
    "none",
    "other",
  ],
  comms: ["slack", "teams", "googleWorkspace", "emailOnly", "other"],
  ticketing: ["zendesk", "intercom", "freshdesk", "jira", "none", "other"],
  identity: ["okta", "entra", "googleWorkspace", "auth0", "none", "other"],
  productivity: ["notion", "confluence", "sharepoint", "googleDrive", "other"],
};

export const CUSTOM_APP_TIERS = ["no", "1-3", "4-10", "11+"] as const;
export type CustomAppTier = (typeof CUSTOM_APP_TIERS)[number];

export const DATA_LOCATIONS = [
  "warehouse",
  "saas",
  "spreadsheets",
  "dontKnow",
] as const;
export type DataLocation = (typeof DATA_LOCATIONS)[number];

export const DATA_VOLUMES = [
  "<1gb",
  "1-100gb",
  "100gb-1tb",
  "1tb+",
  "dontKnow",
] as const;
export type DataVolume = (typeof DATA_VOLUMES)[number];

export const DOC_LEVELS = ["yes", "partial", "no", "dontKnow"] as const;
export type DocLevel = (typeof DOC_LEVELS)[number];

export const INTEGRATION_LEVELS = ["yes", "some", "no", "dontKnow"] as const;
export type IntegrationLevel = (typeof INTEGRATION_LEVELS)[number];

export const AI_USE_LEVELS = [
  "none",
  "individual",
  "pilots",
  "production",
] as const;
export type AIUseLevel = (typeof AI_USE_LEVELS)[number];

export const PRIOR_PROJECT_LEVELS = [
  "never",
  "incomplete",
  "mixed",
  "production",
] as const;
export type PriorProjectLevel = (typeof PRIOR_PROJECT_LEVELS)[number];

export const TALENT_LEVELS = ["none", "one", "small", "dedicated"] as const;
export type TalentLevel = (typeof TALENT_LEVELS)[number];

export const GOVERNANCE_LEVELS = [
  "none",
  "informal",
  "written",
  "formal",
] as const;
export type GovernanceLevel = (typeof GOVERNANCE_LEVELS)[number];

export const PRIVACY_CONSTRAINTS = [
  "gdpr",
  "hipaa",
  "soc2",
  "pci",
  "internal",
  "none",
] as const;
export type PrivacyConstraint = (typeof PRIVACY_CONSTRAINTS)[number];

export const LLM_FAMILIARITY_LEVELS = ["low", "medium", "high"] as const;
export type LLMFamiliarity = (typeof LLM_FAMILIARITY_LEVELS)[number];

export const OUTCOMES = [
  "cost",
  "speed",
  "cx",
  "newCapability",
  "compliance",
  "other",
] as const;
export type Outcome = (typeof OUTCOMES)[number];

export const START_DATES = [
  "asap",
  "1-3mo",
  "3-6mo",
  "6+mo",
  "exploring",
] as const;
export type StartDate = (typeof START_DATES)[number];

export const BUDGET_RANGES = [
  "undefined",
  "<25k",
  "25-100k",
  "100-500k",
  "500k+",
] as const;
export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const DECISION_TIMELINES = [
  "weeks",
  "1-2mo",
  "3+mo",
  "unclear",
] as const;
export type DecisionTimeline = (typeof DECISION_TIMELINES)[number];

export type Step1Company = {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: Industry | "";
  companySize: CompanySize | "";
  country: string;
  role: Role | "";
};

export type Step2Systems = Record<SystemCategory, string[]> & {
  customApps: CustomAppTier | "";
};

export type Step3Data = {
  dataLocation: DataLocation | "";
  dataVolume: DataVolume | "";
  documented: DocLevel | "";
  integrated: IntegrationLevel | "";
  manualWorkflows: string;
};

export type Step4AI = {
  currentUse: AIUseLevel | "";
  priorProjects: PriorProjectLevel | "";
  talent: TalentLevel | "";
  governance: GovernanceLevel | "";
  privacy: PrivacyConstraint[];
  llmFamiliarity: LLMFamiliarity | "";
};

export type Step5Goals = {
  outcomes: Outcome[];
  priorities: string;
  startDate: StartDate | "";
  budget: BudgetRange | "";
  decisionTimeline: DecisionTimeline | "";
  notes: string;
};

export type Answers = {
  step1: Step1Company;
  step2: Step2Systems;
  step3: Step3Data;
  step4: Step4AI;
  step5: Step5Goals;
};

export const EMPTY_ANSWERS: Answers = {
  step1: {
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "",
    companySize: "",
    country: "",
    role: "",
  },
  step2: {
    crm: [],
    erp: [],
    warehouse: [],
    comms: [],
    ticketing: [],
    identity: [],
    productivity: [],
    customApps: "",
  },
  step3: {
    dataLocation: "",
    dataVolume: "",
    documented: "",
    integrated: "",
    manualWorkflows: "",
  },
  step4: {
    currentUse: "",
    priorProjects: "",
    talent: "",
    governance: "",
    privacy: [],
    llmFamiliarity: "",
  },
  step5: {
    outcomes: [],
    priorities: "",
    startDate: "",
    budget: "",
    decisionTimeline: "",
    notes: "",
  },
};

export const FIELD_LIMITS = {
  shortText: 160,
  email: 254,
  phone: 15,
  manualWorkflows: 500,
  priorities: 500,
  notes: 1000,
} as const;

export const STEP_COUNT = 5;
