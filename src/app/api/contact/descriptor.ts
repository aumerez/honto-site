/**
 * Machine-readable description of the contact form, consumed by the API route
 * itself and republished at /.well-known/lead-form.json so that AI agents
 * (Claude, ChatGPT, Copilot, etc.) can discover the form schema and submit a
 * filled payload directly to /api/contact on a user's behalf.
 */

import { SITE_URL } from "@/lib/site";

export type ContactField = {
  name: "name" | "email" | "company" | "phone" | "message";
  type: "text" | "email" | "tel" | "textarea";
  required: boolean;
  maxLength: number;
  description: string;
};

export const CONTACT_FIELDS: readonly ContactField[] = [
  {
    name: "name",
    type: "text",
    required: true,
    maxLength: 120,
    description: "Full name of the person reaching out.",
  },
  {
    name: "email",
    type: "email",
    required: true,
    maxLength: 254,
    description: "A valid reply-to email address.",
  },
  {
    name: "company",
    type: "text",
    required: false,
    maxLength: 160,
    description: "Company or organization, if applicable.",
  },
  {
    name: "phone",
    type: "tel",
    required: false,
    maxLength: 40,
    description: "Optional phone number for direct follow-up.",
  },
  {
    name: "message",
    type: "textarea",
    required: false,
    maxLength: 5000,
    description: "Free-form description of the request or problem.",
  },
] as const;

type ContactDescriptor = {
  $schema: string;
  name: string;
  description: string;
  endpoint: {
    url: string;
    method: "POST";
    contentType: "application/json";
  };
  fields: readonly ContactField[];
  responses: {
    success: { status: number; shape: Record<string, string> };
    validationError: { status: number; shape: Record<string, string> };
    downstreamError: { status: number; shape: Record<string, string> };
  };
  humanUrl: {
    en: string;
    es: string;
  };
};

export function buildDescriptor(): ContactDescriptor {
  return {
    $schema: "https://honto.ai/schemas/lead-form/v1.json",
    name: "honto contact form",
    description:
      "Submit a lead to honto. The form accepts JSON matching the `fields` shape and replies within 24 hours.",
    endpoint: {
      url: `${SITE_URL}/api/contact`,
      method: "POST",
      contentType: "application/json",
    },
    fields: CONTACT_FIELDS,
    responses: {
      success: { status: 200, shape: { ok: "true" } },
      validationError: { status: 400, shape: { error: "string" } },
      downstreamError: { status: 502, shape: { error: "string" } },
    },
    humanUrl: {
      en: `${SITE_URL}/en#contact`,
      es: `${SITE_URL}/es#contact`,
    },
  };
}
