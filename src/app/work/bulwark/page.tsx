"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";
import Link from "next/link";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

/* ─── Data ─── */

const coreCapabilities = [
  {
    number: "01",
    title: "Policy Enforcement",
    description:
      "YAML-based rules control which tools agents can use. Glob patterns, scope-based precedence, priority ordering, and hot-reload without restart.",
  },
  {
    number: "02",
    title: "Credential Management",
    description:
      "Agents never see real secrets. Bulwark injects credentials at the last mile before tool invocation. Encrypted at rest using age encryption.",
  },
  {
    number: "03",
    title: "Content Inspection",
    description:
      "13 built-in detection patterns scan for AWS keys, GitHub tokens, private keys, PII, and prompt injection. Automatic blocking or redaction.",
  },
  {
    number: "04",
    title: "Audit Logging",
    description:
      "Every action recorded in a tamper-evident SQLite database with Blake3 hash chains. Real-time tailing, search, export, and cryptographic verification.",
  },
  {
    number: "05",
    title: "Rate Limiting",
    description:
      "Token-bucket rate limits per session, operator, tool, or globally. Cost tracking with budget enforcement to prevent runaway spending.",
  },
  {
    number: "06",
    title: "MCP-Native",
    description:
      "Works as an MCP gateway (stdio or HTTP) or HTTP forward proxy. Governance metadata attached to every tool call response.",
  },
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

const pipelineSteps = [
  { label: "Agent Request", sub: "Claude, Codex, OpenClaw" },
  { label: "Session Validation", sub: "Identity & TTL" },
  { label: "Content Inspection", sub: "Secrets, PII, Injection" },
  { label: "Policy Evaluation", sub: "YAML rules engine" },
  { label: "Credential Injection", sub: "age-encrypted vault" },
  { label: "Upstream Tool", sub: "API / MCP Server" },
];

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

const stats = [
  { value: "487", label: "Unit tests" },
  { value: "10", label: "Rust crates" },
  { value: "13", label: "Detection patterns" },
  { value: "3", label: "Integration modes" },
];

/* ─── Component ─── */

export default function BulwarkCaseStudy() {
  const heroRef = useScrollReveal<HTMLDivElement>();
  const capabilitiesRef = useScrollRevealMultiple(0.08, 120);
  const pipelineRef = useScrollRevealMultiple(0.05, 100);
  const architectureRef = useScrollRevealMultiple(0.04, 60);
  const ctaRef = useScrollReveal<HTMLDivElement>();

  return (
    <>
      <Navigation />
      <main>
        {/* ─── Hero ─── */}
        <section className="noise-overlay relative overflow-hidden bg-bg-elevated pt-36 pb-24 md:pt-44 md:pb-32">
          <div
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[150px]"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
            aria-hidden="true"
          />

          <div
            ref={heroRef}
            className="reveal relative z-10 mx-auto w-full max-w-6xl px-6 md:px-8"
          >
            {/* Breadcrumb */}
            <div className="mb-8 flex items-center gap-2 font-mono text-xs text-text-muted">
              <Link
                href="/work"
                className="transition-colors hover:text-accent"
              >
                Work
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-text-secondary">Bulwark</span>
            </div>

            {/* Eyebrow */}
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
              Authentication & Agent Governance
            </p>

            {/* Title */}
            <h1 className="mt-4 font-display text-fluid-xl font-medium italic">
              Bulwark
            </h1>
            <p className="mt-3 text-fluid-md text-text-secondary">
              Open-source governance layer for AI agents
            </p>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-fluid-body text-text-secondary">
              AI agents are powerful but ungoverned. They can access any tool,
              leak any credential, and leave no audit trail. Bulwark sits
              between AI agents and external tools — enforcing policies,
              managing credentials, inspecting content, and maintaining a
              complete, tamper-evident audit trail.
            </p>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-border pt-8 sm:grid-cols-4 md:max-w-2xl">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-medium text-accent md:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <a
                href="https://github.com/claudius-ars/bulwark"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-mono text-sm font-medium uppercase tracking-wider text-accent transition-colors hover:text-accent-dim"
              >
                View on GitHub
                <span className="h-px w-8 bg-current" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        {/* ─── The Problem ─── */}
        <section className="relative py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
                  The Challenge
                </p>
                <h2 className="mt-4 font-display text-fluid-lg font-medium italic">
                  AI agents operate
                  <br />
                  without guardrails
                </h2>
                <p className="mt-6 text-fluid-body text-text-secondary">
                  When AI agents interact with payment processors, compliance
                  systems, privacy-sensitive APIs, and regulated infrastructure,
                  the stakes are existential. A single leaked credential or
                  unauthorized API call can trigger regulatory violations, data
                  breaches, and financial loss.
                </p>
              </div>
              <div className="space-y-4">
                {[
                  {
                    problem: "No credential isolation",
                    detail:
                      "Agents receive raw API keys and tokens, with no boundary between access and exposure.",
                  },
                  {
                    problem: "No policy enforcement",
                    detail:
                      "Every agent has implicit access to every tool. No per-agent, per-session, or per-operator controls.",
                  },
                  {
                    problem: "No content inspection",
                    detail:
                      "Sensitive data flows through agent pipelines unscanned — PII, secrets, and injection attacks pass unchecked.",
                  },
                  {
                    problem: "No audit trail",
                    detail:
                      "When something goes wrong, there is no verifiable record of what happened, when, or why.",
                  },
                ].map((item) => (
                  <div
                    key={item.problem}
                    className="border-l-2 border-danger/40 bg-danger/[0.04] p-5 pl-6"
                  >
                    <h3 className="font-body text-base font-semibold text-danger">
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
        <section className="relative bg-bg-elevated py-24 md:py-32">
          <div
            className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border-light to-transparent"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-16 max-w-2xl md:mb-20">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
                Capabilities
              </p>
              <h2 className="mt-4 font-display text-fluid-lg font-medium italic">
                Six layers of governance
              </h2>
              <p className="mt-4 text-fluid-body text-text-secondary">
                Every request passes through a multi-stage pipeline. Each layer
                enforces a different security boundary.
              </p>
            </div>

            <div
              ref={capabilitiesRef}
              className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3"
            >
              {coreCapabilities.map((cap) => (
                <div
                  key={cap.title}
                  className="reveal bg-bg-elevated p-8 transition-colors duration-300 hover:bg-bg-card md:p-10"
                >
                  <span className="font-mono text-xs text-accent">
                    {cap.number}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-medium italic md:text-xl">
                    {cap.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary md:text-base">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Request Pipeline ─── */}
        <section id="architecture" className="relative py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-16 text-center md:mb-20">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
                Architecture
              </p>
              <h2 className="mt-4 font-display text-fluid-lg font-medium italic">
                Request pipeline
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-fluid-body text-text-secondary">
                Every agent interaction flows through a deterministic, auditable
                pipeline before reaching upstream tools.
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
                    className={`w-full max-w-md rounded-xl border p-5 text-center transition-all duration-300 md:p-6 ${
                      i === 0
                        ? "border-accent/30 bg-accent/[0.04]"
                        : i === pipelineSteps.length - 1
                          ? "border-teal/30 bg-teal/[0.04]"
                          : "border-border bg-bg-card hover:border-border-light hover:bg-bg-card-hover"
                    }`}
                  >
                    <div
                      className={`font-display text-base font-medium italic md:text-lg ${
                        i === 0
                          ? "text-accent"
                          : i === pipelineSteps.length - 1
                            ? "text-teal"
                            : "text-text-primary"
                      }`}
                    >
                      {step.label}
                    </div>
                    <div className="mt-1 font-mono text-[11px] text-text-muted">
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

            <p className="mt-8 text-center font-mono text-[11px] text-text-muted">
              Response path mirrors the pipeline in reverse — content inspection
              and audit logging on every response.
            </p>
          </div>
        </section>

        {/* ─── Integration Modes ─── */}
        <section className="relative bg-bg-elevated py-24 md:py-32">
          <div
            className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border-light to-transparent"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-16 max-w-2xl md:mb-20">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
                Integration
              </p>
              <h2 className="mt-4 font-display text-fluid-lg font-medium italic">
                Three modes, any agent
              </h2>
              <p className="mt-4 text-fluid-body text-text-secondary">
                Bulwark adapts to your agent architecture. Local development,
                remote multi-agent systems, or legacy HTTP clients — one
                governance layer handles all.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-4 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-text-muted">
                      Mode
                    </th>
                    <th className="pb-4 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-text-muted">
                      Transport
                    </th>
                    <th className="pb-4 text-left font-mono text-[11px] font-medium uppercase tracking-wider text-text-muted">
                      Use Case
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
        <section className="relative py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="mb-16 max-w-2xl md:mb-20">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
                Under the hood
              </p>
              <h2 className="mt-4 font-display text-fluid-lg font-medium italic">
                Built in Rust, 10 crates
              </h2>
              <p className="mt-4 text-fluid-body text-text-secondary">
                A modular Rust workspace where each security boundary is its own
                crate — independently testable, auditable, and replaceable.
              </p>
            </div>

            <div
              ref={architectureRef}
              className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5"
            >
              {architectureCrates.map((crate) => (
                <div
                  key={crate.name}
                  className="reveal bg-bg p-4 transition-colors duration-300 hover:bg-bg-card"
                >
                  <div className="font-mono text-sm font-semibold text-accent">
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
        <section className="relative bg-bg-elevated py-24 md:py-32">
          <div
            className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-border-light to-transparent"
            aria-hidden="true"
          />
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  Our Approach
                </p>
                <h2 className="mt-4 font-display text-fluid-lg font-medium italic">
                  How we engineered Bulwark
                </h2>
                <p className="mt-6 text-fluid-body text-text-secondary">
                  Bulwark represents our philosophy in practice:
                  production-grade AI infrastructure built with engineering
                  discipline. Every design decision prioritizes security,
                  auditability, and operational reliability.
                </p>
              </div>
              <div className="space-y-8">
                {[
                  {
                    step: "01",
                    title: "Threat Modeling",
                    desc: "Mapped every attack surface where AI agents interact with sensitive systems — payments, compliance, privacy, and credentials.",
                  },
                  {
                    step: "02",
                    title: "Zero-Trust Architecture",
                    desc: "Designed a pipeline where agents never directly access secrets or tools. Every interaction is mediated, inspected, and logged.",
                  },
                  {
                    step: "03",
                    title: "Modular Rust Workspace",
                    desc: "10 independent crates, each owning a security boundary. 487 unit tests ensure correctness at every layer.",
                  },
                  {
                    step: "04",
                    title: "Open-Source Release",
                    desc: "Apache 2.0 licensed. Transparent, auditable, and community-driven — because security tools must be verifiable.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center font-mono text-sm font-bold text-accent">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-body text-base font-semibold">
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
        <section className="relative py-24 md:py-32">
          <div
            ref={ctaRef}
            className="reveal mx-auto max-w-2xl px-6 text-center md:px-8"
          >
            <h2 className="font-display text-fluid-lg font-medium italic">
              Need agent governance for your organization?
            </h2>
            <p className="mt-6 text-fluid-body text-text-secondary">
              Bulwark is open-source and ready to deploy. For enterprise
              deployments, custom policy design, or integration support — get in
              touch.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <a
                href="https://github.com/claudius-ars/bulwark"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-mono text-sm font-medium uppercase tracking-wider text-accent transition-colors hover:text-accent-dim"
              >
                GitHub Repository
                <span className="h-px w-8 bg-current" aria-hidden="true" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 font-mono text-sm font-medium uppercase tracking-wider text-teal transition-colors hover:text-teal-dim"
              >
                Contact us
                <span className="h-px w-8 bg-current" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
