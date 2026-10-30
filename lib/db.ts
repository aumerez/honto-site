import 'server-only';
import postgres from 'postgres';

let client: postgres.Sql | null = null;

/** Returns a Postgres client, or null when DATABASE_URL is not configured. */
export function db(): postgres.Sql | null {
  if (!process.env.DATABASE_URL) return null;
  if (!client) {
    client = postgres(process.env.DATABASE_URL, {
      ssl: process.env.DATABASE_SSL === 'false' ? false : 'require',
      max: 5,
      idle_timeout: 20,
    });
  }
  return client;
}

export type SubmissionRow = {
  id: string;
  created_at: Date;
  lang: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string | null;
  role: string;
  industry: string;
  size: string;
  level: number;
  est_hours: number;
  answers: Record<string, unknown>;
  status: 'report' | 'booked';
  demo_at: Date | null;
  calendly_event_uri: string | null;
  calendly_invitee_uri: string | null;
};
