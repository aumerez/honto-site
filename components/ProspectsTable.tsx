'use client';

import { useMemo, useState } from 'react';
import { Logo } from './Brand';

export type Prospect = {
  id: string;
  company: string;
  contact: string;
  role: string;
  email: string;
  industry: string;
  size: string;
  mainProc: string;
  level: number;
  levelName: string;
  est: number;
  lang: string;
  booked: boolean;
  demo: string | null;
  received: string;
  answers: [string, string][];
};

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

type Filter = 'all' | 'booked' | 'report';

export function ProspectsTable({ prospects, notify, problem, initialId }: { prospects: Prospect[]; notify: string[]; problem: string; initialId?: string }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selId, setSelId] = useState<string | undefined>(initialId ?? prospects[0]?.id);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return prospects.filter((p) => {
      if (filter === 'booked' && !p.booked) return false;
      if (filter === 'report' && p.booked) return false;
      if (q && !`${p.company} ${p.contact} ${p.email}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [prospects, filter, query]);

  const sel = prospects.find((p) => p.id === selId);
  const booked = prospects.filter((p) => p.booked).length;

  return (
    <div style={{ background: 'var(--soft)', minHeight: '100vh' }}>
      <header style={{ background: 'var(--ink)', color: '#fff' }}>
        <div className="container row" style={{ maxWidth: 1320, padding: '16px 24px', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div className="row" style={{ alignItems: 'baseline', gap: 14 }}>
            <a href="/" aria-label="Honto home" style={{ textDecoration: 'none', color: '#fff' }}>
              <Logo size={24} />
            </a>
            <span className="mono" style={{ fontSize: 12, color: 'var(--on-dark)' }}>ADMIN</span>
          </div>
        </div>
      </header>

      <main className="container stack" style={{ maxWidth: 1320, padding: '36px 24px 72px', gap: 24 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <div className="stack" style={{ gap: 6 }}>
            <h1 style={{ margin: 0, fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }}>Prospects</h1>
            <p style={{ margin: 0, fontSize: 16, color: 'var(--muted)' }}>Every questionnaire submitted from Book a demo.</p>
          </div>
          <a href="/api/admin/export" className="btn btn-outline" style={{ fontSize: 15, padding: '10px 18px' }}>
            Export CSV
          </a>
        </div>

        {problem && (
          <p role="alert" style={{ margin: 0, background: 'var(--mustard-soft)', padding: '16px 20px', borderRadius: 14, fontWeight: 600 }}>
            {problem}
          </p>
        )}

        <div className="grid-auto" style={{ gap: 14, ['--min' as string]: '200px' }}>
          <Stat label="SUBMISSIONS" value={prospects.length} />
          <Stat label="DEMOS BOOKED" value={booked} />
          <Stat label="REPORT ONLY" value={prospects.length - booked} />
          <div className="stack" style={{ background: '#fff', borderRadius: 16, padding: 20, gap: 10 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)' }}>EMAIL NOTIFICATIONS</span>
            <div className="row" style={{ gap: 6 }}>
              {notify.map((e) => (
                <span key={e} style={{ fontSize: 13, background: 'var(--mustard-soft)', padding: '4px 10px', borderRadius: 999 }}>
                  {e}
                </span>
              ))}
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>Each new submission is emailed with all answers.</span>
          </div>
        </div>

        <div className="row" style={{ gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div role="group" aria-label="Filter" className="row" style={{ gap: 8 }}>
            {(
              [
                ['all', 'All'],
                ['booked', 'Demo booked'],
                ['report', 'Report only'],
              ] as [Filter, string][]
            ).map(([id, label]) => (
              <button key={id} type="button" className="tab" aria-pressed={filter === id} onClick={() => setFilter(id)} style={{ fontSize: 14 }}>
                {label}
              </button>
            ))}
          </div>
          <label className="row" style={{ alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600 }}>
            Search
            <input type="search" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Company, contact or email" style={{ minWidth: 240, width: 'auto' }} />
          </label>
        </div>

        <div className="row" style={{ gap: 20, alignItems: 'flex-start' }}>
          <div style={{ flex: '999 1 620px', minWidth: 0, background: '#fff', borderRadius: 20, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 640 }}>
              <thead>
                <tr className="mono" style={{ textAlign: 'left', fontSize: 11, color: 'var(--muted-2)' }}>
                  <th style={{ padding: '16px 20px', fontWeight: 500 }}>COMPANY</th>
                  <th style={{ padding: '16px 12px', fontWeight: 500 }}>MAIN PROCESS</th>
                  <th style={{ padding: '16px 12px', fontWeight: 500 }}>LEVEL</th>
                  <th style={{ padding: '16px 12px', fontWeight: 500 }}>DEMO</th>
                  <th style={{ padding: '16px 12px', fontWeight: 500 }}>LANG</th>
                  <th style={{ padding: '16px 20px', fontWeight: 500 }}>RECEIVED</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={p.id} style={{ borderTop: '1px solid var(--line)', background: p.id === selId ? 'var(--mustard-soft)' : '#fff' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <button
                        type="button"
                        onClick={() => setSelId(p.id)}
                        aria-pressed={p.id === selId}
                        className="stack"
                        style={{ textAlign: 'left', border: 0, background: 'transparent', padding: 0, cursor: 'pointer', gap: 2 }}
                      >
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{p.company}</span>
                        <span style={{ fontSize: 13, color: 'var(--muted-2)' }}>
                          {p.contact} · {p.industry}
                        </span>
                      </button>
                    </td>
                    <td style={{ padding: '14px 12px' }}>{p.mainProc}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <b>{p.level}</b>
                      <span style={{ color: 'var(--muted-2)' }}> / 5</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: 999,
                          whiteSpace: 'nowrap',
                          background: p.booked ? 'var(--green-soft)' : 'var(--chip)',
                          color: p.booked ? 'var(--green-text)' : 'var(--muted)',
                        }}
                      >
                        {p.booked ? fmt(p.demo) || 'Booked' : 'Report only'}
                      </span>
                    </td>
                    <td className="mono" style={{ padding: '14px 12px', fontSize: 12 }}>
                      {p.lang}
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--muted-2)', whiteSpace: 'nowrap' }}>{fmt(p.received)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <p style={{ margin: 0, padding: '32px 20px', color: 'var(--muted-2)' }}>No prospects yet.</p>}
          </div>

          {sel && (
            <aside aria-label="Prospect details" className="stack" style={{ flex: '1 1 360px', minWidth: 0, background: '#fff', borderRadius: 20, padding: 28, gap: 20 }}>
              <div className="stack" style={{ gap: 4 }}>
                <span className="label-mustard" style={{ fontSize: 11 }}>
                  {sel.industry.toUpperCase()} · {sel.size} PEOPLE
                </span>
                <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>{sel.company}</h2>
                <span style={{ fontSize: 15, color: 'var(--muted)' }}>
                  {sel.contact} · {sel.role}
                </span>
                <a href={`mailto:${sel.email}`} style={{ fontSize: 15, fontWeight: 600, color: 'var(--mustard-text)' }}>
                  {sel.email}
                </a>
              </div>
              <div className="stack" style={{ background: 'var(--ink)', color: '#fff', borderRadius: 16, padding: '18px 20px', gap: 10 }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--on-dark)' }}>AI MATURITY</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--mustard)' }}>
                    Level {sel.level} · {sel.levelName}
                  </span>
                </div>
                <div className="row" style={{ gap: 5, flexWrap: 'nowrap' }} aria-hidden="true">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} style={{ flex: 1, height: 8, borderRadius: 999, background: n <= sel.level ? 'var(--mustard)' : '#3A3E43' }} />
                  ))}
                </div>
                <span style={{ fontSize: 14, color: '#E4E6E8' }}>≈ {sel.est} hours / month could be freed</span>
              </div>
              <div className="stack" style={{ gap: 4, border: '1px solid var(--line)', borderRadius: 14, padding: '14px 16px' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)' }}>DEMO</span>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{sel.booked ? fmt(sel.demo) || 'Booked — see Calendly' : 'Report only — not booked yet'}</span>
              </div>
              <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'minmax(0, 130px) minmax(0, 1fr)', gap: '10px 14px', fontSize: 14 }}>
                {sel.answers.map(([k, v]) => (
                  <div key={k} style={{ display: 'contents' }}>
                    <dt style={{ color: 'var(--muted-2)' }}>{k}</dt>
                    <dd style={{ margin: 0, fontWeight: 600 }}>{v || '—'}</dd>
                  </div>
                ))}
              </dl>
              <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>Received {fmt(sel.received)}</span>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="stack" style={{ background: '#fff', borderRadius: 16, padding: 20, gap: 4 }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--muted-2)' }}>{label}</span>
      <span style={{ fontSize: 34, fontWeight: 800 }}>{value}</span>
    </div>
  );
}
