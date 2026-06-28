/**
 * Honto AI Readiness Map — migration-safe localStorage persistence.
 *
 * Reads tolerate missing data, malformed JSON, an older/absent version, and
 * partial sessions — none of these throw or crash the page; they fall back to a
 * fresh start. Writes go through `mergeAnswers`, which only copies known,
 * approved fields, so no banned/unknown data is ever persisted.
 */

import {
  EMPTY_BUSINESS,
  EMPTY_COMPANY,
  EMPTY_CONTACT,
  EMPTY_PROCESS,
  EMPTY_TEAM,
  EMPTY_TECH_STACK,
  type OpportunityMapSubmission,
} from "./schema";
import { isFlowState, type FlowState } from "./state";

export const STORAGE_KEY = "honto-opportunity-map-v1";
export const STORAGE_VERSION = 1;

export type PersistedFlow = {
  version: number;
  state: FlowState;
  answers: OpportunityMapSubmission;
};

/** Copy only the keys present in `empty`, with type-correct values (else default). */
function pickSection<T extends Record<string, unknown>>(
  empty: T,
  raw: unknown
): T {
  const out: Record<string, unknown> = {};
  const source =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  for (const key of Object.keys(empty)) {
    const def = (empty as Record<string, unknown>)[key];
    const val = source[key];
    if (Array.isArray(def)) {
      out[key] = Array.isArray(val)
        ? val.filter((x) => typeof x === "string")
        : [...def];
    } else if (typeof def === "boolean") {
      out[key] = typeof val === "boolean" ? val : def;
    } else {
      out[key] = typeof val === "string" ? val : def;
    }
  }
  return out as T;
}

/** Rebuild a clean submission from arbitrary input, dropping unknown fields. */
export function mergeAnswers(raw: unknown): OpportunityMapSubmission {
  const r =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const techSkipped = r.techSkipped === true;
  const techStack =
    techSkipped || r.techStack == null
      ? null
      : pickSection(EMPTY_TECH_STACK, r.techStack);
  return {
    company: pickSection(EMPTY_COMPANY, r.company),
    business: pickSection(EMPTY_BUSINESS, r.business),
    process: pickSection(EMPTY_PROCESS, r.process),
    team: pickSection(EMPTY_TEAM, r.team),
    techStack,
    techSkipped,
    contact: pickSection(EMPTY_CONTACT, r.contact),
  };
}

export function freshAnswers(): OpportunityMapSubmission {
  return mergeAnswers({});
}

export function loadFlow(): PersistedFlow | null {
  if (typeof window === "undefined") return null;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null; // malformed JSON
  }
  if (!parsed || typeof parsed !== "object") return null;

  const p = parsed as Record<string, unknown>;
  if (p.version !== STORAGE_VERSION) return null; // old / missing version → fresh

  const state = isFlowState(p.state) ? p.state : "LANDING";
  return { version: STORAGE_VERSION, state, answers: mergeAnswers(p.answers) };
}

export function saveFlow(
  state: FlowState,
  answers: OpportunityMapSubmission
): void {
  if (typeof window === "undefined") return;
  // Re-pick to guarantee only approved fields are written.
  const payload: PersistedFlow = {
    version: STORAGE_VERSION,
    state,
    answers: mergeAnswers(answers),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage unavailable or full — fail silently
  }
}

export function clearFlow(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
