import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  AI_USE_LEVELS,
  BUDGET_RANGES,
  COMPANY_SIZES,
  CUSTOM_APP_TIERS,
  DATA_LOCATIONS,
  DATA_VOLUMES,
  DECISION_TIMELINES,
  DOC_LEVELS,
  FIELD_LIMITS,
  GOVERNANCE_LEVELS,
  INDUSTRIES,
  INTEGRATION_LEVELS,
  LLM_FAMILIARITY_LEVELS,
  OUTCOMES,
  PRIOR_PROJECT_LEVELS,
  PRIVACY_CONSTRAINTS,
  ROLES,
  START_DATES,
  SYSTEM_OPTIONS,
  TALENT_LEVELS,
  type Answers,
} from "@/app/components/Onboarding/schema";
import {
  computeScore,
  computeSizing,
} from "@/app/components/Onboarding/scoring";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{7,15}$/;

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 2;
const rateLimitBuckets = new Map<string, number[]>();

export function __resetRateLimitForTest() {
  rateLimitBuckets.clear();
}

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri.trim();
  return "unknown";
}

function checkRateLimit(
  ip: string,
  now: number
): { ok: true } | { ok: false; retryAfterSec: number } {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const prior = rateLimitBuckets.get(ip) ?? [];
  const recent = prior.filter((t) => t > windowStart);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitBuckets.set(ip, recent);
    const retryAfterMs = recent[0]! + RATE_LIMIT_WINDOW_MS - now;
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }
  recent.push(now);
  rateLimitBuckets.set(ip, recent);
  return { ok: true };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function trimmedString(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  const t = v.trim();
  return t.length > max ? "" : t;
}

function tooLong(v: unknown, max: number): boolean {
  return typeof v === "string" && v.trim().length > max;
}

function asEnum<T extends string>(v: unknown, allowed: readonly T[]): T | "" {
  if (typeof v !== "string") return "";
  return (allowed as readonly string[]).includes(v) ? (v as T) : "";
}

function asEnumArray<T extends string>(v: unknown, allowed: readonly T[]): T[] {
  if (!Array.isArray(v)) return [];
  const set = new Set<string>(allowed);
  return v.filter((x): x is T => typeof x === "string" && set.has(x));
}

type NormalizeResult =
  | { ok: true; answers: Answers }
  | { ok: false; reason: string };

