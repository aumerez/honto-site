"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";
import Link from "next/link";
import Navigation from "../../../components/Navigation";
import Footer from "../../../components/Footer";
import { useLocale } from "@/context/LocaleContext";

/* ─── Static data (non-translated: icons, colors, technical names) ─── */

const capabilityIcons = [
  <svg
    key="policy"
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
    key="credential"
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
    key="inspection"
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
    key="audit"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>,
  <svg
    key="ratelimit"
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
    key="mcp"
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

const capabilityColors = [
  "accent",
  "violet",
  "accent",
  "violet",
  "accent",
  "violet",
] as const;

const architectureCrates = [
  { name: "cli", desc: "CLI and subcommands" },
  { name: "proxy", desc: "HTTP/HTTPS forward proxy with TLS MITM" },
  { name: "mcp", desc: "MCP protocol gateway and routing" },
  { name: "config", desc: "Configuration parsing and schemas" },
  { name: "policy", desc: "Rule engine with YAML evaluation" },
  { name: "vault", desc: "Encrypted credential storage and sessions" },
  { name: "audit", desc: "Tamper-evident logging system" },
  { name: "inspect", desc: "Pattern matching and content scanning" },
  { name: "ratelimit", desc: "Token-bucket rate limiter" },
  { name: "common", desc: "Shared types and error definitions" },
];

const colorClasses = {
  accent: {
    iconBg: "bg-accent/10",
    iconText: "text-accent",
    hoverBorder: "hover:border-accent/30",
  },
  violet: {
    iconBg: "bg-violet/10",
    iconText: "text-violet",
    hoverBorder: "hover:border-violet/30",
  },
};

/* ─── Component ─── */

export default function BulwarkCaseStudy() {
  const { locale, t } = useLocale();
  const b = t.bulwark as Record<string, string>;

  const heroRef = useScrollReveal<HTMLDivElement>();
  const capabilitiesRef = useScrollRevealMultiple(0.08, 120);
  const pipelineRef = useScrollRevealMultiple(0.05, 100);
  const architectureRef = useScrollRevealMultiple(0.04, 60);
  const ctaRef = useScrollReveal<HTMLDivElement>();

  const stats = [
    { value: "487", label: b.statTests },
    { value: "10", label: b.statCrates },
    { value: "13", label: b.statPatterns },
    { value: "3", label: b.statModes },
  ];

  const capabilities = [
    { title: b.capPolicyTitle, description: b.capPolicyDesc },
    { title: b.capCredentialTitle, description: b.capCredentialDesc },
    { title: b.capInspectionTitle, description: b.capInspectionDesc },
    { title: b.capAuditTitle, description: b.capAuditDesc },
    { title: b.capRateLimitTitle, description: b.capRateLimitDesc },
    { title: b.capMcpTitle, description: b.capMcpDesc },
  ];

  const pipelineSteps = [
    { label: b.pipelineStep1, sub: b.pipelineStep1Sub },
    { label: b.pipelineStep2, sub: b.pipelineStep2Sub },
    { label: b.pipelineStep3, sub: b.pipelineStep3Sub },
    { label: b.pipelineStep4, sub: b.pipelineStep4Sub },
    { label: b.pipelineStep5, sub: b.pipelineStep5Sub },
    { label: b.pipelineStep6, sub: b.pipelineStep6Sub },
  ];

  const integrationModes = [
    {
      mode: "MCP Gateway (stdio)",
      transport: "JSON-RPC",
      useCase: "Local agents — Claude Code, OpenClaw",
    },
    {
      mode: "MCP Gateway (HTTP)",
      transport: "Streamable HTTP",
      useCase: "Remote agents, multi-agent setups",
    },
    {
      mode: "HTTP Proxy",
      transport: "HTTP/HTTPS + TLS MITM",
      useCase: "Any HTTP client",
    },
  ];

  const problems = [
    { problem: b.problemCredential, detail: b.problemCredentialDetail },
    { problem: b.problemPolicy, detail: b.problemPolicyDetail },
    { problem: b.problemContent, detail: b.problemContentDetail },
    { problem: b.problemAudit, detail: b.problemAuditDetail },
  ];

  const approachSteps = [
    { step: "01", title: b.approachStep1Title, desc: b.approachStep1Desc },
    { step: "02", title: b.approachStep2Title, desc: b.approachStep2Desc },
    { step: "03", title: b.approachStep3Title, desc: b.approachStep3Desc },
    { step: "04", title: b.approachStep4Title, desc: b.approachStep4Desc },
  ];

  return (
    <>
      <Navigation />
      <main>
        {/* ─── Hero ─── */}
        <section className="noise-overlay relative flex min-h-[70dvh] items-center overflow-hidden">
          <div
            className="grid-bg absolute inset-0 opacity-20"
            aria-hidden="true"
          />
          <div
            className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px] md:h-[700px] md:w-[700px]"
            aria-hidden="true"
          />
          <div
            className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-violet/5 blur-[100px]"
            aria-hidden="true"
          />

          <div
            ref={heroRef}
            className="reveal relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-32 md:px-8 md:pt-40"
          >
            <div className="mb-8 flex items-center gap-2 text-sm text-text-muted">
              <Link
                href={`/${locale}/case-studies`}
                className="transition-colors hover:text-accent"
              >
                {b.breadcrumbCaseStudies}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-text-secondary">{b.breadcrumbBulwark}</span>
            </div>

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {b.eyebrow}
              </span>
            </div>

            <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {b.title}
            </h1>
            <p className="mt-3 font-heading text-xl text-text-secondary md:text-2xl">
              {b.subtitle}
            </p>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-text-secondary">
              {b.description}
            </p>

            <div className="mt-12 grid grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-4 md:max-w-2xl">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading text-2xl font-bold text-accent md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs text-text-muted md:text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="https://github.com/claudius-ars/bulwark"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-bg transition-all hover:shadow-[0_0_32px_var(--color-accent-glow)] hover:brightness-110"
              >
                {b.viewOnGithub}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1"
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
              <a
                href="#architecture"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-medium text-text-secondary transition-all hover:border-accent/40 hover:text-accent"
              >
                {b.exploreArchitecture}
              </a>
            </div>
          </div>
        </section>

        {/* ─── The Problem ─── */}
        <section className="relative py-20 md:py-28">
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
          <div
            className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                  {b.challengeEyebrow}
                </span>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                  {b.challengeHeadingLine1}
                  <br />
                  <span className="gradient-text">
                    {b.challengeHeadingLine2}
                  </span>
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                  {b.challengeDescription}
                </p>
              </div>
              <div className="space-y-4">
                {problems.map((item) => (
                  <div
                    key={item.problem}
                    className="rounded-xl border border-danger/20 bg-danger/5 p-5"
                  >
                    <h3 className="font-heading text-base font-semibold text-danger">
                      {item.problem}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Core Capabilities ─── */}
        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-16 max-w-2xl md:mb-20">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {b.capabilitiesEyebrow}
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {b.capabilitiesHeading}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-text-secondary">
                {b.capabilitiesSubtitle}
              </p>
            </div>

            <div
              ref={capabilitiesRef}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {capabilities.map((cap, i) => {
                const colors = colorClasses[capabilityColors[i]];
                return (
                  <div
                    key={cap.title}
                    className={`reveal group relative overflow-hidden rounded-2xl border border-border bg-bg-card p-6 transition-all duration-300 ${colors.hoverBorder} hover:bg-bg-card-hover md:p-8`}
                  >
                    <div className="relative">
                      <div
                        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${colors.iconBg} ${colors.iconText}`}
                      >
                        {capabilityIcons[i]}
                      </div>
                      <h3 className="font-heading text-lg font-semibold md:text-xl">
                        {cap.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Request Pipeline ─── */}
        <section
          id="architecture"
          className="relative overflow-hidden py-20 md:py-28"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
          <div
            className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-violet/20 to-transparent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-16 text-center md:mb-20">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {b.architectureEyebrow}
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                {b.architectureHeading}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-text-secondary">
                {b.architectureSubtitle}
              </p>
            </div>

            <div
              ref={pipelineRef}
              className="flex flex-col items-center gap-3 md:gap-4"
            >
              {pipelineSteps.map((step, i) => (
                <div
                  key={step.label}
                  className="reveal flex flex-col items-center"
                >
                  <div
                    className={`w-full max-w-md rounded-xl border p-5 text-center transition-all duration-300 md:p-6 ${i === 0 ? "border-accent/30 bg-accent/5" : i === pipelineSteps.length - 1 ? "border-violet/30 bg-violet/5" : "border-border bg-bg-card hover:border-border-light hover:bg-bg-card-hover"}`}
                  >
                    <div
                      className={`font-heading text-base font-semibold md:text-lg ${i === 0 ? "text-accent" : i === pipelineSteps.length - 1 ? "text-violet" : "text-text-primary"}`}
                    >
                      {step.label}
                    </div>
                    <div className="mt-1 font-mono text-xs text-text-muted">
                      {step.sub}
                    </div>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div className="flex h-6 items-center justify-center md:h-8">
                      <svg
                        width="12"
                        height="20"
                        viewBox="0 0 12 20"
                        fill="none"
                        className="text-border-light"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 0v16M2 12l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-text-muted">
              {b.pipelineResponseNote}
            </p>
          </div>
        </section>

        {/* ─── Integration Modes ─── */}
        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-16 max-w-2xl md:mb-20">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {b.integrationEyebrow}
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                {b.integrationHeading}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-text-secondary">
                {b.integrationSubtitle}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-4 text-left font-heading text-sm font-semibold uppercase tracking-wider text-text-muted">
                      {b.tableMode}
                    </th>
                    <th className="pb-4 text-left font-heading text-sm font-semibold uppercase tracking-wider text-text-muted">
                      {b.tableTransport}
                    </th>
                    <th className="pb-4 text-left font-heading text-sm font-semibold uppercase tracking-wider text-text-muted">
                      {b.tableUseCase}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {integrationModes.map((row) => (
                    <tr
                      key={row.mode}
                      className="border-b border-border/50 transition-colors hover:bg-bg-card/50"
                    >
                      <td className="py-4 pr-6 font-mono text-sm font-medium text-accent">
                        {row.mode}
                      </td>
                      <td className="py-4 pr-6 text-sm text-text-secondary">
                        {row.transport}
                      </td>
                      <td className="py-4 text-sm text-text-secondary">
                        {row.useCase}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─── Rust Architecture ─── */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
          <div
            className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div className="mb-16 max-w-2xl md:mb-20">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {b.rustEyebrow}
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                {b.rustHeading}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-text-secondary">
                {b.rustSubtitle}
              </p>
            </div>

            <div
              ref={architectureRef}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
            >
              {architectureCrates.map((crate) => (
                <div
                  key={crate.name}
                  className="reveal rounded-lg border border-border bg-bg-card p-4 transition-all duration-300 hover:border-violet/30 hover:bg-bg-card-hover"
                >
                  <div className="font-mono text-sm font-semibold text-violet">
                    {crate.name}/
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-text-muted">
                    {crate.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How Honto Helped ─── */}
        <section className="relative py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  {b.approachEyebrow}
                </span>
                <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
                  {b.approachHeadingLine1}
                  <br />
                  <span className="gradient-text">
                    {b.approachHeadingLine2}
                  </span>
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                  {b.approachDescription}
                </p>
              </div>
              <div className="space-y-6">
                {approachSteps.map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-heading text-sm font-bold text-accent">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-semibold">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
          <div
            className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-accent/3 blur-[120px]"
            aria-hidden="true"
          />
          <div
            className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
            aria-hidden="true"
          />

          <div
            ref={ctaRef}
            className="reveal relative mx-auto max-w-3xl px-5 text-center md:px-8"
          >
            <h2 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
              {b.ctaHeadingLine1}
              <br />
              <span className="gradient-text">{b.ctaHeadingLine2}</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              {b.ctaDescription}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://github.com/claudius-ars/bulwark"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-bg transition-all hover:shadow-[0_0_32px_var(--color-accent-glow)] hover:brightness-110"
              >
                {b.ctaGithub}
              </a>
              <Link
                href={`/${locale}/#contact`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-medium text-text-secondary transition-all hover:border-accent/40 hover:text-accent"
              >
                {b.ctaTalkToTeam}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
