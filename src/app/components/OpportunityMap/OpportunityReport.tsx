"use client";

import ReportCard from "./ReportCard";
import ReportMetric from "./ReportMetric";
import ReportActionCard from "./ReportActionCard";
import { generateReport } from "./report";
import type { InsightItem, OpportunityMapSubmission } from "./schema";
import type { OmCopy } from "./types";

const INTEGRATION_DISPLAY: Record<string, string> = {
  high: "Well integrated",
  medium: "Partly integrated",
  low: "Mostly siloed",
  dontKnow: "Unknown",
  "": "Not provided",
};

const DATA_DISPLAY: Record<string, string> = {
  clean: "Clean",
  mixed: "Mixed",
  messy: "Fragmented",
  dontKnow: "Unknown",
  "": "Not provided",
};

/**
 * The readiness report shown after the contact gate. Renders exactly ten
 * numbered sections from the deterministic report data. Tech-skipped and
 * partial-answer paths still produce a complete, lighter-confidence report.
 */
export default function OpportunityReport({
  answers,
  copy,
  onReview,
}: {
  answers: OpportunityMapSubmission;
  copy: OmCopy;
  onReview: () => void;
}) {
  const c = copy.report;
  const r = generateReport(answers);
  const tech = answers.techStack;

  const renderMap = (items: InsightItem[]) =>
    items.length === 0 ? (
      <p className="om-report-empty">{c.emptyMap}</p>
    ) : (
      items.map((it) => (
        <ReportActionCard
          key={it.key}
          label={it.label}
          impact={c.impact[it.impact]}
          action={it.action}
          actionLabel={c.hontoAction}
        />
      ))
    );

  return (
    <div className="om-report">
      <p className="om-report-intro">{c.intro}</p>

      <ReportCard
        code="[01]"
        title={c.cards.executive}
        impact={copy.signalBands[r.signal.band]}
      >
        <p>{r.executive.summary}</p>
        <div className="om-report-metrics">
          <ReportMetric
            label={c.executiveStrongest}
            value={r.executive.strongest}
          />
          <ReportMetric
            label={c.executiveConstraint}
            value={r.executive.constraint}
          />
        </div>
      </ReportCard>

      <ReportCard code="[02]" title={c.cards.signal}>
        <div className="om-report-metrics">
          <ReportMetric
            label={c.cards.signal}
            value={String(r.signal.score)}
            sub={c.scoreOf}
          />
          <ReportMetric value={copy.signalBands[r.signal.band]} />
        </div>
        <p>{r.signal.explanation}</p>
        <h4 className="om-report-h4">{c.driversLabel}</h4>
        <ul className="om-report-list">
          {r.signal.factors.map((f) => (
            <li key={f.key}>{f.label}</li>
          ))}
        </ul>
      </ReportCard>

      <ReportCard code="[03]" title={c.cards.business}>
        {renderMap(r.insights.businessLeverage)}
      </ReportCard>

      <ReportCard code="[04]" title={c.cards.process}>
        {renderMap(r.insights.processDrag)}
      </ReportCard>

      <ReportCard code="[05]" title={c.cards.expert}>
        {renderMap(r.insights.expertLeverage)}
      </ReportCard>

      <ReportCard code="[06]" title={c.cards.system}>
        <p>{r.insights.systemReadiness.summary}</p>
        {r.techSkipped ? (
          <p className="om-report-note">{c.skippedNote}</p>
        ) : (
          <div className="om-report-metrics">
            <ReportMetric
              label={c.integrationLabel}
              value={
                INTEGRATION_DISPLAY[tech?.integrationReadiness ?? ""] ?? "—"
              }
            />
            <ReportMetric
              label={c.dataLabel}
              value={DATA_DISPLAY[tech?.dataReadiness ?? ""] ?? "—"}
            />
          </div>
        )}
        {renderMap(r.insights.systemReadiness.items)}
      </ReportCard>

      <ReportCard code="[07]" title={c.cards.path}>
        <div className="om-report-metrics">
          <ReportMetric
            label={c.complexityLabel}
            value={c.complexityBands[r.complexity.band]}
          />
          <ReportMetric
            label={c.scopeLabel}
            value={r.complexity.estimatedFirstPhase}
          />
        </div>
        <h4 className="om-report-h4">{c.driversLabel}</h4>
        <ul className="om-report-list">
          {r.complexity.reasons.map((f) => (
            <li key={f.key}>{f.label}</li>
          ))}
        </ul>
        <h4 className="om-report-h4">{c.sequencingLabel}</h4>
        <ol className="om-report-sequence">
          {r.firstMoves.map((move) => (
            <li key={move}>{move}</li>
          ))}
        </ol>
      </ReportCard>

      <ReportCard code="[08]" title={c.cards.moves}>
        <ol className="om-report-moves">
          {r.firstMoves.map((move) => (
            <li key={move}>{move}</li>
          ))}
        </ol>
      </ReportCard>

      <ReportCard code="[09]" title={c.cards.plan}>
        <div className="om-report-weeks">
          {r.thirtyDayPlan.map((w) => (
            <div key={w.week} className="om-report-week">
              <span className="om-report-week-label">
                {c.weekLabel.replace("{n}", String(w.week))}
              </span>
              <span className="om-report-week-focus">{w.focus}</span>
              <p className="om-report-week-detail">{w.detail}</p>
            </div>
          ))}
        </div>
      </ReportCard>

      <ReportCard code="[10]" title={c.cards.review}>
        <p>{c.reviewBody}</p>
        <button type="button" className="btn primary" onClick={onReview}>
          {c.reviewCta}
        </button>
      </ReportCard>
    </div>
  );
}
