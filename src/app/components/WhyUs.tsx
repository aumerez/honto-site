"use client";

import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";
import { useLocale } from "@/context/LocaleContext";

const differentiatorIcons = [
  <svg
    key="standards"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  <svg
    key="security"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>,
  <svg
    key="devops"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>,
  <svg
    key="production"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>,
  <svg
    key="reliable"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>,
  <svg
    key="domain"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>,
];

export default function WhyUs() {
  const { t } = useLocale();
  const w = t.whyUs;
  const cardsRef = useScrollRevealMultiple(0.06, 100);

  const differentiators = [
    { title: w.standardsTitle, description: w.standardsDesc },
    { title: w.securityTitle, description: w.securityDesc },
    { title: w.devopsTitle, description: w.devopsDesc },
    { title: w.productionTitle, description: w.productionDesc },
    { title: w.reliableTitle, description: w.reliableDesc },
    { title: w.domainTitle, description: w.domainDesc },
  ];

  return (
    <section
      id="why-us"
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="why-heading"
    >
      <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
      <div
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-violet/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-16 text-center md:mb-20">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
            {w.eyebrow}
          </span>
          <h2
            id="why-heading"
            className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            {w.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
            {w.subtitle}
          </p>
        </div>

        <div
          ref={cardsRef}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {differentiators.map((item, i) => (
            <div
              key={item.title}
              className="reveal group flex gap-4 rounded-xl border border-border bg-bg-card p-5 transition-all duration-300 hover:border-violet/30 hover:bg-bg-card-hover md:p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet/10 text-violet">
                {differentiatorIcons[i]}
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
