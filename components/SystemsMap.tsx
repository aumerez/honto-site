'use client';

import { labelOf, t, type Answers, type Lang } from '@/lib/questionnaire';

const C = 170; // centre of the 340×340 map
const R = 128;

/** Live map: the company in the centre, chosen tools and teams around it.
 *  Dashed grey lines = silos; once connected, solid mustard lines. */
export function SystemsMap({ a, lang, connected }: { a: Answers; lang: Lang; connected: boolean }) {
  const nodes = [
    ...a.systems.slice(0, 6).map((id) => ({ id, label: labelOf('systems', id, lang).replace(/ \(.*\)/, ''), team: false })),
    ...a.teams.slice(0, 4).map((id) => ({ id: 't-' + id, label: labelOf('teams', id, lang), team: true })),
  ];
  const n = nodes.length;
  const company = a.company.trim() || t('yourCompany', lang);
  const status = n === 0 ? t('badgeDraft', lang) : connected ? t('badgeOn', lang) : t('badgeSilos', lang);
  const hint = n === 0 ? t('mapEmpty', lang) : connected ? t('mapAfter', lang) : t('mapBefore', lang);

  return (
    <aside aria-label={t('mapTitle', lang)} className="stack" style={{ flex: '1 1 360px', minWidth: 0, background: '#fff', borderRadius: 24, padding: 28, gap: 16 }}>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span className="mono" style={{ fontSize: 12, letterSpacing: '0.06em', color: 'var(--muted-2)' }}>
          {t('mapTitle', lang)}
        </span>
        <span
          className="mono"
          style={{
            fontSize: 11,
            padding: '4px 10px',
            borderRadius: 999,
            background: connected && n ? 'var(--green-soft)' : 'var(--chip)',
            color: connected && n ? 'var(--green-text)' : 'var(--muted-2)',
          }}
        >
          {status}
        </span>
      </div>
      <div
        role="img"
        aria-label={`${company}: ${nodes.map((x) => x.label).join(', ')}`}
        style={{ position: 'relative', width: 340, maxWidth: '100%', height: 340, margin: '0 auto' }}
      >
        {nodes.map((nd, i) => {
          const ang = -90 + (i * 360) / n;
          return (
            <div
              key={'l' + nd.id}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: C,
                top: C,
                width: R - 12,
                height: 0,
                borderTop: `2px ${connected ? 'solid' : 'dashed'} ${connected ? 'var(--mustard)' : '#C9C6BD'}`,
                transform: `rotate(${ang}deg)`,
                transformOrigin: '0 0',
                transition: 'border-color .5s',
              }}
            />
          );
        })}
        <div aria-hidden="true" style={{ position: 'absolute', left: C - 30, top: C - 30, width: 60, height: 60, borderRadius: '50%', background: 'var(--mustard)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', left: C - 100, top: C + 36, width: 200, display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, background: '#fff', padding: '2px 8px', borderRadius: 999 }}>{company}</span>
        </div>
        {nodes.map((nd, i) => {
          const rad = ((-90 + (i * 360) / n) * Math.PI) / 180;
          return (
            <div
              key={nd.id}
              aria-hidden="true"
              className="stack"
              style={{
                position: 'absolute',
                left: Math.round(C + R * Math.cos(rad)),
                top: Math.round(C + R * Math.sin(rad)),
                transform: 'translate(-50%, -50%)',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <span style={{ width: nd.team ? 16 : 13, height: nd.team ? 16 : 13, borderRadius: '50%', background: nd.team ? 'var(--green)' : 'var(--ink)' }} />
              <span style={{ fontSize: 11, fontWeight: 600, background: '#fff', padding: '2px 8px', borderRadius: 999, border: '1px solid var(--line)', whiteSpace: 'nowrap' }}>
                {nd.label}
              </span>
            </div>
          );
        })}
      </div>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--muted-2)', textAlign: 'center' }}>{hint}</p>
      <div className="row" style={{ justifyContent: 'center', gap: 18, fontSize: 12, color: 'var(--muted-2)' }}>
        <span className="row" style={{ alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--ink)' }} />
          {t('legendTools', lang)}
        </span>
        <span className="row" style={{ alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' }} />
          {t('legendTeams', lang)}
        </span>
      </div>
    </aside>
  );
}
