/**
 * Honto AI Readiness Map — internal lead notification builder.
 *
 * Maps a validated submission and its server-derived report into the internal
 * lead summary (subject + plain text + HTML). Deterministic; no I/O.
 */

import {
  TECH_CATEGORIES,
  otherKeyFor,
  type OpportunityMapSubmission,
  type OpportunityReport,
} from "./schema";

export type LeadEmail = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

function joinList(values: readonly string[]): string {
  return values.length ? values.join(", ") : "—";
}

function currentStack(submission: OpportunityMapSubmission): string {
  if (submission.techSkipped || !submission.techStack) return "Skipped";
  const t = submission.techStack;
  const all = [
    ...t.crm,
    ...t.erp,
    ...t.warehouse,
    ...t.comms,
    ...t.ticketing,
    ...t.identity,
    ...t.productivity,
    ...t.databases,
    ...t.customApps,
  ].filter((v) => v !== "none");
  const parts = all.length ? [all.join(", ")] : [];
  const others = TECH_CATEGORIES.map((c) => t[otherKeyFor(c)].trim()).filter(
    (v) => v.length > 0
  );
  if (others.length) parts.push(`other: ${others.join(", ")}`);
  return parts.length ? parts.join("; ") : "—";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Row = [label: string, value: string];

function rows(
  submission: OpportunityMapSubmission,
  report: OpportunityReport
): Row[] {
  const s = submission;
  const tech = s.techStack;
  return [
    ["Company", s.company.companyName],
    ["Contact", s.contact.contactName],
    ["Email", s.contact.email],
    ["Role", s.contact.role || "—"],
    ["Website", s.company.website || "—"],
    ["Industry", s.company.industry || "—"],
    ["Company size", s.company.companySize || "—"],
    ["Stage", s.company.stage || "—"],
    ["Main problem", s.company.mainPressure || "—"],
    ["Business goals", joinList(s.business.priorityOutcomes)],
    ["Manual work level", s.process.manualWorkLevel || "—"],
    ["Most overloaded areas", joinList(s.team.overloadedFunctions)],
    ["Current stack", currentStack(s)],
    ["Integration readiness", tech?.integrationReadiness || "Not provided"],
    ["Data readiness", tech?.dataReadiness || "Not provided"],
    [
      "Security requirement",
      tech ? joinList(tech.securityRequirements) : "Not provided",
    ],
    [
      "AI opportunity signal",
      `${report.signal.score}/100 (${report.signal.band})`,
    ],
    ["Implementation complexity", report.complexity.band],
    ["Estimated first phase", report.complexity.estimatedFirstPhase],
    ["Top 3 first moves", report.firstMoves.join(" · ")],
    ["Suggested sales angle", report.salesAngle],
    ["Suggested first review/demo", report.demoScenario],
  ];
}

function render(
  subject: string,
  dataRows: Row[]
): { text: string; html: string } {
  const text = dataRows
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
  const htmlRows = dataRows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6f6960;vertical-align:top;white-space:nowrap">${escapeHtml(
          label
        )}</td><td style="padding:6px 0;vertical-align:top">${escapeHtml(
          value
        )}</td></tr>`
    )
    .join("");
  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5;color:#161513;max-width:680px">
      <h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(subject)}</h1>
      <table style="border-collapse:collapse;width:100%;font-size:14px">${htmlRows}</table>
    </div>
  `.trim();
  return { text, html };
}

/** The full lead notification, sent once the contact gate is completed. */
export function buildLeadEmail(
  submission: OpportunityMapSubmission,
  report: OpportunityReport
): LeadEmail {
  const subject = `New Honto AI Readiness Lead — ${submission.company.companyName} — Signal ${report.signal.score}/100`;
  return {
    subject,
    ...render(subject, rows(submission, report)),
    replyTo: submission.contact.email,
  };
}

/** The early notification, sent once the business sections are completed. */
export function buildBusinessEmail(
  submission: OpportunityMapSubmission
): LeadEmail {
  const s = submission;
  const subject = `New Honto AI Readiness — ${s.company.companyName} — business context`;
  const dataRows: Row[] = [
    ["Company", s.company.companyName],
    ["Website", s.company.website || "—"],
    ["Industry", s.company.industry || "—"],
    ["Company size", s.company.companySize || "—"],
    ["Stage", s.company.stage || "—"],
    ["Main problem", s.company.mainPressure || "—"],
    ["Business goals", joinList(s.business.priorityOutcomes)],
    ["Most urgent area", s.business.urgentArea || "—"],
    ["Timeframe", s.business.timeframe || "—"],
  ];
  return { subject, ...render(subject, dataRows) };
}
