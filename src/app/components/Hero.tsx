"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Hero() {
  const { locale, t } = useLocale();
  const h = t.hero;

  return (
    <section
      className="noise-overlay relative flex min-h-[100dvh] items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background Grid */}
      <div className="grid-bg absolute inset-0 opacity-30" aria-hidden="true" />

      {/* Radial Glow */}
      <div
        className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px] md:h-[900px] md:w-[900px]"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-violet/5 blur-[100px]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-28 md:px-8 md:pt-32">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="animate-fade-in mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {h.eyebrow}
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {h.titleLine1}
            <br />
            <span className="gradient-text">{h.titleLine2}</span>
          </h1>

          {/* Subheadline */}
          <p
            className="animate-fade-in-up mt-6 max-w-2xl font-body text-lg leading-relaxed text-text-secondary md:text-xl"
            style={{ animationDelay: "0.15s" }}
          >
            {h.subtitle}
          </p>

          {/* CTAs */}
          <div
            className="animate-fade-in-up mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href={`/${locale}/#services`}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-bg transition-all hover:shadow-[0_0_32px_var(--color-accent-glow)] hover:brightness-110"
            >
              {h.exploreServices}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href={`/${locale}/#contact`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-medium text-text-secondary transition-all hover:border-accent/40 hover:text-accent"
            >
              {h.contactUs}
            </a>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in-up mt-16 grid grid-cols-3 gap-6 border-t border-border pt-8 md:max-w-lg"
            style={{ animationDelay: "0.45s" }}
          >
            {[
              { value: "99.9%", label: h.statUptime },
              { value: "10x", label: h.statDecisions },
              { value: "<2s", label: h.statResponse },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-heading text-2xl font-bold text-accent md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-text-muted md:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float"
        aria-hidden="true"
      >
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-border-light p-1">
          <div className="h-1.5 w-1 rounded-full bg-accent animate-pulse-glow" />
        </div>
      </div>
    </section>
  );
}
