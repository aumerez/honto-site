"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const orbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!orbRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 80;
      const y = (e.clientY / window.innerHeight - 0.5) * 60;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="hero" id="top" aria-label="Hero">
      <div ref={orbRef} className="hero-orb" aria-hidden="true" />
      <div className="container-x">
        <div className="hero-grid">
          <div className="hero-meta">
            <div className="row">
              <span className="sq" />
              <span>Honto — the enterprise second brain</span>
            </div>
            <div className="row" style={{ color: "var(--fg-mute)" }}>
              v.26 / EN · ES
            </div>
          </div>

          <h1 className="hero-title">
            <span className="line">From static knowledge</span>
            <span className="line">
              to <i>scaled</i>
            </span>
            <span className="line">execution.</span>
          </h1>

          <p className="hero-sub">
            Honto captures your company&apos;s expertise — decisions,
            heuristics, standards — and puts it to work as AI agents. What used
            to live in docs, silos, and people&apos;s heads now runs across
            every team.
          </p>

          <div className="hero-cta">
            <a href="#contact" className="btn primary">
              Start an engagement
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </a>
            <a href="#problems" className="btn">
              See what we solve
            </a>
          </div>

          <div className="hero-strip">
            <div className="l">
              <span>[01] Production-proven</span>
              <span>[02] Audited &amp; traceable</span>
              <span>[03] Domain-native</span>
            </div>
            <div>Palo Alto, CA</div>
          </div>
        </div>
      </div>
    </section>
  );
}
