'use client';

import { useState } from 'react';
import { USE_CASES, USE_CASE_TOTAL } from '@/lib/useCases';

export function UseCases() {
  const [active, setActive] = useState(0);
  const group = USE_CASES[active];
  return (
    <section id="use-cases" className="section section-soft">
      <div className="container stack" style={{ gap: 36 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
          <h2 className="h2">Where it pays off.</h2>
          <p className="lead">{USE_CASE_TOTAL} ways to start. Pick the one that hurts most.</p>
        </div>
        <div role="tablist" aria-label="Business areas" className="row" style={{ gap: 10 }}>
          {USE_CASES.map((g, i) => (
            <button
              key={g.name}
              type="button"
              role="tab"
              id={`uc-tab-${i}`}
              aria-selected={i === active}
              aria-controls="uc-panel"
              className="tab"
              onClick={() => setActive(i)}
            >
              {g.name} <span style={{ opacity: 0.6, fontWeight: 500, marginLeft: 4 }}>{g.items.length}</span>
            </button>
          ))}
        </div>
        <div
          id="uc-panel"
          role="tabpanel"
          aria-labelledby={`uc-tab-${active}`}
          className="grid-auto"
          style={{ ['--min' as string]: '260px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}
        >
          {group.items.map(([area, title, desc]) => (
            <a key={area} href="/book" className="case-card">
              <span className="label-mustard">{area.toUpperCase()}</span>
              <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' }}>{title}</span>
              <span style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--muted)' }}>{desc}</span>
              <span className="more">See how →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
