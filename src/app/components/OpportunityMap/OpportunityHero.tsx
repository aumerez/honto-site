"use client";

import type { OmCopy } from "./types";

/**
 * Landing hero for the AI Readiness Map. Editorial headline, technical metadata
 * labels, and a single primary CTA that starts the flow. Privacy microcopy is
 * shown up front so the visitor knows no sensitive data is requested.
 */
export default function OpportunityHero({
  copy,
  onStart,
}: {
  copy: OmCopy;
  onStart: () => void;
}) {
  return (
    <header className="om-hero">
      <span className="om-hero-tag">{copy.tag}</span>
      <p className="om-hero-eyebrow">{copy.eyebrow}</p>
      <h1 className="om-hero-title">{copy.title}</h1>
      <p className="om-hero-subtitle">{copy.subtitle}</p>

      <dl className="om-hero-meta">
        <div className="om-meta-item">
          <dt className="om-meta-label">{copy.meta.timeLabel}</dt>
          <dd className="om-meta-value">{copy.meta.time}</dd>
        </div>
        <div className="om-meta-item">
          <dt className="om-meta-label">{copy.meta.privacyLabel}</dt>
          <dd className="om-meta-value om-meta-privacy">{copy.meta.privacy}</dd>
        </div>
      </dl>

      <div className="om-hero-actions">
        <button type="button" className="btn primary" onClick={onStart}>
          {copy.cta}
        </button>
      </div>
    </header>
  );
}
