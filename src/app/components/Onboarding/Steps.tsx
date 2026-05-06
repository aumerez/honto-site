"use client";

import {
  CheckboxGroup,
  ComboboxField,
  RadioGroup,
  SelectField,
  TextAreaField,
  TextField,
  type Option,
} from "./Fields";
import { COUNTRIES } from "./countries";
import {
  AI_USE_LEVELS,
  BUDGET_RANGES,
  COMPANY_SIZES,
  CUSTOM_APP_TIERS,
  DATA_LOCATIONS,
  DATA_VOLUMES,
  DECISION_TIMELINES,
  DOC_LEVELS,
  FIELD_LIMITS,
  GOVERNANCE_LEVELS,
  INDUSTRIES,
  INTEGRATION_LEVELS,
  LLM_FAMILIARITY_LEVELS,
  OUTCOMES,
  PRIOR_PROJECT_LEVELS,
  PRIVACY_CONSTRAINTS,
  ROLES,
  START_DATES,
  SYSTEM_OPTIONS,
  TALENT_LEVELS,
  type Step1Company,
  type Step2Systems,
  type Step3Data,
  type Step4AI,
  type Step5Goals,
} from "./schema";

function mapOptions(
  values: readonly string[],
  labels: Record<string, string>
): Option[] {
  return values.map((value) => ({ value, label: labels[value] ?? value }));
}

