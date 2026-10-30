import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db, type SubmissionRow } from '@/lib/db';
import { notifyBooking } from '@/lib/email';

export const runtime = 'nodejs';

const Body = z.object({
  eventUri: z.string().url().startsWith('https://api.calendly.com/'),
  inviteeUri: z.string().url().startsWith('https://api.calendly.com/').optional(),
});

/** Reads the booked start time from Calendly when a token is configured. */
async function fetchStart(eventUri: string): Promise<string | null> {
  const token = process.env.CALENDLY_TOKEN;
  if (!token) return null;
  try {
    const res = await fetch(eventUri, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    if (!res.ok) return null;
    const json = (await res.json()) as { resource?: { start_time?: string } };
    return json.resource?.start_time ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  if (!z.string().uuid().safeParse(params.id).success) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid booking' }, { status: 400 });

  const sql = db();
  if (!sql) return NextResponse.json({ ok: true, stored: false });

  const start = await fetchStart(parsed.data.eventUri);
  const rows = await sql<Pick<SubmissionRow, 'company' | 'contact_name' | 'email'>[]>`
    update submissions
       set status = 'booked',
           calendly_event_uri = ${parsed.data.eventUri},
           calendly_invitee_uri = ${parsed.data.inviteeUri ?? null},
           demo_at = ${start}
     where id = ${params.id} and status = 'report'
     returning company, contact_name, email`;
  if (!rows.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await notifyBooking({ company: rows[0].company, name: rows[0].contact_name, email: rows[0].email, when: start }).catch((e) =>
    console.error('[email]', e),
  );
  return NextResponse.json({ ok: true, start });
}
