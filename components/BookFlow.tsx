'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Wordmark } from './Brand';
import { SystemsMap } from './SystemsMap';
import {
  LANGS,
  LEVELS,
  O,
  OPP,
  emptyAnswers,
  estimateHours,
  labelOf,
  optLabel,
  scoreLevel,
  t as tt,
  tr,
  type Answers,
  type Lang,
  type Opt,
  type OptKey,
  type TKey,
} from '@/lib/questionnaire';

// Steps: 0 intro · 1 business · 2 stuck · 3 cost · 4 tools · 5 team & goals · 6 results · 7 contact · 8 calendar · 9 done
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || '';

export function BookFlow({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [step, setStep] = useState<Step>(0);
  const [a, setA] = useState<Answers>(emptyAnswers);
  const [booked, setBooked] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  const t = (k: TKey) => tt(k, lang);
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Move focus to the new step's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (step > 0) headingRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const contactOk = !!(a.name.trim() && /.+@.+\..+/.test(a.email) && a.role && a.consent);
  const canNext = useMemo(() => {
    switch (step) {
      case 1: return !!(a.company.trim() && a.industry && a.size);
      case 2: return a.procs.length > 0;
      case 3: return !!(a.freq && a.people && a.hours && a.approval);
      case 4: return a.systems.length > 0 && !!a.connected;
      case 5: return a.teams.length > 0 && !!(a.knowledge && a.goal && a.timing);
      case 7: return contactOk;
      default: return true;
    }
  }, [step, a, contactOk]);

  const level = scoreLevel(a);
  const est = estimateHours(a.hours);
  const mainProc = a.procs[0] ? labelOf('procs', a.procs[0], lang) : '';

  async function submit(): Promise<string | null> {
    if (submissionId) return submissionId;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, answers: a, website: honeypot }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const json = (await res.json()) as { id: string };
      setSubmissionId(json.id);
      return json.id;
    } catch {
      setError(t('error'));
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function next() {
    if (!canNext || busy) return;
    if (step === 7) {
      const id = await submit();
      if (id) setStep(8);
      return;
    }
    setStep((s) => Math.min(9, s + 1) as Step);
  }

  async function reportOnly() {
    if (!contactOk || busy) return;
    const id = await submit();
    if (id) {
      setBooked(false);
      setStep(9);
    }
  }

  // Calendly tells the parent page when a meeting is scheduled.
  useEffect(() => {
    if (step !== 8) return;
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return;
      const data = e.data as { event?: string; payload?: { event?: { uri?: string }; invitee?: { uri?: string } } };
      if (data?.event !== 'calendly.event_scheduled') return;
      const eventUri = data.payload?.event?.uri;
      if (submissionId && eventUri) {
        fetch(`/api/submissions/${submissionId}/booking`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventUri, inviteeUri: data.payload?.invitee?.uri }),
        }).catch(() => undefined);
      }
      setBooked(true);
      setStep(9);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [step, submissionId]);

  const calendlySrc = useMemo(() => {
    if (!CALENDLY_URL || typeof window === 'undefined') return '';
    const u = new URL(CALENDLY_URL);
    u.searchParams.set('embed_domain', window.location.hostname);
    u.searchParams.set('embed_type', 'Inline');
    u.searchParams.set('hide_gdpr_banner', '1');
    u.searchParams.set('primary_color', 'd4a24c');
    u.searchParams.set('name', a.name);
    u.searchParams.set('email', a.email);
    // Custom questions on the Calendly event type: a1 = company, a2 = what to show.
    u.searchParams.set('a1', a.company);
    u.searchParams.set('a2', a.procs.map((id) => labelOf('procs', id)).join(', '));
    return u.toString();
  }, [a.name, a.email, a.company, a.procs]);

  const sysNames = a.systems.slice(0, 3).map((id) => labelOf('systems', id, lang).replace(/ \(.*\)/, ''));
  const sysJoined = sysNames.length > 1 ? `${sysNames.slice(0, -1).join(', ')} ${t('and')} ${sysNames[sysNames.length - 1]}` : sysNames[0] || '';

  const progressLabels: TKey[] = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
  const progStep = Math.min(step, 7);

  function chips(key: OptKey, opts?: { multi?: boolean; max?: number; legend: string }) {
    const multi = !!opts?.multi;
    const max = opts?.max ?? 0;
    const cur = a[key as keyof Answers] as string | string[] | null;
    return (
      <fieldset>
        <legend>{opts?.legend}</legend>
        <div className="chips">
          {(O[key] as Opt[]).map((o) => {
            const id = o[0];
            const sel = multi ? (cur as string[]).includes(id) : cur === id;
            const full = multi && max > 0 && (cur as string[]).length >= max && !sel;
            return (
              <button
                key={id}
                type="button"
                className="chip"
                aria-pressed={sel}
                disabled={full}
                onClick={() => {
                  if (multi) {
                    const arr = [...(cur as string[])];
                    const i = arr.indexOf(id);
                    if (i >= 0) arr.splice(i, 1);
                    else if (!max || arr.length < max) arr.push(id);
                    set(key as keyof Answers, arr as never);
                  } else set(key as keyof Answers, id as never);
                }}
              >
                {optLabel(o, lang)}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  const H2 = ({ children }: { children: React.ReactNode }) => (
    <h2 ref={headingRef} tabIndex={-1} style={{ margin: 0, fontSize: 'clamp(28px, 3.4vw, 36px)', fontWeight: 800, letterSpacing: '-0.03em', outline: 'none' }}>
      {children}
    </h2>
  );

  const nextLabel = step === 5 ? t('seeMap') : step === 6 ? t('toBook') : step === 7 ? t('chooseTime') : t('cont');

  return (
    <div style={{ background: 'var(--soft)', minHeight: '100vh' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
        <div className="container row" style={{ maxWidth: 1240, padding: '16px 24px', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Wordmark />
          <div role="group" aria-label="Language" className="row" style={{ gap: 4, background: 'var(--chip)', padding: 4, borderRadius: 999 }}>
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={l === lang}
                onClick={() => setLang(l)}
                className="mono"
                style={{ fontSize: 13, minWidth: 48, minHeight: 40, border: 0, borderRadius: 999, cursor: 'pointer', background: l === lang ? 'var(--ink)' : 'transparent', color: l === lang ? '#fff' : 'var(--ink)' }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container row" style={{ maxWidth: 1240, padding: '40px 24px 80px', gap: 32, alignItems: 'flex-start' }}>
        <section className="stack" style={{ flex: '999 1 600px', minWidth: 0, background: '#fff', borderRadius: 24, padding: 'clamp(24px, 4vw, 40px)', gap: 32 }}>
          {step >= 1 && step <= 8 && (
            <div className="stack" style={{ gap: 12 }}>
              <div style={{ height: 6, background: 'var(--chip)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: 6, width: `${Math.round((progStep / 7) * 100)}%`, background: 'var(--mustard)', borderRadius: 999, transition: 'width .4s' }} />
              </div>
              <ol aria-label="Steps" className="row" style={{ listStyle: 'none', margin: 0, padding: 0, gap: '6px 18px' }}>
                {progressLabels.map((k, i) => {
                  const n = i + 1;
                  return (
                    <li
                      key={k}
                      aria-current={n === progStep ? 'step' : undefined}
                      className="mono"
                      style={{ fontSize: 12, color: n < progStep ? 'var(--green-text)' : n === progStep ? 'var(--ink)' : 'var(--muted-3)', fontWeight: n === progStep ? 700 : 500 }}
                    >
                      {t(k)}
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {step === 0 && (
            <div className="stack" style={{ gap: 28, padding: '24px 0' }}>
              <span className="label-mustard" style={{ fontSize: 13 }}>{t('eyebrow')}</span>
              <h1 style={{ margin: 0, fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1, fontWeight: 800, letterSpacing: '-0.04em' }}>{t('introTitle')}</h1>
              <p style={{ margin: 0, fontSize: 20, lineHeight: 1.45, color: 'var(--muted)', maxWidth: 560 }}>{t('introSub')}</p>
              <ul className="stack" style={{ listStyle: 'none', margin: 0, padding: 0, gap: 12 }}>
                {(['get1', 'get2', 'get3'] as TKey[]).map((k, i) => (
                  <li key={k} className="row" style={{ alignItems: 'center', gap: 12, fontSize: 17, fontWeight: 600 }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: ['var(--mustard)', 'var(--ink)', 'var(--green)'][i] }} />
                    {t(k)}
                  </li>
                ))}
              </ul>
              <div className="row" style={{ alignItems: 'center', gap: 20 }}>
                <button type="button" className="btn btn-mustard" style={{ fontSize: 18, minHeight: 56, padding: '0 32px' }} onClick={() => setStep(1)}>
                  {t('start')}
                </button>
                <span className="mono" style={{ fontSize: 13, color: 'var(--muted-2)' }}>{t('meta')}</span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="stack" style={{ gap: 28 }}>
              <H2>{t('s1')}</H2>
              <div className="field" style={{ maxWidth: 480 }}>
                <label htmlFor="company" style={{ fontSize: 17 }}>{t('qCompany')}</label>
                <input id="company" className="input" autoComplete="organization" value={a.company} onChange={(e) => set('company', e.target.value)} maxLength={160} />
              </div>
              {chips('industry', { legend: t('qIndustry') })}
              {chips('size', { legend: t('qSize') })}
            </div>
          )}

          {step === 2 && (
            <div className="stack" style={{ gap: 28 }}>
              <H2>{t('s2')}</H2>
              {chips('procs', { multi: true, max: 3, legend: t('qProcs') })}
            </div>
          )}

          {step === 3 && (
            <div className="stack" style={{ gap: 28 }}>
              <H2>
                {t('costOf')} {mainProc}
              </H2>
              {chips('freq', { legend: t('qFreq') })}
              {chips('people', { legend: t('qPeople') })}
              {chips('hours', { legend: t('qHours') })}
              {chips('approval', { legend: t('qApproval') })}
            </div>
          )}

          {step === 4 && (
            <div className="stack" style={{ gap: 28 }}>
              <H2>{t('s4')}</H2>
              {chips('systems', { multi: true, legend: t('qSystems') })}
              {chips('connected', { legend: t('qConnected') })}
              <a href="mailto:?subject=Honto%20IT%20questionnaire&body=https%3A%2F%2Fhonto.ai%2Fit-questionnaire" style={{ fontSize: 15, fontWeight: 600, color: 'var(--mustard-text)' }}>
                {t('itLink')}
              </a>
            </div>
          )}

          {step === 5 && (
            <div className="stack" style={{ gap: 28 }}>
              <H2>{t('s5')}</H2>
              {chips('teams', { multi: true, legend: t('qTeams') })}
              {chips('knowledge', { legend: t('qKnowledge') })}
              {chips('goal', { legend: t('qGoal') })}
              {chips('timing', { legend: t('qTiming') })}
            </div>
          )}

          {step === 6 && (
            <div className="stack" style={{ gap: 28 }}>
              <H2>{t('resultsTitle')}</H2>
              <div className="row" style={{ background: 'var(--ink)', color: '#fff', borderRadius: 20, padding: 32, gap: 32, alignItems: 'center' }}>
                <div className="stack" style={{ gap: 6, minWidth: 180 }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--on-dark)' }}>
                    {t('level')} {level} {t('of')} 5
                  </span>
                  <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--mustard)' }}>{tr(LEVELS[level - 1].name, lang)}</span>
                </div>
                <div className="stack" style={{ flex: '1 1 260px', gap: 14 }}>
                  <div className="row" style={{ gap: 6, flexWrap: 'nowrap' }} aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} style={{ flex: 1, height: 10, borderRadius: 999, background: n <= level ? 'var(--mustard)' : '#3A3E43' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 17, color: '#E4E6E8' }}>{tr(LEVELS[level - 1].desc, lang)}</span>
                </div>
              </div>
              <div className="row" style={{ gap: 20 }}>
                <div className="stack" style={{ flex: '1 1 300px', border: '1px solid var(--line)', borderRadius: 20, padding: 24, gap: 14 }}>
                  <span className="label-mustard">{t('opps')}</span>
                  {a.procs.slice(0, 3).map((id, i) => (
                    <div key={id} className="row" style={{ gap: 12, alignItems: 'baseline', flexWrap: 'nowrap' }}>
                      <span style={{ fontWeight: 800, color: 'var(--mustard-text)' }}>0{i + 1}</span>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{tr(OPP[id], lang)}</div>
                        <div style={{ fontSize: 14, color: 'var(--muted-2)' }}>{labelOf('procs', id, lang)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="stack" style={{ flex: '1 1 240px', background: 'var(--green-soft)', borderRadius: 20, padding: 24, gap: 8 }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--green-text)' }}>{t('estimate')}</span>
                  <span style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em' }}>≈ {est}</span>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{t('hrsmo')}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>{t('estNote')}</span>
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="stack" style={{ gap: 24 }}>
              <H2>{t('contactTitle')}</H2>
              <div className="grid-auto" style={{ gap: 16, ['--min' as string]: '240px' }}>
                <div className="field">
                  <label htmlFor="name">{t('fName')}</label>
                  <input id="name" className="input" autoComplete="name" value={a.name} onChange={(e) => set('name', e.target.value)} maxLength={120} />
                </div>
                <div className="field">
                  <label htmlFor="email">{t('fEmail')}</label>
                  <input id="email" type="email" className="input" autoComplete="email" value={a.email} onChange={(e) => set('email', e.target.value)} maxLength={200} />
                </div>
                <div className="field">
                  <label htmlFor="phone">{t('fPhone')}</label>
                  <input id="phone" type="tel" className="input" autoComplete="tel" value={a.phone} onChange={(e) => set('phone', e.target.value)} maxLength={40} />
                </div>
              </div>
              {chips('role', { legend: t('fRole') })}
              {/* Honeypot for bots — hidden from people and assistive tech */}
              <div aria-hidden="true" style={{ position: 'absolute', left: -10000, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>
                <label htmlFor="website">Website</label>
                <input id="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>
              <label className="row" style={{ gap: 12, alignItems: 'center', fontSize: 15, cursor: 'pointer', flexWrap: 'nowrap' }}>
                <input type="checkbox" checked={a.consent} onChange={(e) => set('consent', e.target.checked)} style={{ width: 22, height: 22, accentColor: 'var(--ink)', flexShrink: 0 }} />
                {t('consent')}
              </label>
            </div>
          )}

          {step === 8 && (
            <div className="stack" style={{ gap: 20 }}>
              <H2>{t('calTitle')}</H2>
              {calendlySrc ? (
                <iframe title="Calendly" src={calendlySrc} style={{ width: '100%', minWidth: 280, height: 700, border: 0, borderRadius: 16 }} />
              ) : (
                <p style={{ margin: 0, fontSize: 17, color: 'var(--muted)', background: 'var(--mustard-soft)', padding: 20, borderRadius: 14 }}>{t('calMissing')}</p>
              )}
            </div>
          )}

          {step === 9 && (
            <div className="stack" style={{ gap: 24, padding: '16px 0' }}>
              <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16181B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L19 7" />
                </svg>
              </span>
              <H2>{booked ? t('doneTitle') : t('reportTitle')}</H2>
              <p style={{ margin: 0, fontSize: 19, lineHeight: 1.5, color: 'var(--muted)', maxWidth: 600 }}>
                {(booked ? t('doneSub') : t('reportSub')).replace('{p}', mainProc.toLowerCase()).replace('{s}', sysJoined).replace('{e}', a.email)}
              </p>
              <Link href="/" className="btn btn-outline" style={{ alignSelf: 'flex-start', fontSize: 16, padding: '14px 24px' }}>
                {t('backSite')}
              </Link>
            </div>
          )}

          {error && (
            <p role="alert" style={{ margin: 0, color: '#9B2C2C', fontWeight: 600 }}>
              {error}
            </p>
          )}

          {step >= 1 && step <= 8 && (
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: 12, borderTop: '1px solid var(--line)', paddingTop: 24 }}>
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
                style={{ fontSize: 16, fontWeight: 600, minHeight: 48, padding: '0 20px', border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--muted)' }}
              >
                ← {t('back')}
              </button>
              <div className="row" style={{ gap: 12, alignItems: 'center' }}>
                {(step === 7 || step === 8) && (
                  <button
                    type="button"
                    onClick={step === 7 ? reportOnly : () => { setBooked(false); setStep(9); }}
                    disabled={(step === 7 && !contactOk) || busy}
                    style={{ fontSize: 15, fontWeight: 600, minHeight: 48, padding: '0 18px', border: 0, background: 'transparent', cursor: 'pointer', textDecoration: 'underline', color: 'var(--muted)', opacity: step === 7 && !contactOk ? 0.4 : 1 }}
                  >
                    {step === 7 ? t('reportOnly') : t('skipCal')}
                  </button>
                )}
                {step !== 8 && (
                  <button
                    type="button"
                    onClick={next}
                    disabled={!canNext || busy}
                    className="btn"
                    style={{ fontSize: 17, minHeight: 52, padding: '0 28px', background: step >= 6 ? 'var(--mustard)' : 'var(--ink)', color: step >= 6 ? 'var(--ink)' : '#fff' }}
                  >
                    {busy ? t('saving') : nextLabel}
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        <SystemsMap a={a} lang={lang} connected={step >= 6} />
      </main>
    </div>
  );
}
