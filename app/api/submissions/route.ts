import { NextResponse } from 'next/server';
import type postgres from 'postgres';
import { z } from 'zod';
import { db } from '@/lib/db';
import { notifyTeam, sendReport } from '@/lib/email';
import { LANGS, estimateHours, ids, scoreLevel, type Answers } from '@/lib/questionnaire';

export const runtime = 'nodejs';

const one = (k: Parameters<typeof ids>[0]) => z.enum(ids(k));
const many = (k: Parameters<typeof ids>[0], max: number) => z.array(z.enum(ids(k))).min(1).max(max);

const Body = z.object({
  lang: z.enum(LANGS),
  website: z.string().max(0).optional(), // honeypot: must stay empty
  answers: z.object({
    company: z.string().trim().min(1).max(160),
    industry: one('industry'),
    size: one('size'),
    procs: many('procs', 3),
    freq: one('freq'),
    people: one('people'),
    hours: one('hours'),
    approval: one('approval'),
    systems: many('systems', 12),
    connected: one('connected'),
    teams: many('teams', 8),
    knowledge: one('knowledge'),
    goal: one('goal'),
    timing: one('timing'),
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(40).default(''),
    role: one('role'),
    consent: z.literal(true),
  }),
});

export async function POST(req: Request) {
  let parsed;
  try {
    parsed = Body.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission', issues: parsed.error.flatten() }, { status: 400 });
  }
  const { lang, answers } = parsed.data;
  const a = answers as Answers;
  const level = scoreLevel(a);
  const est = estimateHours(a.hours);

  const sql = db();
  let id: string = crypto.randomUUID();
  if (sql) {
    const rows = await sql<{ id: string }[]>`
      insert into submissions (id, lang, company, contact_name, email, phone, role, industry, size, level, est_hours, answers)
      values (${id}, ${lang}, ${a.company}, ${a.name}, ${a.email}, ${a.phone || null}, ${a.role!}, ${a.industry!}, ${a.size!},
              ${level}, ${est}, ${sql.json(a as unknown as postgres.JSONValue)})
      returning id`;
    id = rows[0].id;
  } else {
    console.warn('[submissions] DATABASE_URL not set — submission not stored', { company: a.company });
  }

  // Emails should never block the prospect's flow.
  await Promise.allSettled([notifyTeam({ id, a, level, est, lang }), sendReport({ a, level, est, lang })]).then((res) =>
    res.forEach((r) => r.status === 'rejected' && console.error('[email]', r.reason)),
  );

  return NextResponse.json({ id, level, est });
}

