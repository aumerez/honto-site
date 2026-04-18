"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/context/LocaleContext";

type HeroCopy = {
  ariaLabel: string;
  tagline: string;
  version: string;
  titleLine1: string;
  titleLine2Pre: string;
  titleLine2Italic: string;
  titleLine3Italic: string;
  titleLine3: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  strip1: string;
  strip2: string;
  strip3: string;
  location: string;
};

export default function Hero() {
  const orbRef = useRef<HTMLDivElement | null>(null);
  const { t } = useLocale();
  const hero = (t.landing as { hero: HeroCopy }).hero;

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
    <section className="hero" id="top" aria-label={hero.ariaLabel}>
      <div ref={orbRef} className="hero-orb" aria-hidden="true" />
      <div className="container-x">
        <div className="hero-grid">
          <div className="hero-meta">
            <div className="row">
              <span className="sq" />
              <span>{hero.tagline}</span>
            </div>
            <div className="row" style={{ color: "var(--fg-mute)" }}>
              {hero.version}
            </div>
          </div>

          <h1 className="hero-title">
            <span className="line">{hero.titleLine1}</span>
            <span className="line">
              {hero.titleLine2Pre}
              {hero.titleLine2Italic ? <i>{hero.titleLine2Italic}</i> : null}
            </span>
            <span className="line">
              {hero.titleLine3Italic ? <i>{hero.titleLine3Italic}</i> : null}
              {hero.titleLine3}
            </span>
          </h1>

          <p className="hero-sub">{hero.subtitle}</p>

          <div className="hero-cta">
            <a href="#contact" className="btn primary">
              {hero.ctaPrimary}
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
              {hero.ctaSecondary}
            </a>
          </div>

          <div className="hero-strip">
            <div className="l">
              <span>{hero.strip1}</span>
              <span>{hero.strip2}</span>
              <span>{hero.strip3}</span>
            </div>
            <div>{hero.location}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