function normalizeAnswers(raw: unknown): NormalizeResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, reason: "Invalid payload." };
  }
  const r = raw as Record<string, unknown>;

  const s1 = (r.step1 ?? {}) as Record<string, unknown>;
  if (
    tooLong(s1.companyName, FIELD_LIMITS.shortText) ||
    tooLong(s1.contactName, FIELD_LIMITS.shortText) ||
    tooLong(s1.email, FIELD_LIMITS.email) ||
    tooLong(s1.phone, FIELD_LIMITS.phone) ||
    tooLong(s1.country, FIELD_LIMITS.shortText)
  ) {
    return { ok: false, reason: "A field exceeds its allowed length." };
  }

  const step1 = {
    companyName: trimmedString(s1.companyName, FIELD_LIMITS.shortText),
    contactName: trimmedString(s1.contactName, FIELD_LIMITS.shortText),
    email: trimmedString(s1.email, FIELD_LIMITS.email),
    phone: trimmedString(s1.phone, FIELD_LIMITS.phone),
    industry: asEnum(s1.industry, INDUSTRIES),
    companySize: asEnum(s1.companySize, COMPANY_SIZES),
    country: trimmedString(s1.country, FIELD_LIMITS.shortText),
    role: asEnum(s1.role, ROLES),
  };

  if (!step1.companyName || !step1.contactName) {
    return { ok: false, reason: "Company and contact name are required." };
  }
  if (!step1.email || !EMAIL_RE.test(step1.email)) {
    return { ok: false, reason: "A valid email is required." };
  }
  if (step1.phone && !PHONE_RE.test(step1.phone)) {
    return { ok: false, reason: "Phone must be 7–15 digits, numbers only." };
  }
  if (!step1.industry || !step1.companySize) {
    return { ok: false, reason: "Industry and company size are required." };
  }

  const s2 = (r.step2 ?? {}) as Record<string, unknown>;
  const step2: Answers["step2"] = {
    crm: asEnumArray(s2.crm, SYSTEM_OPTIONS.crm),
    erp: asEnumArray(s2.erp, SYSTEM_OPTIONS.erp),
    warehouse: asEnumArray(s2.warehouse, SYSTEM_OPTIONS.warehouse),
    comms: asEnumArray(s2.comms, SYSTEM_OPTIONS.comms),
    ticketing: asEnumArray(s2.ticketing, SYSTEM_OPTIONS.ticketing),
    identity: asEnumArray(s2.identity, SYSTEM_OPTIONS.identity),
    productivity: asEnumArray(s2.productivity, SYSTEM_OPTIONS.productivity),
    customApps: asEnum(s2.customApps, CUSTOM_APP_TIERS),
  };

  const s3 = (r.step3 ?? {}) as Record<string, unknown>;
  if (tooLong(s3.manualWorkflows, FIELD_LIMITS.manualWorkflows)) {
    return { ok: false, reason: "A field exceeds its allowed length." };
  }
  const step3 = {
    dataLocation: asEnum(s3.dataLocation, DATA_LOCATIONS),
    dataVolume: asEnum(s3.dataVolume, DATA_VOLUMES),
    documented: asEnum(s3.documented, DOC_LEVELS),
    integrated: asEnum(s3.integrated, INTEGRATION_LEVELS),
    manualWorkflows: trimmedString(
      s3.manualWorkflows,
      FIELD_LIMITS.manualWorkflows
    ),
  };

  const s4 = (r.step4 ?? {}) as Record<string, unknown>;
  const step4 = {
    currentUse: asEnum(s4.currentUse, AI_USE_LEVELS),
    priorProjects: asEnum(s4.priorProjects, PRIOR_PROJECT_LEVELS),
    talent: asEnum(s4.talent, TALENT_LEVELS),
    governance: asEnum(s4.governance, GOVERNANCE_LEVELS),
    privacy: asEnumArray(s4.privacy, PRIVACY_CONSTRAINTS),
    llmFamiliarity: asEnum(s4.llmFamiliarity, LLM_FAMILIARITY_LEVELS),
  };

  const s5 = (r.step5 ?? {}) as Record<string, unknown>;
  if (
    tooLong(s5.priorities, FIELD_LIMITS.priorities) ||
    tooLong(s5.notes, FIELD_LIMITS.notes)
  ) {
    return { ok: false, reason: "A field exceeds its allowed length." };
  }
  const step5 = {
    outcomes: asEnumArray(s5.outcomes, OUTCOMES),
    priorities: trimmedString(s5.priorities, FIELD_LIMITS.priorities),
    startDate: asEnum(s5.startDate, START_DATES),
    budget: asEnum(s5.budget, BUDGET_RANGES),
    decisionTimeline: asEnum(s5.decisionTimeline, DECISION_TIMELINES),
    notes: trimmedString(s5.notes, FIELD_LIMITS.notes),
  };

  return { ok: true, answers: { step1, step2, step3, step4, step5 } };
}

function joinList(values: readonly string[]): string {
  return values.length ? values.join(", ") : "—";
}

function weekLabel(weeksMin: number, weeksMax: number | null): string {
  return weeksMax === null
    ? `${weeksMin}+ weeks`
    : `${weeksMin}–${weeksMax} weeks`;
}

function htmlRow(label: string, value: string): string {
  const v = value || "—";
  return `<tr><td style="padding:6px 16px 6px 0;color:#6f6960;vertical-align:top;white-space:nowrap">${escapeHtml(
    label
  )}</td><td style="padding:6px 0;vertical-align:top">${escapeHtml(v)}</td></tr>`;
}

function htmlSection(title: string, rows: string): string {
  return `
    <h2 style="font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#6f6960;margin:28px 0 8px">${escapeHtml(
      title
    )}</h2>
    <table style="border-collapse:collapse;width:100%;font-size:14px">${rows}</table>
  `;
}

