"use client";

import Link from "next/link";
import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";

const projects = [
  {
    slug: "bulwark",
    title: "Bulwark",
    subtitle: "Agent Governance",
    description:
      "Open-source security middleware for AI agents. Policy enforcement, credential vaulting, content inspection, and tamper-evident audit logging — 10 Rust crates, 487 unit tests.",
    tags: ["Rust", "MCP Protocol", "Policy Engine", "Credential Vault"],
  },
];

export default function SelectedWork() {
  const containerRef = useScrollRevealMultiple(0.08, 100);

  return (
    <section className="relative py-28 md:py-36" aria-labelledby="work-heading">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
            Selected Work
          </p>
          <h2
            id="work-heading"
            className="mt-4 font-display text-fluid-lg font-medium italic"
          >
            Projects that shipped
          </h2>
        </div>

        <div ref={containerRef} className="grid gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/work/${project.slug}`}
              className="reveal group relative overflow-hidden rounded-2xl border border-border bg-bg-card p-8 transition-all duration-500 hover:border-accent/30 hover:bg-bg-card-hover md:p-12"
            >
              {/* Hover glow */}
              <div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/[0.06] opacity-0 blur-[100px] transition-opacity duration-700 group-hover:opacity-100"
                aria-hidden="true"
              />

              <div className="relative">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
                  {project.subtitle}
                </p>
                <h3 className="mt-3 font-display text-3xl font-medium italic md:text-4xl">
                  {project.title}
                </h3>
                <p className="mt-4 max-w-2xl text-fluid-body text-text-secondary">
                  {project.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border-light px-3 py-1 font-mono text-[11px] text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-8 inline-flex items-center gap-3 font-mono text-xs font-medium uppercase tracking-wider text-text-muted transition-colors group-hover:text-accent">
                  Read case study
                  <span
                    className="h-px w-6 bg-current transition-all group-hover:w-10"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
