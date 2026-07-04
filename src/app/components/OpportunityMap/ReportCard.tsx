"use client";

import type { ReactNode } from "react";

/**
 * A numbered report section card: numbered label, title, optional impact chip,
 * body, and an optional suggested-action footer.
 */
export default function ReportCard({
  code,
  title,
  impact,
  action,
  actionLabel,
  children,
}: {
  code: string;
  title: string;
  impact?: string;
  action?: string;
  actionLabel?: string;
  children: ReactNode;
}) {
  return (
    <section className="om-rcard">
      <header className="om-rcard-head">
        <span className="om-rcard-code">{code}</span>
        <h3 className="om-rcard-title">{title}</h3>
        {impact ? <span className="om-rcard-impact">{impact}</span> : null}
      </header>
      <div className="om-rcard-body">{children}</div>
      {action ? (
        <p className="om-rcard-action">
          <span className="om-rcard-action-label">{actionLabel}</span> {action}
        </p>
      ) : null}
    </section>
  );
}
