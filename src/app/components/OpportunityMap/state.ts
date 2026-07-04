/**
 * Honto AI Readiness Map — flow state machine (pure, framework-free).
 *
 * The ordered flow reuses `SECTIONS` from the schema (already authored in the
 * authoritative order). Transitions are computed against the effective path,
 * which omits the optional SYSTEM_LANDSCAPE section when the user skips it.
 */

import {
  QUESTION_SECTIONS,
  SECTIONS,
  isBusinessComplete,
  isCompanyProfileComplete,
  isContactComplete,
  isProcessComplete,
  isTeamComplete,
  type OpportunityMapSubmission,
  type QuestionSection,
  type Section,
} from "./schema";

export type FlowState = Section;
export const FLOW_ORDER: readonly FlowState[] = SECTIONS;

/** The traversable path. Skipping the tech stack removes SYSTEM_LANDSCAPE. */
export function flowPath(skipTech: boolean): FlowState[] {
  return skipTech
    ? FLOW_ORDER.filter((s) => s !== "SYSTEM_LANDSCAPE")
    : [...FLOW_ORDER];
}

export function isFlowState(value: unknown): value is FlowState {
  return (
    typeof value === "string" &&
    (FLOW_ORDER as readonly string[]).includes(value)
  );
}

export function nextState(
  current: FlowState,
  skipTech: boolean
): FlowState | null {
  const path = flowPath(skipTech);
  const i = path.indexOf(current);
  if (i < 0 || i >= path.length - 1) return null;
  return path[i + 1];
}

export function prevState(
  current: FlowState,
  skipTech: boolean
): FlowState | null {
  const path = flowPath(skipTech);
  const i = path.indexOf(current);
  if (i <= 0) return null;
  return path[i - 1];
}

/** Only adjacent moves (or a reset to LANDING) are valid. */
export function canTransition(
  from: FlowState,
  to: FlowState,
  skipTech: boolean
): boolean {
  if (to === "LANDING") return true;
  return to === nextState(from, skipTech) || to === prevState(from, skipTech);
}

/** Position-based progress, 0 at LANDING → 100 at SALES_CTA. */
export function progressFor(current: FlowState, skipTech: boolean): number {
  const path = flowPath(skipTech);
  const i = path.indexOf(current);
  if (i <= 0) return 0;
  return Math.round((i / (path.length - 1)) * 100);
}

/** Submission keys that hold per-section answers. */
export const SECTION_KEYS = [
  "company",
  "business",
  "process",
  "team",
  "techStack",
  "contact",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export function sectionCompletion(
  a: OpportunityMapSubmission
): Record<QuestionSection, boolean> {
  return {
    BUSINESS_CONTEXT: isCompanyProfileComplete(a.company),
    BUSINESS_GOALS: isBusinessComplete(a.business),
    PROCESS_DRAG: isProcessComplete(a.process),
    EXPERT_LEVERAGE: isTeamComplete(a.team),
    // Optional section: counts as resolved once skipped or visited.
    SYSTEM_LANDSCAPE: a.techSkipped || a.techStack !== null,
    CONTACT_GATE: isContactComplete(a.contact),
  };
}

export function completedCount(a: OpportunityMapSubmission): number {
  const completion = sectionCompletion(a);
  return QUESTION_SECTIONS.filter((s) => completion[s]).length;
}
