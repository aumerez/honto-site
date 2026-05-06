"use client";

import {
  computeNarrative,
  computeScore,
  computeSizing,
  DIMENSION_WEIGHTS,
  DIMENSIONS,
  type Band,
  type Dimension,
  type GapKey,
  type Size,
  type StrengthKey,
} from "./scoring";
import type { Answers } from "./schema";

export type ResultsCopy = {
  eyebrow: string;
  scoreOf: string;
  bandLabels: Record<Band, string>;
  dimensionsHeading: string;
  dimensionLabels: Record<Dimension, string>;
  sizingHeading: string;
  sizeLabels: Record<Size, string>;
  weeksRange: string;
  weeksOpen: string;
  narrativeHeading: string;
  strengthsHeading: string;
  gapsHeading: string;
  strengthLabels: Record<StrengthKey, string>;
  gapLabels: Record<GapKey, string>;
  noNotablePoints: string;
  downloadScore: string;
  bookFollowUp: string;
  generatedOn: string;
  printDateLocale: string;
};

function formatRange(
  template: string,
  min: number,
  max: number | null,
  openTemplate: string
): string {
  if (max == null) {
    return openTemplate.replace("{min}", String(min));
  }
  return template.replace("{min}", String(min)).replace("{max}", String(max));
}

export function Results({
  answers,
  copy,
  onBookFollowUp,
}: {
  answers: Answers;
  copy: ResultsCopy;
  onBookFollowUp: () => void;
}) {
  const score = computeScore(answers);
  const sizing = computeSizing(answers);
  const narrative = computeNarrative(score);

  const generatedOn = new Date().toLocaleDateString(copy.printDateLocale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="ob-results">
      <header className="ob-results-header">
        <p className="eyebrow">{copy.eyebrow}</p>
        <div className="ob-score">
          <span className="ob-score-num">{score.total}</span>
          <span className="ob-score-of">{copy.scoreOf}</span>
        </div>
        <p className="ob-band">{copy.bandLabels[score.band]}</p>
      </header>

      <section className="ob-results-section" aria-labelledby="ob-dim-h">
        <h3 id="ob-dim-h" className="ob-results-h3">
          {copy.dimensionsHeading}
        </h3>
        <ul className="ob-dim-list">
          {DIMENSIONS.map((d) => {
            const value = score.dimensions[d];
            const weight = DIMENSION_WEIGHTS[d];
            const pct = Math.round((value / weight) * 100);
            return (
              <li key={d} className="ob-dim-row">
                <span className="ob-dim-label">{copy.dimensionLabels[d]}</span>
                <div
                  className="ob-dim-bar"
                  role="meter"
                  aria-valuenow={value}
                  aria-valuemin={0}
                  aria-valuemax={weight}
                  aria-label={copy.dimensionLabels[d]}
                >
                  <div
                    className="ob-dim-bar-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="ob-dim-value">
                  {value} / {weight}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="ob-results-section" aria-labelledby="ob-size-h">
        <h3 id="ob-size-h" className="ob-results-h3">
          {copy.sizingHeading}
        </h3>
        <p className="ob-size-line">
          <span className="ob-size-tag">{copy.sizeLabels[sizing.size]}</span>
          <span className="ob-size-weeks">
            {formatRange(
              copy.weeksRange,
              sizing.weeksMin,
              sizing.weeksMax,
              copy.weeksOpen
            )}
          </span>
        </p>
      </section>

      <section className="ob-results-section" aria-labelledby="ob-narr-h">
        <h3 id="ob-narr-h" className="ob-results-h3">
          {copy.narrativeHeading}
        </h3>
        <div className="ob-narrative">
          <div>
            <p className="ob-narr-sub">{copy.strengthsHeading}</p>
            {narrative.strengths.length === 0 ? (
              <p className="ob-narr-empty">{copy.noNotablePoints}</p>
            ) : (
              <ul className="ob-narr-list">
                {narrative.strengths.map((s) => (
                  <li key={s}>{copy.strengthLabels[s]}</li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="ob-narr-sub">{copy.gapsHeading}</p>
            {narrative.gaps.length === 0 ? (
              <p className="ob-narr-empty">{copy.noNotablePoints}</p>
            ) : (
              <ul className="ob-narr-list">
                {narrative.gaps.map((g) => (
                  <li key={g}>{copy.gapLabels[g]}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <p className="ob-print-date">
        {copy.generatedOn} {generatedOn}
      </p>

      <div className="ob-results-actions">
        <button
          type="button"
          className="btn primary"
          onClick={() => window.print()}
        >
          {copy.downloadScore}
        </button>
        <button type="button" className="btn" onClick={onBookFollowUp}>
          {copy.bookFollowUp}
        </button>
      </div>
    </article>
  );
}