function buildHtml(
  answers: Answers,
  score: ReturnType<typeof computeScore>,
  sizing: ReturnType<typeof computeSizing>
): string {
  const sizingLabel = weekLabel(sizing.weeksMin, sizing.weeksMax);

  const contactRows = [
    htmlRow("Company", answers.step1.companyName),
    htmlRow("Contact", answers.step1.contactName),
    htmlRow("Email", answers.step1.email),
    answers.step1.phone ? htmlRow("Phone", answers.step1.phone) : "",
    htmlRow("Industry", answers.step1.industry),
    htmlRow("Company size", answers.step1.companySize),
    answers.step1.country ? htmlRow("Country", answers.step1.country) : "",
    answers.step1.role ? htmlRow("Role", answers.step1.role) : "",
  ].join("");

  const systemsRows = [
    htmlRow("CRM", joinList(answers.step2.crm)),
    htmlRow("ERP", joinList(answers.step2.erp)),
    htmlRow("Warehouse", joinList(answers.step2.warehouse)),
    htmlRow("Comms", joinList(answers.step2.comms)),
    htmlRow("Ticketing", joinList(answers.step2.ticketing)),
    htmlRow("Identity", joinList(answers.step2.identity)),
    htmlRow("Productivity", joinList(answers.step2.productivity)),
    htmlRow("Custom apps", answers.step2.customApps),
  ].join("");

  const dataRows = [
    htmlRow("Location", answers.step3.dataLocation),
    htmlRow("Volume", answers.step3.dataVolume),
    htmlRow("Documented", answers.step3.documented),
    htmlRow("Integrated", answers.step3.integrated),
    answers.step3.manualWorkflows
      ? htmlRow("Manual workflows", answers.step3.manualWorkflows)
      : "",
  ].join("");

  const aiRows = [
    htmlRow("Current use", answers.step4.currentUse),
    htmlRow("Prior projects", answers.step4.priorProjects),
    htmlRow("Talent", answers.step4.talent),
    htmlRow("Governance", answers.step4.governance),
    htmlRow("Privacy", joinList(answers.step4.privacy)),
    htmlRow("LLM familiarity", answers.step4.llmFamiliarity),
  ].join("");

  const goalsRows = [
    htmlRow("Outcomes", joinList(answers.step5.outcomes)),
    answers.step5.priorities
      ? htmlRow("Priorities", answers.step5.priorities)
      : "",
    htmlRow("Start date", answers.step5.startDate),
    htmlRow("Budget", answers.step5.budget),
    htmlRow("Decision timeline", answers.step5.decisionTimeline),
    answers.step5.notes ? htmlRow("Notes", answers.step5.notes) : "",
  ].join("");

  return `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5;color:#161513;max-width:680px">
      <h1 style="font-size:22px;margin:0 0 4px">AI Readiness Submission</h1>
      <p style="margin:0 0 24px;color:#6f6960">${escapeHtml(
        answers.step1.companyName
      )} · ${escapeHtml(answers.step1.contactName)}</p>

      <div style="background:#f5f3ee;border-radius:10px;padding:20px;margin-bottom:8px;display:flex;gap:48px;flex-wrap:wrap">
        <div>
          <div style="font-size:11px;color:#6f6960;text-transform:uppercase;letter-spacing:0.08em">Score</div>
          <div style="font-size:28px;font-weight:600;line-height:1.1;margin-top:4px">${score.total}<span style="color:#6f6960;font-size:18px;font-weight:400">/100</span></div>
          <div style="font-size:13px;color:#6f6960;margin-top:2px">${escapeHtml(
            score.band
          )}</div>
        </div>
        <div>
          <div style="font-size:11px;color:#6f6960;text-transform:uppercase;letter-spacing:0.08em">Sizing</div>
          <div style="font-size:28px;font-weight:600;line-height:1.1;margin-top:4px">${escapeHtml(
            sizing.size
          )}</div>
          <div style="font-size:13px;color:#6f6960;margin-top:2px">${escapeHtml(
            sizingLabel
          )}</div>
        </div>
      </div>

      ${htmlSection("Contact", contactRows)}
      ${htmlSection("Systems", systemsRows)}
      ${htmlSection("Data", dataRows)}
      ${htmlSection("AI maturity", aiRows)}
      ${htmlSection("Goals", goalsRows)}

      <p style="margin-top:32px;font-size:12px;color:#6f6960">Raw answers attached as JSON.</p>
    </div>
  `.trim();
}

