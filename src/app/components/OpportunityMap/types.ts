/**
 * Honto AI Readiness Map (internal: Opportunity Map) — shared copy types.
 *
 * Phase 1 foundation: types for the static page shell only. Scoring, questions,
 * persistence, and the live flow are added in later prompts.
 */

export type OmSectionCopy = {
  code: string;
  title: string;
  summary: string;
};

export type OmSectionKey =
  | "businessContext"
  | "businessGoals"
  | "processDrag"
  | "expertLeverage"
  | "systemLandscape"
  | "report";

export type OmCopy = {
  eyebrow: string;
  tag: string;
  title: string;
  subtitle: string;
  meta: {
    timeLabel: string;
    time: string;
    privacyLabel: string;
    privacy: string;
  };
  cta: string;
  flowHeading: string;
  flowIntro: string;
  progress: { label: string };
  status: { pending: string };
  board: {
    title: string;
    subtitle: string;
    empty: string;
  };
  sections: Record<OmSectionKey, OmSectionCopy>;
  controls: {
    start: string;
    back: string;
    next: string;
    skip: string;
    startOver: string;
  };
  placeholders: {
    section: string;
    teaserTitle: string;
    teaserBody: string;
    gateTitle: string;
    gateBody: string;
    reportTitle: string;
    reportBody: string;
  };
};

/** A milestone shown in the progress rail and the system map board. */
export type OmBoardNode = {
  key: string;
  code: string;
  title: string;
  status: "done" | "current" | "pending";
};
