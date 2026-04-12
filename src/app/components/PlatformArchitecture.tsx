"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";
import { useLocale } from "@/context/LocaleContext";

/* ──────────────────────────────────────────────
   Platform Architecture Diagram
   ──────────────────────────────────────────────
   Three-component schematic:
     [ honto.ops ]  ◄──►  [ honto.wholograph ]
              │                    │
              └─────────┬──────────┘
                        ▼
              [ honto.infra ]

   Reusable on /opsai (anchored as "part of the platform")
   and /[locale]/platform (the canonical solution diagram).
   ────────────────────────────────────────────── */

function NodeIconWorkstation() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <path d="M6 8h6" />
      <path d="M6 12h4" />
    </svg>
  );
}

function NodeIconOrchestrator() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <circle cx="4" cy="6" r="2" />
      <circle cx="20" cy="6" r="2" />
      <circle cx="4" cy="18" r="2" />
      <circle cx="20" cy="18" r="2" />
      <path d="M6 7l4 4" />
      <path d="M18 7l-4 4" />
      <path d="M6 17l4-4" />
      <path d="M18 17l-4-4" />
    </svg>
  );
}

function NodeIconInfra() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v6c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 11v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6" />
    </svg>
  );
}

interface PlatformArchitectureProps {
  /** Outer section padding flavor — "compact" reuses inside other pages, "full" stands alone. */
  variant?: "compact" | "full";
}

