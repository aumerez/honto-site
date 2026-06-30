/**
 * Honto AI Readiness Map — analytics event hooks.
 *
 * The app has no analytics provider wired in. This forwards events to an
 * optional global sink (`globalThis.honto.track`) when one is present, and is
 * otherwise a safe no-op that never throws. Only non-identifying metadata is
 * sent — never raw answers, contact details, email, or phone.
 *
 * `send_report_clicked` and `deep_audit_clicked` are intentionally absent: the
 * UI has no corresponding controls.
 */

export type OpportunityMapEvent =
  | "opportunity_map_page_viewed"
  | "opportunity_map_start_clicked"
  | "business_section_completed"
  | "process_section_completed"
  | "team_section_completed"
  | "teaser_result_viewed"
  | "tech_stack_started"
  | "tech_stack_completed"
  | "contact_gate_viewed"
  | "contact_submitted"
  | "report_generated"
  | "review_cta_clicked";

/** Non-identifying metadata only. */
export type OpportunityMapEventMeta = {
  section?: string;
  locale?: string;
  techSkipped?: boolean;
  scoreBand?: string;
  complexityBand?: string;
};

type AnalyticsSink = {
  track?: (event: string, meta?: OpportunityMapEventMeta) => void;
};

export function trackOpportunityMapEvent(
  event: OpportunityMapEvent,
  meta?: OpportunityMapEventMeta
): void {
  try {
    const sink = (globalThis as { honto?: AnalyticsSink }).honto;
    sink?.track?.(event, meta);
  } catch {
    // Analytics must never break the diagnostic flow.
  }
}
