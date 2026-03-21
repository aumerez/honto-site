"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";

const features = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: "Knowledge Capture",
    description:
      "Automatically extract and structure expert knowledge from projects, decisions, and technical discussions.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Consistent Expertise",
    description:
      "Ensure every team member has access to the same quality of analysis and decision-making frameworks.",
  },
  {
    icon: (
      <svg
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
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Decision Support",
    description:
      "AI-assisted analysis grounded in your organization's historical data, standards, and proven methodologies.",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
    title: "Scale Expertise",
    description:
      "Multiply your best engineers' impact. Expert-level thinking available to every team, every project, every decision.",
  },
];

export default function CoreProduct() {
  const headingRef = useScrollReveal<HTMLDivElement>();
  const featuresRef = useScrollRevealMultiple(0.1, 150);

  return (
    <section
      id="product"
      className="relative overflow-hidden py-24 md:py-32"
      aria-labelledby="product-heading"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
      <div
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Content */}
          <div ref={headingRef} className="reveal">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
              Core Product
            </span>
            <h2
              id="product-heading"
              className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
            >
              The Expert
              <br />
              <span className="gradient-text">Intelligence Platform</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              An AI layer that augments your engineering experts. Capture what
              they know, make it reusable across teams, and ensure every
              response is reliable, traceable, and aligned with proven
              expertise.
            </p>
            <div className="mt-8">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 font-medium text-accent transition-all hover:gap-3"
              >
                Learn more
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
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
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div ref={featuresRef} className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="reveal rounded-xl border border-border bg-bg-card p-5 transition-all duration-300 hover:border-violet/30 hover:bg-bg-card-hover"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-violet">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-base font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