export default function PlatformArchitecture({
  variant = "full",
}: PlatformArchitectureProps) {
  const { t } = useLocale();
  const p = t.platformArchitecture;

  const headRef = useScrollReveal<HTMLDivElement>();
  const cardsRef = useScrollRevealMultiple(0.1, 140);
  const foundationRef = useScrollReveal<HTMLDivElement>(0.1);

  const isCompact = variant === "compact";

  return (
    <section
      className={`relative overflow-hidden ${
        isCompact ? "py-20 md:py-24" : "py-24 md:py-32"
      }`}
      aria-labelledby="platform-architecture-heading"
    >
      {/* Background — subtle violet wash + grid */}
      <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
      <div
        className="grid-bg absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-violet/25 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        {/* Heading */}
        <div ref={headRef} className="reveal mb-14 max-w-3xl md:mb-20">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
            {p.eyebrow}
          </span>
          <h2
            id="platform-architecture-heading"
            className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
          >
            {p.headingLine1}
            <br />
            <span className="gradient-text">{p.headingLine2}</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            {p.description}
          </p>
        </div>

        {/* ─── Diagram ─── */}
        <div className="relative">
          {/* Mono caption above the schematic */}
          <div className="mb-6 flex items-center justify-center gap-3 md:mb-10">
            <span className="h-px w-8 bg-violet/40" aria-hidden="true" />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-violet md:text-xs">
              {p.captionPlatform}
            </span>
            <span className="h-px w-8 bg-violet/40" aria-hidden="true" />
          </div>

          {/* Outer schematic frame — corner ticks for that engineering-doc feel */}
          <div className="relative rounded-3xl border border-border bg-bg/60 p-6 backdrop-blur-sm md:p-10">
            {/* Corner ticks */}
            <CornerTicks />

            {/* Top row: two component cards */}
            <div
              ref={cardsRef}
              className="relative grid gap-6 md:grid-cols-2 md:gap-10"
            >
              {/* honto.ops */}
              <ComponentCard
                name={p.opsName}
                role={p.opsRole}
                description={p.opsDescription}
                statusLabel={p.opsStatus}
                tone="violet"
                icon={<NodeIconWorkstation />}
              />
              {/* honto.wholograph */}
              <ComponentCard
                name={p.wholoName}
                role={p.wholoRole}
                description={p.wholoDescription}
                statusLabel={p.wholoStatus}
                tone="cyan"
                icon={<NodeIconOrchestrator />}
              />

              {/* Horizontal bidirectional connector — desktop only */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-[14%] -translate-x-1/2 -translate-y-1/2 md:block"
                aria-hidden="true"
              >
                <div className="h-full w-full bg-gradient-to-r from-violet/60 via-violet/20 to-accent/60" />
                {/* Left arrow */}
                <svg
                  className="absolute -left-1 top-1/2 -translate-y-1/2 text-violet"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="currentColor"
                >
                  <path d="M0 5l8-4v8z" />
                </svg>
                {/* Right arrow */}
                <svg
                  className="absolute -right-1 top-1/2 -translate-y-1/2 text-accent"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="currentColor"
                >
                  <path d="M10 5L2 9V1z" />
                </svg>
                {/* Mono label above the line */}
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[140%] whitespace-nowrap font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {p.linkLabel}
                </span>
              </div>
            </div>

            {/* Vertical converging connector — desktop */}
            <div
              className="pointer-events-none relative my-8 hidden h-12 md:block"
              aria-hidden="true"
            >
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 48"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="downGrad"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                {/* From left card down + right turn */}
                <path
                  d="M 25 0 L 25 24 L 50 24"
                  fill="none"
                  stroke="url(#downGrad)"
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                />
                {/* From right card down + left turn */}
                <path
                  d="M 75 0 L 75 24 L 50 24"
                  fill="none"
                  stroke="url(#downGrad)"
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                />
                {/* Combined trunk down */}
                <path
                  d="M 50 24 L 50 48"
                  fill="none"
                  stroke="url(#downGrad)"
                  strokeWidth="1.6"
                />
                {/* Arrow head at the bottom */}
                <path d="M 46 44 L 50 50 L 54 44 Z" fill="#00e5ff" />
              </svg>
            </div>

            {/* Mobile vertical connectors */}
            <div
              className="my-6 flex flex-col items-center md:hidden"
              aria-hidden="true"
            >
              <div className="h-6 w-px bg-gradient-to-b from-violet/60 to-accent/40" />
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                {p.linkLabel}
              </span>
              <div className="h-6 w-px bg-gradient-to-b from-accent/40 to-violet/60" />
            </div>

            {/* Foundation card */}
            <div ref={foundationRef} className="reveal">
              <FoundationCard
                title={p.infraName}
                role={p.infraRole}
                pillars={[p.infraPillar1, p.infraPillar2, p.infraPillar3]}
                compliance={p.infraCompliance}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────── Sub-components ────────── */

function CornerTicks() {
  // Four small corner ornaments for an engineering-doc / blueprint feel.
  const base = "pointer-events-none absolute h-3 w-3 border-violet/40";
  return (
    <>
      <span
        aria-hidden="true"
        className={`${base} -left-px -top-px border-l border-t`}
      />
      <span
        aria-hidden="true"
        className={`${base} -right-px -top-px border-r border-t`}
      />
      <span
        aria-hidden="true"
        className={`${base} -bottom-px -left-px border-b border-l`}
      />
      <span
        aria-hidden="true"
        className={`${base} -bottom-px -right-px border-b border-r`}
      />
    </>
  );
}

interface ComponentCardProps {
  name: string;
  role: string;
  description: string;
  statusLabel: string;
  tone: "violet" | "cyan";
  icon: React.ReactNode;
}

function ComponentCard({
  name,
  role,
  description,
  statusLabel,
  tone,
  icon,
}: ComponentCardProps) {
  const toneStyles =
    tone === "violet"
      ? {
          icon: "text-violet",
          iconBg: "bg-violet/10",
          border: "hover:border-violet/40",
          dot: "bg-violet",
          dotGlow: "shadow-[0_0_12px_rgba(139,92,246,0.6)]",
        }
      : {
          icon: "text-accent",
          iconBg: "bg-accent/10",
          border: "hover:border-accent/40",
          dot: "bg-accent",
          dotGlow: "shadow-[0_0_12px_rgba(0,229,255,0.6)]",
        };

  return (
    <div
      className={`reveal group relative rounded-2xl border border-border bg-bg-card p-6 transition-all duration-300 hover:bg-bg-card-hover md:p-7 ${toneStyles.border}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneStyles.iconBg} ${toneStyles.icon}`}
        >
          {icon}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 rounded-full ${toneStyles.dot} ${toneStyles.dotGlow}`}
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
            {statusLabel}
          </span>
        </div>
      </div>
      <h3 className="mt-5 font-heading text-xl font-bold tracking-tight md:text-2xl">
        {name}
      </h3>
      <div
        className={`mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] ${toneStyles.icon}`}
      >
        {role}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary md:text-base">
        {description}
      </p>
    </div>
  );
}

interface FoundationCardProps {
  title: string;
  role: string;
  pillars: string[];
  compliance: string;
}

function FoundationCard({
  title,
  role,
  pillars,
  compliance,
}: FoundationCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-violet/30 hover:bg-bg-card-hover md:p-8">
      {/* Subtle gradient wash */}
      <div
        className="absolute inset-0 opacity-60"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.04) 0%, rgba(0,229,255,0.04) 100%)",
        }}
      />

      <div className="relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet/10 text-violet">
              <NodeIconInfra />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
                {title}
              </h3>
              <div className="mt-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
                {role}
              </div>
            </div>
          </div>

          {/* Pillars row */}
          <ul className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
            {pillars.map((pillar) => (
              <li
                key={pillar}
                className="flex items-center gap-2 text-xs text-text-secondary md:text-sm"
              >
                <span
                  className="h-1 w-1 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <span className="font-mono uppercase tracking-wider">
                  {pillar}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Compliance microcopy */}
        <p className="mt-6 border-t border-border pt-5 text-xs leading-relaxed text-text-muted md:text-sm">
          {compliance}
        </p>
      </div>
    </div>
  );
}
