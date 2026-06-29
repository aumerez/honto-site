"use client";

/** A leverage/drag item: a finding paired with a suggested Honto action. */
export default function ReportActionCard({
  label,
  impact,
  action,
  actionLabel,
}: {
  label: string;
  impact?: string;
  action: string;
  actionLabel: string;
}) {
  return (
    <div className="om-racard">
      <div className="om-racard-head">
        <span className="om-racard-label">{label}</span>
        {impact ? <span className="om-racard-impact">{impact}</span> : null}
      </div>
      <p className="om-racard-action">
        <span className="om-rcard-action-label">{actionLabel}</span> {action}
      </p>
    </div>
  );
}
