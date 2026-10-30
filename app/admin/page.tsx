import type { Metadata } from 'next';
import { db, type SubmissionRow } from '@/lib/db';
import { answerRows } from '@/lib/email';
import { LEVELS, labelOf, type Answers } from '@/lib/questionnaire';
import { ProspectsTable, type Prospect } from '@/components/ProspectsTable';

export const metadata: Metadata = { title: 'Prospects — Honto', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

function toProspect(r: SubmissionRow): Prospect {
  const a = r.answers as unknown as Answers;
  return {
    id: r.id,
    company: r.company,
    contact: r.contact_name,
    role: labelOf('role', r.role),
    email: r.email,
    industry: labelOf('industry', r.industry),
    size: labelOf('size', r.size),
    mainProc: labelOf('procs', a.procs?.[0]),
    level: r.level,
    levelName: LEVELS[r.level - 1]?.name[0] ?? '',
    est: r.est_hours,
    lang: r.lang.toUpperCase(),
    booked: r.status === 'booked',
    demo: r.demo_at ? r.demo_at.toISOString() : null,
    received: r.created_at.toISOString(),
    answers: answerRows(a).slice(1, 14),
  };
}

export default async function AdminPage({ searchParams }: { searchParams: { id?: string } }) {
  const sql = db();
  let prospects: Prospect[] = [];
  let problem = '';
  if (!sql) {
    problem = 'The database is not configured yet. Set DATABASE_URL and run "npm run db:migrate".';
  } else {
    try {
      const rows = await sql<SubmissionRow[]>`select * from submissions order by created_at desc limit 1000`;
      prospects = rows.map(toProspect);
    } catch (e) {
      console.error(e);
      problem = 'Could not read submissions. Check DATABASE_URL and that "npm run db:migrate" has been run.';
    }
  }
  const notify = (process.env.NOTIFY_EMAILS || 'fegloff@gmail.com,aumerez@honto.ai').split(',').map((s) => s.trim()).filter(Boolean);
  return <ProspectsTable prospects={prospects} notify={notify} problem={problem} initialId={searchParams.id} />;
}
