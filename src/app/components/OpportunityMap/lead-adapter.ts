/**
 * Honto AI Readiness Map — internal lead notification adapter.
 *
 * Delivers the internal lead notification through Resend when configured,
 * matching the existing contact/onboarding routes. When configuration is absent
 * the route uses a safe stub path instead (see the route handler), so local
 * development never requires credentials.
 *
 * Required env: RESEND_API_KEY and CONTACT_FROM_EMAIL (shared with the existing
 * email routes). The recipient is OPPORTUNITY_MAP_TO_EMAIL, falling back to the
 * onboarding/contact recipients so the feature works anywhere those are set.
 */

import { Resend } from "resend";
import type { LeadEmail } from "./lead-email";

export type DeliveryResult = "sent" | "failed";

/**
 * Where lead notifications are sent. Prefers the dedicated var but falls back to
 * the recipients the onboarding/contact routes already use, so a missing
 * OPPORTUNITY_MAP_TO_EMAIL never silently disables lead delivery.
 */
function leadRecipient(): string | undefined {
  return (
    process.env.OPPORTUNITY_MAP_TO_EMAIL ||
    process.env.ONBOARDING_TO_EMAIL ||
    process.env.CONTACT_TO_EMAIL ||
    undefined
  );
}

export function isLeadEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && leadRecipient()
  );
}

export async function deliverLead(email: LeadEmail): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = leadRecipient();
  if (!apiKey || !from || !to) return "failed";

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    if (error) {
      console.error("[/api/opportunity-map] Resend error:", error);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[/api/opportunity-map] lead delivery threw:", err);
    return "failed";
  }
}

/** Safe development log when email is not configured. No payload, no secrets. */
export function logStubbedLead(companyName: string, score: number): void {
  console.info(
    `[/api/opportunity-map] lead notification stubbed (email not configured) — ${companyName}, signal ${score}/100`
  );
}
