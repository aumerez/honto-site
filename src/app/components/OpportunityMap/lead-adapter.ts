/**
 * Honto AI Readiness Map — internal lead notification adapter.
 *
 * Delivers the internal lead notification through Resend when configured,
 * matching the existing contact/onboarding routes. When configuration is absent
 * the route uses a safe stub path instead (see the route handler), so local
 * development never requires credentials.
 *
 * Required env (shared with the existing email routes):
 *   RESEND_API_KEY, CONTACT_FROM_EMAIL, OPPORTUNITY_MAP_TO_EMAIL
 */

import { Resend } from "resend";
import type { LeadEmail } from "./lead-email";

export type DeliveryResult = "sent" | "failed";

export function isLeadEmailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_FROM_EMAIL &&
    process.env.OPPORTUNITY_MAP_TO_EMAIL
  );
}

export async function deliverLead(email: LeadEmail): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.OPPORTUNITY_MAP_TO_EMAIL;
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
      console.error("[/api/opportunity-map] lead delivery failed");
      return "failed";
    }
    return "sent";
  } catch {
    console.error("[/api/opportunity-map] lead delivery failed");
    return "failed";
  }
}

/** Safe development log when email is not configured. No payload, no secrets. */
export function logStubbedLead(companyName: string, score: number): void {
  console.info(
    `[/api/opportunity-map] lead notification stubbed (email not configured) — ${companyName}, signal ${score}/100`
  );
}
