'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { OrbitLogo } from './Brand';
import { SiteNav } from './SiteNav';

const WORDS = [
  'Security',
  'Connect all systems',
  'Document management',
  'Business knowledge',
  'Accountability',
  'Token efficiency',
  'Automation of your entire business, every week.',
];
const STEP_PX = 340;

/** Header + scroll-driven intro. The header shows at the very top, hides while the
 *  intro plays, and comes back once the last word has appeared. */
export function HomeTop() {
  const ref = useRef<HTMLElement>(null);
  const [animated, setAnimated] = useState(true);
  const [progress, setProgress] = useState(0);
  // Scale the intro down when it is taller than the screen (small phones), so nothing is cut off.
  const stageRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);

  useEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const box = fitRef.current;
      if (!stage || !box) return;
      const cs = getComputedStyle(stage);
      const avail = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const needed = box.offsetHeight;
      setFit(needed > 0 && avail > 0 ? Math.min(1, avail / needed) : 1);
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => undefined);
    return () => window.removeEventListener('resize', measure);
  }, [animated]);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    setProgress(span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setAnimated(!mq.matches);
    apply();
    mq.addEventListener('change', apply);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    return () => {
      mq.removeEventListener('change', apply);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onScroll]);

  const n = WORDS.length;
  const raw = animated ? progress * (n + 1.6) : n + 2;
  const line2 = Math.min(1, Math.max(0, raw));
  const shown = raw - 1;
  const current = Math.min(n - 1, Math.floor(shown - 0.0001));
  const navOn = !animated || progress <= 0.01 || progress >= 0.97;

  return (
    <>
      <header className={`site-header${animated ? ' is-fixed' : ''}${navOn ? '' : ' is-hidden'}`} aria-hidden={!navOn || undefined}>
        <SiteNav />
      </header>

      <section
        ref={ref}
        className={`intro${animated ? ' is-animated' : ''}`}
        style={animated ? { height: `calc(100svh + ${(n + 1) * STEP_PX + 200}px)` } : undefined}
      >
        <div className="intro-stage" ref={stageRef}>
          <div className="intro-fit" ref={fitRef} style={{ transform: fit < 1 ? `scale(${fit})` : undefined }}>
          <OrbitLogo />
          <div className="stack" style={{ alignItems: 'center', gap: 10 }}>
            <h1>AI platform for connected business operations</h1>
            <p className="line2" style={{ opacity: line2, transform: `translateY(${(1 - line2) * 20}px)` }}>
              Break silos and grow your business.
            </p>
          </div>
          <ul aria-label="What Honto brings">
            {WORDS.map((w, i) => {
              const t = Math.min(1, Math.max(0, shown - i));
              const last = i === n - 1;
              const isCurrent = !animated || i === current || last;
              return (
                <li
                  key={w}
                  className={last ? 'last' : undefined}
                  style={{
                    opacity: t,
                    transform: `translateY(${(1 - t) * 28}px)`,
                    color: isCurrent ? 'var(--ink)' : 'var(--muted-3)',
                    background: last && t > 0.6 ? 'var(--mustard)' : 'transparent',
                  }}
                >
                  {w}
                </li>
              );
            })}
          </ul>
          </div>
          <div className="scroll-hint" aria-hidden="true" style={{ opacity: animated && progress < 0.04 ? 1 : 0 }}>
            SCROLL ↓
          </div>
        </div>
      </section>
    </>
  );
}
