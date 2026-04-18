import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = sanitize(body.name, 120);
  const emailRaw = sanitize(body.email, 254);
  const company = sanitize(body.company, 160);
  const message = sanitize(body.message, 5000);

  if (!name || !emailRaw || !message || !EMAIL_RE.test(emailRaw)) {
    return NextResponse.json(
      { error: "Name, a valid email, and message are required." },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);
  const subject = `New lead from ${name}${company ? ` (${company})` : ""}`;
  const plain = [
    `Name: ${name}`,
    `Email: ${emailRaw}`,
    company ? `Company: ${company}` : null,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.5;color:#161513">
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(emailRaw)}</p>
      ${company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
      <p style="white-space:pre-wrap;margin-top:16px">${escapeHtml(message)}</p>
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
    return NextResponse.json(
      { error: "Could not send message. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
