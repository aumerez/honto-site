'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Wordmark } from './Brand';
import { SHOW_SIGN_IN } from '@/lib/site';

const LINKS: { label: string; href: string; key?: string }[] = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Technical', href: '/technical', key: 'technical' },
  { label: 'Use cases', href: '/#use-cases' },
  { label: 'How we work', href: '/#how-we-work' },
  { label: 'Pricing', href: '/#what-you-get' },
];

/** Header contents: full menu on desktop, a three-line menu button on phones. */
export function SiteNav({ active, cta = 'Book a demo' }: { active?: string; cta?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth > 860 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  return (
    <>
      <div className="container bar">
        <Wordmark />
        <nav aria-label="Main" className="nav nav-desktop">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active && l.key === active ? 'page' : undefined} className={active && l.key === active ? 'is-active' : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="row header-cta" style={{ gap: 12, alignItems: 'center' }}>
          {SHOW_SIGN_IN && (
            <a href="https://app.honto.ai" style={{ textDecoration: 'none', fontSize: 15, fontWeight: 500, padding: '12px 6px' }}>
              Sign in
            </a>
          )}
          <Link href="/book" className="btn btn-dark">
            {cta}
          </Link>
        </div>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`burger${open ? ' is-open' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="Main" className="mobile-menu">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={active && l.key === active ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
          {SHOW_SIGN_IN && (
            <a href="https://app.honto.ai" onClick={() => setOpen(false)}>
              Sign in
            </a>
          )}
          <Link href="/book" className="btn btn-dark" onClick={() => setOpen(false)} style={{ marginTop: 8, fontSize: 17, minHeight: 52 }}>
            {cta}
          </Link>
        </nav>
      )}
    </>
  );
}
