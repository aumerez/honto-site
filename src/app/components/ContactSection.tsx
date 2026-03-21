"use client";

import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ContactSection() {
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <section
      className="relative bg-bg-elevated py-28 md:py-36"
      aria-labelledby="contact-heading"
    >
      {/* Top border */}
      <div
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-teal/20 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div ref={ref} className="reveal max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
            Contact
          </p>
          <h2
            id="contact-heading"
            className="mt-4 font-display text-fluid-lg font-medium italic"
          >
            Let&apos;s talk about your system
          </h2>
          <p className="mt-4 text-fluid-body text-text-secondary">
            For project inquiries or technical questions — we typically respond
            within one business day.
          </p>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <a
              href="mailto:hello@honto.ai"
              className="inline-flex items-center gap-3 font-mono text-sm font-medium uppercase tracking-wider text-accent transition-colors hover:text-accent-dim"
            >
              hello@honto.ai
              <span className="h-px w-8 bg-current" aria-hidden="true" />
            </a>
            <Link
              href="/contact"
              className="font-mono text-xs font-medium uppercase tracking-wider text-text-muted transition-colors hover:text-teal"
            >
              Contact page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
