import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_FIELDS, type ContactField } from "./descriptor";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  phone?: unknown;
  message?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{7,15}$/;

const FIELD_LIMITS = Object.fromEntries(
  CONTACT_FIELDS.map((f) => [f.name, f.maxLength])
) as Record<ContactField["name"], number>;

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

function sanitize(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

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

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const name = sanitize(body.name, FIELD_LIMITS.name);
  const emailRaw = sanitize(body.email, FIELD_LIMITS.email);
  const company = sanitize(body.company, FIELD_LIMITS.company);
  const message = sanitize(body.message, FIELD_LIMITS.message);

  if (!name || !emailRaw || !EMAIL_RE.test(emailRaw)) {
    return NextResponse.json(
      { error: "Name and a valid email are required." },
      { status: 400 }
    );
  }

  const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
  let phone: string | null = null;
  if (phoneRaw) {
    if (phoneRaw.length > FIELD_LIMITS.phone || !PHONE_RE.test(phoneRaw)) {
      return NextResponse.json(
        { error: "Phone must contain only digits (7–15 digits)." },
        { status: 400 }
      );
    }
    phone = phoneRaw;
  }

  const resend = new Resend(apiKey);
  const subject = `New lead from ${name}${company ? ` (${company})` : ""}`;
  const plain = [
    `Name: ${name}`,
    `Email: ${emailRaw}`,
    company ? `Company: ${company}` : null,
    phone ? `Phone: ${phone}` : null,
    "",
    message ?? "(no message provided)",
  ]
    .filter((line) => line !== null)
    .join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5;color:#161513">
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(emailRaw)}</p>
      ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      ${
        message
          ? `<p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(message)}</p>`
          : `<p style="color:#6f6960;margin-top:16px"><em>No message provided</em></p>`
      }
    </div>
  `.trim();

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: emailRaw,
    subject,
    text: plain,
    html,
  });

  if (error) {
    console.error("[/api/contact] Resend error:", error);
    return NextResponse.json(
      { error: "Could not send message. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
