"use client";

import type { OmBoardNode } from "./types";

/**
 * Sticky right-side system map. Each node reflects its section's status and can
 * be clicked to jump back to an already-visited section.
 */
export default function OpportunityBoard({
  title,
  subtitle,
  emptyLabel,
  nodes,
  onSelect,
}: {
  title: string;
  subtitle: string;
  emptyLabel: string;
  nodes: OmBoardNode[];
  onSelect?: (key: string) => void;
}) {
  return (
    <aside className="om-board" aria-label={title}>
      <div className="om-board-head">
        <span className="om-board-title">{title}</span>
        <p className="om-board-sub">{subtitle}</p>
      </div>
      <ul className="om-board-nodes">
        {nodes.map((n) => (
          <li key={n.key}>
            <button
              type="button"
              className={`om-board-node is-${n.status}`}
              onClick={() => onSelect?.(n.key)}
              disabled={!onSelect || n.status === "pending"}
            >
              <span className="om-node-code">{n.code}</span>
              <span className="om-node-label">{n.title}</span>
              <span className="om-node-state">
                {n.status === "pending" ? emptyLabel : n.status}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
