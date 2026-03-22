"use client";

import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useLocale } from "@/context/LocaleContext";

const colorMap = {
  accent: {
    border: "border-accent/20 hover:border-accent/40",
    tag: "bg-accent/10 text-accent",
    eyebrow: "text-accent",
    glow: "bg-accent/5",
  },
  violet: {
    border: "border-violet/20 hover:border-violet/40",
    tag: "bg-violet/10 text-violet",
    eyebrow: "text-violet",
    glow: "bg-violet/5",
  },
};

export default function CaseStudies() {
  const { locale, t } = useLocale();
  const cs = t.caseStudiesPage;

  const caseStudies = [
    {
      slug: "bulwark",
      eyebrow: cs.bulwarkEyebrow,
      title: cs.bulwarkTitle,
      subtitle: cs.bulwarkSubtitle,
      description: cs.bulwarkDescription,
      tags: [
        "Rust",
        "MCP Protocol",
        "Policy Engine",
        "Credential Vault",
        "Audit Logging",
      ],
      color: "accent" as const,
    },
    {
      slug: "engram",
      eyebrow: cs.engramEyebrow,
      title: cs.engramTitle,
      subtitle: cs.engramSubtitle,
      description: cs.engramDescription,
      tags: [
        "Rust",
        "BM25 Search",
        "Causal Graphs",
        "Multi-Tier Cache",
        "Tantivy",
      ],
      color: "violet" as const,
    },
  ];

  return (
    <>
      <Navigation />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div
            className="absolute inset-0 bg-bg-elevated opacity-50"
            aria-hidden="true"
          />
          <div
            className="absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {cs.eyebrow}
            </span>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {cs.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
              {cs.subtitle}
            </p>
          </div>
        </section>

        {/* Case Study Cards */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-6">
              {caseStudies.map((study) => {
                const colors = colorMap[study.color];
                return (
                  <Link
                    key={study.slug}
                    href={`/${locale}/case-studies/${study.slug}`}
                    className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-bg-card p-8 transition-all duration-300 hover:bg-bg-card-hover md:p-10`}
                  >
                    <div
                      className={`absolute -right-16 -top-16 h-64 w-64 rounded-full ${colors.glow} opacity-0 blur-[80px] transition-opacity duration-500 group-hover:opacity-100`}
                      aria-hidden="true"
                    />

                    <div className="relative">
                      <span
                        className={`font-mono text-xs font-medium uppercase tracking-[0.2em] ${colors.eyebrow}`}
                      >
                        {study.eyebrow}
                      </span>

                      <div className="mt-4 flex items-baseline gap-4">
                        <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
                          {study.title}
                        </h2>
                        <span className="hidden text-lg text-text-muted sm:inline">
                          /
                        </span>
                        <span className="hidden text-lg text-text-secondary sm:inline">
                          {study.subtitle}
                        </span>
                      </div>
                      <p className="mt-2 text-lg text-text-secondary sm:hidden">
                        {study.subtitle}
                      </p>

                      <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-secondary">
                        {study.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {study.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full px-3 py-1 font-mono text-xs ${colors.tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-8 inline-flex items-center gap-2 font-medium text-accent transition-all group-hover:gap-3">
                        {cs.readCaseStudy}
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
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
