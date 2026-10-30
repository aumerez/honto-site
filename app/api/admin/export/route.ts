import { db, type SubmissionRow } from '@/lib/db';
import { answerRows } from '@/lib/email';
import type { Answers } from '@/lib/questionnaire';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cell = (v: unknown) => {
  const s = v == null ? '' : String(v);
  // Quote, and neutralise spreadsheet formulas.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
};

export async function GET() {
  const sql = db();
  if (!sql) return new Response('Database not configured', { status: 503 });
  const rows = await sql<SubmissionRow[]>`select * from submissions order by created_at desc`;
  const answerHeaders = answerRows({} as Answers).map(([k]) => k);
  const header = ['Received', 'Status', 'Demo at', 'Level', 'Est. hours/month', 'Language', ...answerHeaders];
  const lines = rows.map((r) => {
    const a = r.answers as unknown as Answers;
    const vals = answerRows({ ...a, procs: a.procs ?? [], systems: a.systems ?? [], teams: a.teams ?? [] }).map(([, v]) => v);
    return [r.created_at.toISOString(), r.status, r.demo_at?.toISOString() ?? '', r.level, r.est_hours, r.lang, ...vals].map(cell).join(',');
  });
  const csv = [header.map(cell).join(','), ...lines].join('\n');
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="honto-prospects-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
