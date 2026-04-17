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
              <span>Honto — AI systems engineering</span>
            </div>
            <div className="row" style={{ color: "var(--fg-mute)" }}>
              v.26 / EN · ES
            </div>
          </div>

          <h1 className="hero-title">
            <span className="line">AI systems that</span>
            <span className="line">
              think <i>like your</i>
            </span>
            <span className="line">
              best{" "}
              <span className="tag">
                <span className="signal" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <span />
                </span>
                production-grade
              </span>
              engineers.
            </span>
          </h1>

          <p className="hero-sub">
            We capture what your senior engineers know — their decisions,
            heuristics, and standards — and ship it as production AI your whole
            organization can use.
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
            <div>Zürich / Madrid / Remote</div>
          </div>
        </div>
      </div>
    </section>
  );
}
