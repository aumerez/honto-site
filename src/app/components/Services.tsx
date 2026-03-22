"use client";

import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";
import { useLocale } from "@/context/LocaleContext";

const serviceIcons = [
  <svg
    key="consulting"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>,
  <svg
    key="agents"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M12 12h.01" />
    <path d="M17 12h.01" />
    <path d="M7 12h.01" />
  </svg>,
  <svg
    key="skills"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>,
  <svg
    key="infra"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>,
  <svg
    key="rag"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
  </svg>,
];

export default function Services() {
  const { t } = useLocale();
  const s = t.services;
  const containerRef = useScrollRevealMultiple(0.08, 120);

  const services = [
    { title: s.consultingTitle, description: s.consultingDesc },
    { title: s.agentsTitle, description: s.agentsDesc },
    { title: s.skillsTitle, description: s.skillsDesc },
    { title: s.infraTitle, description: s.infraDesc },
    { title: s.ragTitle, description: s.ragDesc },
  ];

  return (
    <section
      id="services"
      className="relative py-24 md:py-32"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-16 max-w-2xl md:mb-20">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {s.eyebrow}
          </span>
          <h2
            id="services-heading"
            className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            {s.heading}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            {s.subtitle}
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => (
            <div
              key={service.title}
              className="reveal group relative overflow-hidden rounded-2xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:bg-bg-card-hover md:p-8"
            >
              <div
                className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/5 opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="relative">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  {serviceIcons[i]}
                </div>
                <h3 className="font-heading text-lg font-semibold md:text-xl">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
