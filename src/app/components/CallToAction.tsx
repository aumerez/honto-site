"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale } from "@/context/LocaleContext";

const CONTACT_EMAIL = "info@honto.ai";

export default function CallToAction() {
  const { t } = useLocale();
  const c = t.callToAction;
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="reveal relative overflow-hidden py-24 md:py-32"
      aria-labelledby="contact-heading"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-bg via-bg-elevated to-bg"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/3 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
          {c.eyebrow}
        </span>
        <h2
          id="contact-heading"
          className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
        >
          {c.headingLine1}
          <br />
          <span className="gradient-text">{c.headingLine2}</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
          {c.description}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 font-mono text-base font-semibold text-bg transition-all hover:shadow-[0_0_32px_var(--color-accent-glow)] hover:brightness-110"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            {CONTACT_EMAIL}
          </a>
          <p className="text-xs text-text-muted">{c.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