export type Step1Copy = {
  title: string;
  description: string;
  companyName: string;
  contactName: string;
  email: string;
  emailInvalid: string;
  phone: string;
  phoneInvalid: string;
  requiredField: string;
  industry: string;
  industryOptions: Record<string, string>;
  companySize: string;
  companySizeOptions: Record<string, string>;
  country: string;
  role: string;
  roleOptions: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{7,15}$/;

export function Step1({
  values,
  update,
  copy,
  submitAttempted,
}: {
  values: Step1Company;
  update: (patch: Partial<Step1Company>) => void;
  copy: Step1Copy;
  submitAttempted: boolean;
}) {
  const requiredEmpty = (v: string) =>
    submitAttempted && !v.trim() ? copy.requiredField : "";

  const emailError = values.email
    ? !EMAIL_RE.test(values.email)
      ? copy.emailInvalid
      : ""
    : requiredEmpty(values.email);

  const phoneError =
    values.phone && !PHONE_RE.test(values.phone) ? copy.phoneInvalid : "";

  const companyNameError = requiredEmpty(values.companyName);
  const contactNameError = requiredEmpty(values.contactName);
  const industryError =
    submitAttempted && !values.industry ? copy.requiredField : "";
  const companySizeError =
    submitAttempted && !values.companySize ? copy.requiredField : "";

  return (
    <div className="ob-step">
      <h2 className="ob-step-title">{copy.title}</h2>
      <p className="ob-step-desc">{copy.description}</p>

      <TextField
        label={copy.companyName}
        name="companyName"
        value={values.companyName}
        onChange={(v) => update({ companyName: v })}
        required
        maxLength={FIELD_LIMITS.shortText}
        autoComplete="organization"
        error={companyNameError || undefined}
      />

      <TextField
        label={copy.contactName}
        name="contactName"
        value={values.contactName}
        onChange={(v) => update({ contactName: v })}
        required
        maxLength={FIELD_LIMITS.shortText}
        autoComplete="name"
        error={contactNameError || undefined}
      />

      <TextField
        label={copy.email}
        name="email"
        type="email"
        value={values.email}
        onChange={(v) => update({ email: v })}
        required
        maxLength={FIELD_LIMITS.email}
        autoComplete="email"
        error={emailError || undefined}
      />

      <TextField
        label={copy.phone}
        name="phone"
        type="tel"
        inputMode="numeric"
        pattern="\d{7,15}"
        value={values.phone}
        onChange={(v) => update({ phone: v })}
        maxLength={FIELD_LIMITS.phone}
        autoComplete="tel"
        error={phoneError || undefined}
      />

      <SelectField
        label={copy.industry}
        name="industry"
        value={values.industry}
        options={mapOptions(INDUSTRIES, copy.industryOptions)}
        onChange={(v) => update({ industry: v as Step1Company["industry"] })}
        required
        error={industryError || undefined}
      />

      <SelectField
        label={copy.companySize}
        name="companySize"
        value={values.companySize}
        options={mapOptions(COMPANY_SIZES, copy.companySizeOptions)}
        onChange={(v) =>
          update({ companySize: v as Step1Company["companySize"] })
        }
        required
        error={companySizeError || undefined}
      />

      <ComboboxField
        label={copy.country}
        name="country"
        value={values.country}
        options={COUNTRIES}
        onChange={(v) => update({ country: v })}
        maxLength={FIELD_LIMITS.shortText}
        autoComplete="country-name"
      />

      <SelectField
        label={copy.role}
        name="role"
        value={values.role}
        options={mapOptions(ROLES, copy.roleOptions)}
        onChange={(v) => update({ role: v as Step1Company["role"] })}
      />
    </div>
  );
}

export type Step2Copy = {
  title: string;
  description: string;
  crm: string;
  erp: string;
  warehouse: string;
  comms: string;
  ticketing: string;
  identity: string;
  productivity: string;
  customApps: string;
  customAppsOptions: Record<string, string>;
  systemOptions: {
    crm: Record<string, string>;
    erp: Record<string, string>;
    warehouse: Record<string, string>;
    comms: Record<string, string>;
    ticketing: Record<string, string>;
    identity: Record<string, string>;
    productivity: Record<string, string>;
  };
};

export function Step2({
  values,
  update,
  copy,
}: {
  values: Step2Systems;
  update: (patch: Partial<Step2Systems>) => void;
  copy: Step2Copy;
}) {
  return (
    <div className="ob-step">
      <h2 className="ob-step-title">{copy.title}</h2>
      <p className="ob-step-desc">{copy.description}</p>

      <CheckboxGroup
        legend={copy.crm}
        name="crm"
        values={values.crm}
        options={mapOptions(SYSTEM_OPTIONS.crm, copy.systemOptions.crm)}
        onChange={(v) => update({ crm: v })}
      />
      <CheckboxGroup
        legend={copy.erp}
        name="erp"
        values={values.erp}
        options={mapOptions(SYSTEM_OPTIONS.erp, copy.systemOptions.erp)}
        onChange={(v) => update({ erp: v })}
      />
      <CheckboxGroup
        legend={copy.warehouse}
        name="warehouse"
        values={values.warehouse}
        options={mapOptions(
          SYSTEM_OPTIONS.warehouse,
          copy.systemOptions.warehouse
        )}
        onChange={(v) => update({ warehouse: v })}
      />
      <CheckboxGroup
        legend={copy.comms}
        name="comms"
        values={values.comms}
        options={mapOptions(SYSTEM_OPTIONS.comms, copy.systemOptions.comms)}
        onChange={(v) => update({ comms: v })}
      />
      <CheckboxGroup
        legend={copy.ticketing}
        name="ticketing"
        values={values.ticketing}
        options={mapOptions(
          SYSTEM_OPTIONS.ticketing,
          copy.systemOptions.ticketing
        )}
        onChange={(v) => update({ ticketing: v })}
      />
      <CheckboxGroup
        legend={copy.identity}
        name="identity"
        values={values.identity}
        options={mapOptions(
          SYSTEM_OPTIONS.identity,
          copy.systemOptions.identity
        )}
        onChange={(v) => update({ identity: v })}
      />
      <CheckboxGroup
        legend={copy.productivity}
        name="productivity"
        values={values.productivity}
        options={mapOptions(
          SYSTEM_OPTIONS.productivity,
          copy.systemOptions.productivity
        )}
        onChange={(v) => update({ productivity: v })}
      />

      <RadioGroup
        legend={copy.customApps}
        name="customApps"
        value={values.customApps}
        options={mapOptions(CUSTOM_APP_TIERS, copy.customAppsOptions)}
        onChange={(v) =>
          update({ customApps: v as Step2Systems["customApps"] })
        }
      />
    </div>
  );
}

export type Step3Copy = {
  title: string;
  description: string;
  dataLocation: string;
  dataLocationOptions: Record<string, string>;
  dataVolume: string;
  dataVolumeOptions: Record<string, string>;
  documented: string;
  documentedOptions: Record<string, string>;
  integrated: string;
  integratedOptions: Record<string, string>;
  manualWorkflows: string;
  manualWorkflowsHelp: string;
};

export function Step3({
  values,
  update,
  copy,
}: {
  values: Step3Data;
  update: (patch: Partial<Step3Data>) => void;
  copy: Step3Copy;
}) {
  return (
    <div className="ob-step">
      <h2 className="ob-step-title">{copy.title}</h2>
      <p className="ob-step-desc">{copy.description}</p>

      <RadioGroup
        legend={copy.dataLocation}
        name="dataLocation"
        value={values.dataLocation}
        options={mapOptions(DATA_LOCATIONS, copy.dataLocationOptions)}
        onChange={(v) =>
          update({ dataLocation: v as Step3Data["dataLocation"] })
        }
      />

      <RadioGroup
        legend={copy.dataVolume}
        name="dataVolume"
        value={values.dataVolume}
        options={mapOptions(DATA_VOLUMES, copy.dataVolumeOptions)}
        onChange={(v) => update({ dataVolume: v as Step3Data["dataVolume"] })}
      />

      <RadioGroup
        legend={copy.documented}
        name="documented"
        value={values.documented}
        options={mapOptions(DOC_LEVELS, copy.documentedOptions)}
        onChange={(v) => update({ documented: v as Step3Data["documented"] })}
      />

      <RadioGroup
        legend={copy.integrated}
        name="integrated"
        value={values.integrated}
        options={mapOptions(INTEGRATION_LEVELS, copy.integratedOptions)}
        onChange={(v) => update({ integrated: v as Step3Data["integrated"] })}
      />

      <TextAreaField
        label={`${copy.manualWorkflows} — ${copy.manualWorkflowsHelp}`}
        name="manualWorkflows"
        value={values.manualWorkflows}
        onChange={(v) => update({ manualWorkflows: v })}
        maxLength={FIELD_LIMITS.manualWorkflows}
        rows={3}
      />
    </div>
  );
}

export type Step4Copy = {
  title: string;
  description: string;
  currentUse: string;
  currentUseOptions: Record<string, string>;
  priorProjects: string;
  priorProjectsOptions: Record<string, string>;
  talent: string;
  talentOptions: Record<string, string>;
  governance: string;
  governanceOptions: Record<string, string>;
  privacy: string;
  privacyOptions: Record<string, string>;
  llmFamiliarity: string;
  llmFamiliarityOptions: Record<string, string>;
};

export function Step4({
  values,
  update,
  copy,
}: {
  values: Step4AI;
  update: (patch: Partial<Step4AI>) => void;
  copy: Step4Copy;
}) {
  return (
    <div className="ob-step">
      <h2 className="ob-step-title">{copy.title}</h2>
      <p className="ob-step-desc">{copy.description}</p>

      <RadioGroup
        legend={copy.currentUse}
        name="currentUse"
        value={values.currentUse}
        options={mapOptions(AI_USE_LEVELS, copy.currentUseOptions)}
        onChange={(v) => update({ currentUse: v as Step4AI["currentUse"] })}
      />

      <RadioGroup
        legend={copy.priorProjects}
        name="priorProjects"
        value={values.priorProjects}
        options={mapOptions(PRIOR_PROJECT_LEVELS, copy.priorProjectsOptions)}
        onChange={(v) =>
          update({ priorProjects: v as Step4AI["priorProjects"] })
        }
      />

      <RadioGroup
        legend={copy.talent}
        name="talent"
        value={values.talent}
        options={mapOptions(TALENT_LEVELS, copy.talentOptions)}
        onChange={(v) => update({ talent: v as Step4AI["talent"] })}
      />

      <RadioGroup
        legend={copy.governance}
        name="governance"
        value={values.governance}
        options={mapOptions(GOVERNANCE_LEVELS, copy.governanceOptions)}
        onChange={(v) => update({ governance: v as Step4AI["governance"] })}
      />

      <CheckboxGroup
        legend={copy.privacy}
        name="privacy"
        values={values.privacy}
        options={mapOptions(PRIVACY_CONSTRAINTS, copy.privacyOptions)}
        onChange={(v) => update({ privacy: v as Step4AI["privacy"] })}
      />

      <RadioGroup
        legend={copy.llmFamiliarity}
        name="llmFamiliarity"
        value={values.llmFamiliarity}
        options={mapOptions(LLM_FAMILIARITY_LEVELS, copy.llmFamiliarityOptions)}
        onChange={(v) =>
          update({ llmFamiliarity: v as Step4AI["llmFamiliarity"] })
        }
      />
    </div>
  );
}

export type Step5Copy = {
  title: string;
  description: string;
  outcomes: string;
  outcomesOptions: Record<string, string>;
  priorities: string;
  startDate: string;
  startDateOptions: Record<string, string>;
  budget: string;
  budgetOptions: Record<string, string>;
  decisionTimeline: string;
  decisionTimelineOptions: Record<string, string>;
  notes: string;
};

export function Step5({
  values,
  update,
  copy,
}: {
  values: Step5Goals;
  update: (patch: Partial<Step5Goals>) => void;
  copy: Step5Copy;
}) {
  return (
    <div className="ob-step">
      <h2 className="ob-step-title">{copy.title}</h2>
      <p className="ob-step-desc">{copy.description}</p>

      <CheckboxGroup
        legend={copy.outcomes}
        name="outcomes"
        values={values.outcomes}
        options={mapOptions(OUTCOMES, copy.outcomesOptions)}
        onChange={(v) => update({ outcomes: v as Step5Goals["outcomes"] })}
      />

      <TextAreaField
        label={copy.priorities}
        name="priorities"
        value={values.priorities}
        onChange={(v) => update({ priorities: v })}
        maxLength={FIELD_LIMITS.priorities}
        rows={3}
      />

      <RadioGroup
        legend={copy.startDate}
        name="startDate"
        value={values.startDate}
        options={mapOptions(START_DATES, copy.startDateOptions)}
        onChange={(v) => update({ startDate: v as Step5Goals["startDate"] })}
      />

      <RadioGroup
        legend={copy.budget}
        name="budget"
        value={values.budget}
        options={mapOptions(BUDGET_RANGES, copy.budgetOptions)}
        onChange={(v) => update({ budget: v as Step5Goals["budget"] })}
      />

      <RadioGroup
        legend={copy.decisionTimeline}
        name="decisionTimeline"
        value={values.decisionTimeline}
        options={mapOptions(DECISION_TIMELINES, copy.decisionTimelineOptions)}
        onChange={(v) =>
          update({ decisionTimeline: v as Step5Goals["decisionTimeline"] })
        }
      />

      <TextAreaField
        label={copy.notes}
        name="notes"
        value={values.notes}
        onChange={(v) => update({ notes: v })}
        maxLength={FIELD_LIMITS.notes}
        rows={4}
      />
    </div>
  );
}
