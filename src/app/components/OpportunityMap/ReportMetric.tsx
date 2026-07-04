"use client";

/** A compact label/value metric used across the readiness report. */
export default function ReportMetric({
  label,
  value,
  sub,
}: {
  label?: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="om-rmetric">
      {label ? <span className="om-rmetric-label">{label}</span> : null}
      <span className="om-rmetric-value">
        {value}
        {sub ? <span className="om-rmetric-sub"> {sub}</span> : null}
      </span>
    </div>
  );
}
