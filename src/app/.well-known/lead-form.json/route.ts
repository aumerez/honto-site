import { NextResponse } from "next/server";
import { buildDescriptor } from "@/app/api/contact/descriptor";

/**
 * Agent discovery endpoint. Served as JSON at /.well-known/lead-form.json.
 * AI agents (Claude, ChatGPT, Copilot, etc.) can fetch this to learn the
 * contact form's schema and submit a filled payload directly to
 * /api/contact on behalf of a user.
 */
export function GET() {
  return NextResponse.json(buildDescriptor(), {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
