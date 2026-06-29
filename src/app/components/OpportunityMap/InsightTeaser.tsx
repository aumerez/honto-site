"use client";

import { computeSignal } from "./scoring";
import { generateInsights } from "./insights";
import type { OpportunityMapSubmission, SignalBand } from "./schema";

/**
 * Directional teaser shown before contact capture. Uses the scoring and insight
 * modules to surface a band and the strongest leverage signal — without
 * revealing the full report or implying any system was accessed.
 */
export default function InsightTeaser({
  answers,
  bands,
  signalLine,
  leverageLead,
  prioritize,
}: {
  answers: OpportunityMapSubmission;
  bands: Record<SignalBand, string>;
  signalLine: string;
  leverageLead: string;
  prioritize: string;
}) {
  const signal = computeSignal(answers);
  const insights = generateInsights(answers);
  const top =
    insights.businessLeverage[0] ??
    insights.processDrag[0] ??
    insights.expertLeverage[0] ??
    null;

  return (
    <div className="om-teaser">
      <p className="om-teaser-band">
        {signalLine.replace("{band}", bands[signal.band])}
      </p>
      {top ? (
        <p className="om-teaser-lead">
          <strong>{leverageLead}</strong> {top.label}
        </p>
      ) : null}
      <p className="om-stage-body">{prioritize}</p>
    </div>
  );
}
