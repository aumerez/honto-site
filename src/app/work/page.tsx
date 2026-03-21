import Link from "next/link";
import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Work — Honto",
  description:
    "Selected projects from Honto. Production-grade AI systems built with engineering discipline.",
};

const projects = [
  {
    slug: "bulwark",
    subtitle: "Agent Governance",
    title: "Bulwark",
    description:
      "A security-first middleware that sits between AI agents and external tools — enforcing policies, managing credentials, inspecting content, and maintaining tamper-evident audit trails.",
    tags: ["Rust", "MCP Protocol", "Policy Engine", "Credential Vault"],
  },
];

export default function Work() {
  return (
    <>
      <Navigation />
      <main>
        <section className="relative bg-bg-elevated pt-36 pb-20 md:pt-44 md:pb-28">
          <div
            className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-6 md:px-8">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
              Projects
            </p>
            <h1 className="mt-4 font-display text-fluid-xl font-medium italic">
              Work
            </h1>
            <p className="mt-5 max-w-xl text-fluid-body text-text-secondary">
              Selected projects. Each represents our commitment to
              engineering-grade AI infrastructure.
            </p>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid gap-6">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-bg-card p-8 transition-all duration-500 hover:border-accent/30 hover:bg-bg-card-hover md:p-12"
                >
                  <div
                    className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/[0.06] opacity-0 blur-[100px] transition-opacity duration-700 group-hover:opacity-100"
                    aria-hidden="true"
                  />

                  <div className="relative">
                    <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
                      {project.subtitle}
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-medium italic md:text-4xl">
                      {project.title}
                    </h2>
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
                      View project
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
      </main>
      <Footer />
    </>
  );
}
