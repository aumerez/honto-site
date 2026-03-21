"use client";

import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";

const practices = [
  {
    number: "01",
    title: "Strategy & Architecture",
    description:
      "Assessing your operations, identifying high-impact opportunities, and designing implementation roadmaps grounded in engineering reality — not slide decks.",
  },
  {
    number: "02",
    title: "Agent Systems",
    description:
      "Autonomous agents, governance layers, and the production infrastructure to run them reliably. We build the guardrails so your agents can move fast.",
  },
  {
    number: "03",
    title: "Knowledge Systems & RAG",
    description:
      "Retrieval-augmented generation pipelines that ground AI responses in your organization's actual data and institutional knowledge.",
  },
  {
    number: "04",
    title: "Custom AI Modules",
    description:
      "Domain-specific AI capabilities encoding your processes, standards, and decision frameworks into reusable, testable modules.",
  },
];

export default function Services() {
  const containerRef = useScrollRevealMultiple(0.08, 120);

  return (
    <section
      id="services"
      className="relative bg-bg-elevated py-28 md:py-36"
      aria-labelledby="services-heading"
    >
      {/* Top border */}
      <div
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border-light to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mb-16 max-w-2xl md:mb-20">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
            Areas of Practice
          </p>
          <h2
            id="services-heading"
            className="mt-4 font-display text-fluid-lg font-medium italic"
          >
            From strategy through production
          </h2>
          <p className="mt-4 text-fluid-body text-text-secondary">
            We work across the full lifecycle of AI systems. Every engagement
            ends with infrastructure your team can operate independently.
          </p>
        </div>

        <div
          ref={containerRef}
          className="grid gap-px bg-border sm:grid-cols-2"
        >
          {practices.map((practice) => (
            <div
              key={practice.title}
              className="reveal bg-bg-elevated p-8 transition-colors duration-300 hover:bg-bg-card md:p-10"
            >
              <span className="font-mono text-xs text-accent">
                {practice.number}
              </span>
              <h3 className="mt-3 font-display text-xl font-medium italic md:text-2xl">
                {practice.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                {practice.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
