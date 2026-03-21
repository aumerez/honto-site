"use client";

import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";

const steps = [
  {
    number: "01",
    title: "Map",
    description:
      "We analyze your domain, processes, and expert knowledge to identify what to capture and systematize.",
    color: "text-accent",
    bg: "bg-accent/10",
    borderHover: "hover:border-accent/30",
  },
  {
    number: "02",
    title: "Build",
    description:
      "We architect AI systems tailored to your workflows — agents, skills, knowledge pipelines, and integrations.",
    color: "text-violet",
    bg: "bg-violet/10",
    borderHover: "hover:border-violet/30",
  },
  {
    number: "03",
    title: "Deploy",
    description:
      "Production-grade deployment with security, monitoring, and observability built in from day one.",
    color: "text-accent",
    bg: "bg-accent/10",
    borderHover: "hover:border-accent/30",
  },
  {
    number: "04",
    title: "Scale",
    description:
      "Expand across teams and use cases. Continuous learning ensures the system improves with every interaction.",
    color: "text-violet",
    bg: "bg-violet/10",
    borderHover: "hover:border-violet/30",
  },
];

export default function HowItWorks() {
  const stepsRef = useScrollRevealMultiple(0.1, 180);

  return (
    <section
      id="how-it-works"
      className="relative py-24 md:py-32"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center md:mb-20">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Process
          </span>
          <h2
            id="how-heading"
            className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
            A proven methodology for turning expert knowledge into scalable AI
            systems.
          </p>
        </div>

        {/* Steps */}
        <div
          ref={stepsRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <div
              key={step.number}
              className={`reveal group relative overflow-hidden rounded-2xl border border-border bg-bg-card p-6 transition-all duration-300 ${step.borderHover} hover:bg-bg-card-hover md:p-8`}
            >
              {/* Step Number */}
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${step.bg} font-heading text-lg font-bold ${step.color}`}
              >
                {step.number}
              </div>

              <h3 className="font-heading text-xl font-bold md:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                {step.description}
              </p>

              {/* Connector line (hidden on last) */}
              <div
                className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 bg-border lg:block last:lg:hidden"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
