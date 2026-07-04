/**
 * Honto AI Readiness Map (internal: Opportunity Map) — shared copy types for
 * the page shell and flow chrome.
 */

import type { ComplexityBand, SignalBand } from "./schema";

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
    resume: string;
    seeReport: string;
    talkToHonto: string;
  };
  signalBands: Record<SignalBand, string>;
  teaser: {
    title: string;
    signalLine: string;
    leverageLead: string;
    prioritize: string;
  };
  gate: { title: string };
  privacy: { line1: string; line2: string; line3: string };
  techNote: string;
  validation: {
    required: string;
    invalidEmail: string;
    invalidUrl: string;
    invalidPhone: string;
  };
  report: {
    title: string;
    intro: string;
    hontoAction: string;
    driversLabel: string;
    scoreOf: string;
    scopeLabel: string;
    complexityLabel: string;
    integrationLabel: string;
    dataLabel: string;
    skippedNote: string;
    emptyMap: string;
    weekLabel: string;
    executiveStrongest: string;
    executiveConstraint: string;
    sequencingLabel: string;
    impact: { low: string; medium: string; high: string; info: string };
    complexityBands: Record<ComplexityBand, string>;
    cards: {
      executive: string;
      signal: string;
      business: string;
      process: string;
      expert: string;
      system: string;
      path: string;
      moves: string;
      plan: string;
      review: string;
    };
    reviewBody: string;
    reviewCta: string;
  };
  sales: { title: string; body: string; cta: string };
};

/** A milestone shown in the progress rail and the system map board. */
export type OmBoardNode = {
  key: string;
  code: string;
  title: string;
  status: "done" | "current" | "pending";
};
