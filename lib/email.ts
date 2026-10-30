import 'server-only';
import { Resend } from 'resend';
import { LEVELS, OPP, labelOf, t, tr, type Answers, type Lang } from './questionnaire';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function client() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

// EMAIL_FROM, or CONTACT_FROM_EMAIL as used by the previous honto.ai site.
const from = () => process.env.EMAIL_FROM || process.env.CONTACT_FROM_EMAIL || 'Honto <demo@honto.ai>';
const team = () =>
  (process.env.NOTIFY_EMAILS || 'fegloff@gmail.com,aumerez@honto.ai')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const list = (k: Parameters<typeof labelOf>[0], v: string[] | undefined) => (v ?? []).map((id) => labelOf(k, id)).join(', ');

export function answerRows(a: Answers): [string, string][] {
  return [
    ['Company', a.company ?? ''],
    ['Industry', labelOf('industry', a.industry)],
    ['People', labelOf('size', a.size)],
    ['Stuck processes', list('procs', a.procs)],
    ['Frequency', labelOf('freq', a.freq)],
    ['People involved', labelOf('people', a.people)],
    ['Hours per week', labelOf('hours', a.hours)],
    ['Approvals', labelOf('approval', a.approval)],
    ['Tools', list('systems', a.systems)],
    ['Systems connected', labelOf('connected', a.connected)],
    ['Overloaded teams', list('teams', a.teams)],
    ['Key-person risk', labelOf('knowledge', a.knowledge)],
    ['Goal', labelOf('goal', a.goal)],
    ['Timing', labelOf('timing', a.timing)],
    ['Contact', `${a.name ?? ''} · ${labelOf('role', a.role)}`],
    ['Email', a.email ?? ''],
    ['Phone', a.phone || '—'],
  ];
}

function layout(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#F7F6F1;font-family:Arial,Helvetica,sans-serif;color:#16181B">
<div style="max-width:600px;margin:0 auto;padding:32px 20px">
<div style="font-family:Manrope,Arial,Helvetica,sans-serif;font-size:24px;font-weight:700;letter-spacing:-0.045em;margin-bottom:24px">honto<span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#D4A24C;margin-left:3px"></span></div>
<div style="background:#ffffff;border-radius:16px;padding:28px">
<h1 style="margin:0 0 16px;font-size:24px">${esc(title)}</h1>${body}
</div></div></body></html>`;
}

export async function notifyTeam(opts: { id: string; a: Answers; level: number; est: number; lang: Lang }) {
  const r = client();
  if (!r) {
    console.warn('[email] RESEND_API_KEY not set — team notification skipped');
    return;
  }
  const { a, level, est, id, lang } = opts;
  const site = process.env.NEXT_PUBLIC_SITE_URL || '';
  const rows = answerRows(a)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5A5F66;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;font-weight:600">${esc(v)}</td></tr>`)
    .join('');
  const body = `<p style="margin:0 0 16px;font-size:16px">AI maturity: <b>Level ${level} · ${esc(LEVELS[level - 1].name[0])}</b> — ≈ ${est} hours/month to free up. Language: ${lang.toUpperCase()}.</p>
<table style="border-collapse:collapse;font-size:14px">${rows}</table>
${site ? `<p style="margin:24px 0 0"><a href="${esc(site)}/admin?id=${esc(id)}" style="color:#8A6410;font-weight:700">Open in Prospects →</a></p>` : ''}`;
  await r.emails.send({
    from: from(),
    to: team(),
    replyTo: a.email,
    subject: `New prospect: ${a.company} (Level ${level})`,
    html: layout(`New prospect: ${a.company}`, body),
  });
}

export async function sendReport(opts: { a: Answers; level: number; est: number; lang: Lang }) {
  const r = client();
  if (!r) return;
  const { a, level, est, lang } = opts;
  const lv = LEVELS[level - 1];
  const opps = a.procs
    .slice(0, 3)
    .map((id, i) => `<li style="margin:0 0 8px"><b>0${i + 1}</b> ${esc(tr(OPP[id], lang))} <span style="color:#5A5F66">— ${esc(labelOf('procs', id, lang))}</span></li>`)
    .join('');
  const body = `<div style="background:#16181B;color:#fff;border-radius:12px;padding:20px;margin-bottom:20px">
<div style="font-size:12px;color:#B4B9BF">${esc(t('level', lang))} ${level} ${esc(t('of', lang))} 5</div>
<div style="font-size:28px;font-weight:700;color:#D4A24C">${esc(tr(lv.name, lang))}</div>
<div style="font-size:15px;margin-top:6px">${esc(tr(lv.desc, lang))}</div></div>
<p style="font-size:12px;color:#8A6410;margin:0 0 8px">${esc(t('opps', lang))}</p><ul style="padding-left:18px;margin:0 0 20px">${opps}</ul>
<p style="font-size:12px;color:#3E6B12;margin:0 0 4px">${esc(t('estimate', lang))}</p>
<p style="font-size:28px;font-weight:700;margin:0">≈ ${est} ${esc(t('hrsmo', lang))}</p>
<p style="font-size:12px;color:#5A5F66">${esc(t('estNote', lang))}</p>`;
  await r.emails.send({
    from: from(),
    to: [a.email],
    replyTo: team()[0],
    subject: `${t('resultsTitle', lang)} — ${a.company}`,
    html: layout(t('resultsTitle', lang), body),
  });
}

export async function notifyBooking(opts: { company: string; name: string; email: string; when: string | null }) {
  const r = client();
  if (!r) return;
  const when = opts.when ? new Date(opts.when).toUTCString() : 'see Calendly';
  await r.emails.send({
    from: from(),
    to: team(),
    replyTo: opts.email,
    subject: `Demo booked: ${opts.company}`,
    html: layout(`Demo booked: ${opts.company}`, `<p style="font-size:16px">${esc(opts.name)} (${esc(opts.email)}) booked a demo.</p><p style="font-size:16px"><b>When:</b> ${esc(when)}</p>`),
  });
}
