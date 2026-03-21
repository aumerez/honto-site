"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CompressedAbout() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      className="relative py-28 md:py-36"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div ref={ref} className="reveal grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
              About
            </p>
            <h2
              id="about-heading"
              className="mt-4 font-display text-fluid-lg font-medium italic"
            >
              Small team,
              <br />
              deep expertise
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-fluid-body text-text-secondary">
              Honto is an engineering consultancy focused on AI systems. We
              favor small teams with deep expertise over large staffing
              engagements. Our work ships with tests, documentation, and
              operational runbooks — because building it is only half the job.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-wider text-accent transition-colors hover:text-accent-dim"
            >
              How we work
              <span className="h-px w-8 bg-current" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