function buildText(
  answers: Answers,
  score: ReturnType<typeof computeScore>,
  sizing: ReturnType<typeof computeSizing>
): string {
  const sizingLabel = weekLabel(sizing.weeksMin, sizing.weeksMax);
  const lines: (string | null)[] = [
    "AI Readiness Submission",
    "",
    `Score: ${score.total}/100 (${score.band})`,
    `Sizing: ${sizing.size} — ${sizingLabel}`,
    "",
    "— Contact —",
    `Company: ${answers.step1.companyName}`,
    `Contact: ${answers.step1.contactName}`,
    `Email: ${answers.step1.email}`,
    answers.step1.phone ? `Phone: ${answers.step1.phone}` : null,
    `Industry: ${answers.step1.industry}`,
    `Company size: ${answers.step1.companySize}`,
    answers.step1.country ? `Country: ${answers.step1.country}` : null,
    answers.step1.role ? `Role: ${answers.step1.role}` : null,
    "",
    "— Systems —",
    `CRM: ${joinList(answers.step2.crm)}`,
    `ERP: ${joinList(answers.step2.erp)}`,
    `Warehouse: ${joinList(answers.step2.warehouse)}`,
    `Comms: ${joinList(answers.step2.comms)}`,
    `Ticketing: ${joinList(answers.step2.ticketing)}`,
    `Identity: ${joinList(answers.step2.identity)}`,
    `Productivity: ${joinList(answers.step2.productivity)}`,
    `Custom apps: ${answers.step2.customApps || "—"}`,
    "",
    "— Data —",
    `Location: ${answers.step3.dataLocation || "—"}`,
    `Volume: ${answers.step3.dataVolume || "—"}`,
    `Documented: ${answers.step3.documented || "—"}`,
    `Integrated: ${answers.step3.integrated || "—"}`,
    answers.step3.manualWorkflows
      ? `Manual workflows: ${answers.step3.manualWorkflows}`
      : null,
    "",
    "— AI maturity —",
    `Current use: ${answers.step4.currentUse || "—"}`,
    `Prior projects: ${answers.step4.priorProjects || "—"}`,
    `Talent: ${answers.step4.talent || "—"}`,
    `Governance: ${answers.step4.governance || "—"}`,
    `Privacy: ${joinList(answers.step4.privacy)}`,
    `LLM familiarity: ${answers.step4.llmFamiliarity || "—"}`,
    "",
    "— Goals —",
    `Outcomes: ${joinList(answers.step5.outcomes)}`,
    answers.step5.priorities ? `Priorities: ${answers.step5.priorities}` : null,
    `Start date: ${answers.step5.startDate || "—"}`,
    `Budget: ${answers.step5.budget || "—"}`,
    `Decision timeline: ${answers.step5.decisionTimeline || "—"}`,
    answers.step5.notes ? `Notes: ${answers.step5.notes}` : null,
  ];
  return lines.filter((l): l is string => l !== null).join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.ONBOARDING_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  const ip = clientIp(request);
  const limit = checkRateLimit(ip, Date.now());
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: "Too many requests from this network. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSec) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const wrapped = (body as { answers?: unknown }) ?? {};
  const result = normalizeAnswers(wrapped.answers ?? body);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 400 });
  }

  const { answers } = result;
  const score = computeScore(answers);
  const sizing = computeSizing(answers);

  const subject = `New AI Readiness — ${answers.step1.companyName} (${score.total}/100, ${sizing.size})`;
  const text = buildText(answers, score, sizing);
  const html = buildHtml(answers, score, sizing);

  const attachmentPayload = {
    submittedAt: new Date().toISOString(),
    answers,
    score,
    sizing,
  };
  const attachmentBase64 = Buffer.from(
    JSON.stringify(attachmentPayload, null, 2),
    "utf8"
  ).toString("base64");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: answers.step1.email,
    subject,
    text,
    html,
    attachments: [
      {
        filename: `onboarding-${Date.now()}.json`,
        content: attachmentBase64,
      },
    ],
  });

  if (error) {
    console.error("[/api/onboarding] Resend error:", error);
    return NextResponse.json(
      { error: "Could not send submission. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
