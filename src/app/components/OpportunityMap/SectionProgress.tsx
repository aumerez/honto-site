"use client";

import type { OmBoardNode } from "./types";

/**
 * Progress shell: a percentage meter plus a rail of milestone codes that mark
 * done / current / pending state as the user moves through the flow.
 */
export default function SectionProgress({
  label,
  progress,
  nodes,
}: {
  label: string;
  progress: number;
  nodes: OmBoardNode[];
}) {
  return (
    <div className="om-progress" role="group" aria-label={label}>
      <div className="om-progress-head">
        <span className="om-progress-label">{label}</span>
        <span className="om-progress-count">{progress}%</span>
      </div>
      <div
        className="om-progress-meter"
        role="meter"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className="om-progress-meter-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <ol className="om-progress-rail">
        {nodes.map((n) => (
          <li key={n.key} className={`om-progress-step is-${n.status}`}>
            <span className="om-step-dot" aria-hidden="true" />
            <span className="om-step-code">{n.code}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
