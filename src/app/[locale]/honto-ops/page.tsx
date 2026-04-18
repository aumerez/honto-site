"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";
import { useLocale } from "@/context/LocaleContext";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

/* ──────────────────────────────────────────────
   Inline SVG icons — petroleum / industrial feel
   ────────────────────────────────────────────── */

function IconDocument() {
  return (
    <svg
      width="28"
      height="28"
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
    </svg>
  );
}

function IconChat() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconReport() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}

function IconVideo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function IconAudio() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20" />
      <path d="M12 2a14.5 14.5 0 0 1 0 20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function IconDesktop() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function IconChatSmall() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function IconSlack() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="13" y="2" width="3" height="8" rx="1.5" />
      <path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
      <rect x="8" y="14" width="3" height="8" rx="1.5" />
      <path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
      <rect x="14" y="13" width="8" height="3" rx="1.5" />
      <path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
      <rect x="2" y="8" width="8" height="3" rx="1.5" />
      <path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
    </svg>
  );
}

function IconDashboard() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function IconOffline() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconArrow() {
  return (
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
  );
}

/* ──────────────────────────────────────────────
   honto.ops Product Page
   ────────────────────────────────────────────── */

export default function HontoOpsPage() {
  const { locale, t } = useLocale();
  const o = t.hontoOps as Record<string, string>;

  /* Scroll reveal refs */
  const heroRef = useScrollReveal<HTMLDivElement>();
  const problemHeadRef = useScrollReveal<HTMLDivElement>();
  const problemCardsRef = useScrollRevealMultiple(0.1, 120);
  const unifiedHeadRef = useScrollReveal<HTMLDivElement>();
  const unifiedCardsRef = useScrollRevealMultiple(0.08, 100);
  const accessHeadRef = useScrollReveal<HTMLDivElement>();
  const accessCardsRef = useScrollRevealMultiple(0.1, 120);
  const transformHeadRef = useScrollReveal<HTMLDivElement>();
  const transformRef = useScrollReveal<HTMLDivElement>(0.1);
  const oilgasHeadRef = useScrollReveal<HTMLDivElement>();
  const oilgasCardsRef = useScrollRevealMultiple(0.08, 100);
  const diffHeadRef = useScrollReveal<HTMLDivElement>();
  const diffTableRef = useScrollReveal<HTMLDivElement>(0.1);
  const ctaRef = useScrollReveal<HTMLDivElement>();

  /* ── Data arrays ── */

  const problemCards = [
    { title: o.problemPdfs, detail: o.problemPdfsDetail },
    { title: o.problemHeads, detail: o.problemHeadsDetail },
    { title: o.problemChats, detail: o.problemChatsDetail },
    { title: o.problemSilos, detail: o.problemSilosDetail },
  ];

  const unifiedCards = [
    {
      icon: <IconDocument />,
      title: o.unifiedDocsTitle,
      desc: o.unifiedDocsDesc,
    },
    {
      icon: <IconChat />,
      title: o.unifiedChatsTitle,
      desc: o.unifiedChatsDesc,
    },
    {
      icon: <IconReport />,
      title: o.unifiedReportsTitle,
      desc: o.unifiedReportsDesc,
    },
    {
      icon: <IconVideo />,
      title: o.unifiedVideoTitle,
      desc: o.unifiedVideoDesc,
    },
    {
      icon: <IconAudio />,
      title: o.unifiedAudioTitle,
      desc: o.unifiedAudioDesc,
    },
    {
      icon: <IconBrain />,
      title: o.unifiedExpertTitle,
      desc: o.unifiedExpertDesc,
    },
  ];

  const accessCards = [
    {
      icon: <IconDesktop />,
      title: o.accessDesktopTitle,
      desc: o.accessDesktopDesc,
    },
    {
      icon: <IconChatSmall />,
      title: o.accessChatTitle,
      desc: o.accessChatDesc,
    },
    { icon: <IconSlack />, title: o.accessSlackTitle, desc: o.accessSlackDesc },
    {
      icon: <IconDashboard />,
      title: o.accessReportsTitle,
      desc: o.accessReportsDesc,
    },
    {
      icon: <IconOffline />,
      title: o.accessOfflineTitle,
      desc: o.accessOfflineDesc,
    },
  ];

  const beforeItems = [
    o.transformBefore1,
    o.transformBefore2,
    o.transformBefore3,
    o.transformBefore4,
    o.transformBefore5,
  ];

  const afterItems = [
    o.transformAfter1,
    o.transformAfter2,
    o.transformAfter3,
    o.transformAfter4,
    o.transformAfter5,
  ];

  const oilgasCards = [
    { title: o.oilgasDiagTitle, desc: o.oilgasDiagDesc },
    { title: o.oilgasProdTitle, desc: o.oilgasProdDesc },
    { title: o.oilgasWorkoverTitle, desc: o.oilgasWorkoverDesc },
    { title: o.oilgasIncidentTitle, desc: o.oilgasIncidentDesc },
    { title: o.oilgasUnitsTitle, desc: o.oilgasUnitsDesc },
    { title: o.oilgasStandardsTitle, desc: o.oilgasStandardsDesc },
  ];

  const diffRows = [
    { generic: o.diffRow1Generic, hontoOps: o.diffRow1HontoOps },
    { generic: o.diffRow2Generic, hontoOps: o.diffRow2HontoOps },
    { generic: o.diffRow3Generic, hontoOps: o.diffRow3HontoOps },
    { generic: o.diffRow4Generic, hontoOps: o.diffRow4HontoOps },
    { generic: o.diffRow5Generic, hontoOps: o.diffRow5HontoOps },
  ];

  return (
    <>
      <Navigation />
      <main>
        {/* ═══════════════════════════════════════════
            1. HERO
        ═══════════════════════════════════════════ */}
        <section
          className="noise-overlay relative flex min-h-[100dvh] items-center overflow-hidden"
          aria-label="honto.ops Hero"
        >
          {/* Industrial grid */}
          <div
            className="grid-bg absolute inset-0 opacity-20"
            aria-hidden="true"
          />

          {/* Warm amber glow */}
          <div
            className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] md:h-[900px] md:w-[900px]"
            style={{
              background:
                "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-2/3 h-[400px] w-[400px] rounded-full blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, rgba(217,119,6,0.06) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-28 md:px-8 md:pt-32">
            {/* Breadcrumb */}
            <nav
              className="animate-fade-in mb-10 flex items-center gap-2 text-sm text-text-muted"
              aria-label="Breadcrumb"
            >
              <a
                href={`/${locale}`}
                className="transition-colors hover:text-amber-400"
              >
                {o.breadcrumbHome}
              </a>
              <span aria-hidden="true">/</span>
              <span className="text-amber-400">{o.breadcrumbHontoOps}</span>
            </nav>

            <div ref={heroRef} className="reveal max-w-4xl">
              {/* Eyebrow */}
              <div className="mb-6 flex items-center gap-3">
                <span
                  className="h-px w-8"
                  style={{ background: "#f59e0b" }}
                  aria-hidden="true"
                />
                <span
                  className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
                  style={{ color: "#f59e0b" }}
                >
                  {o.eyebrow}
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {o.titleLine1}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f59e0b, #d97706, #b45309)",
                  }}
                >
                  {o.titleLine2}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-text-secondary md:text-xl">
                {o.subtitle}
              </p>

              {/* Value props */}
              <ul className="mt-8 flex flex-col gap-3">
                {[o.valueProp1, o.valueProp2, o.valueProp3].map((prop) => (
                  <li key={prop} className="flex items-start gap-3">
                    <span
                      className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "rgba(245,158,11,0.15)" }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="text-base text-text-secondary">
                      {prop}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href={`/${locale}/#contact`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-bg transition-all hover:brightness-110"
                  style={{
                    background: "#f59e0b",
                    boxShadow: "0 0 0 0 rgba(245,158,11,0)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 32px rgba(245,158,11,0.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 0 0 rgba(245,158,11,0)")
                  }
                >
                  {o.contactUs}
                  <IconArrow />
                </a>
                <a
                  href="#problem"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-medium text-text-secondary transition-all hover:border-amber-500/40 hover:text-amber-400"
                >
                  {o.learnMore}
                </a>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-3 gap-6 border-t border-border pt-8 md:max-w-lg">
                {[
                  { value: "500+", label: o.statWells },
                  { value: "100%", label: o.statRetention },
                  { value: "<3s", label: o.statResponse },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="font-heading text-2xl font-bold md:text-3xl"
                      style={{ color: "#f59e0b" }}
                    >
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs text-text-muted md:text-sm">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float"
            aria-hidden="true"
          >
            <div className="flex h-8 w-5 items-start justify-center rounded-full border border-border-light p-1">
              <div
                className="h-1.5 w-1 rounded-full animate-pulse-glow"
                style={{ background: "#f59e0b" }}
              />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            2. THE PROBLEM
        ═══════════════════════════════════════════ */}
        <section
          id="problem"
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="problem-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
          <div
            className="absolute left-0 top-0 h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(245,158,11,0.2), transparent)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={problemHeadRef} className="reveal mb-16 max-w-3xl">
              <span
                className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "#d97706" }}
              >
                {o.problemEyebrow}
              </span>
              <h2
                id="problem-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {o.problemHeadingLine1}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f59e0b, #d97706)",
                  }}
                >
                  {o.problemHeadingLine2}
                </span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {o.problemDescription}
              </p>
            </div>

            <div
              ref={problemCardsRef}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {problemCards.map((card) => (
                <div
                  key={card.title}
                  className="reveal rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-amber-500/30 hover:bg-bg-card-hover"
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ background: "rgba(245,158,11,0.1)" }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {card.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            3. UNIFIED KNOWLEDGE
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="unified-heading"
        >
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={unifiedHeadRef} className="reveal mb-16 max-w-3xl">
              <span
                className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "#f59e0b" }}
              >
                {o.unifiedEyebrow}
              </span>
              <h2
                id="unified-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {o.unifiedHeadingLine1}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f59e0b, #d97706)",
                  }}
                >
                  {o.unifiedHeadingLine2}
                </span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {o.unifiedDescription}
              </p>
            </div>

            <div
              ref={unifiedCardsRef}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {unifiedCards.map((card) => (
                <div
                  key={card.title}
                  className="reveal rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-amber-500/30 hover:bg-bg-card-hover"
                >
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      background: "rgba(245,158,11,0.1)",
                      color: "#f59e0b",
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-heading text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            4. MULTI-CHANNEL ACCESS
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="access-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
          <div
            className="absolute left-0 top-0 h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(245,158,11,0.15), transparent)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={accessHeadRef} className="reveal mb-16 max-w-3xl">
              <span
                className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "#d97706" }}
              >
                {o.accessEyebrow}
              </span>
              <h2
                id="access-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {o.accessHeadingLine1}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f59e0b, #d97706)",
                  }}
                >
                  {o.accessHeadingLine2}
                </span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {o.accessDescription}
              </p>
            </div>

            <div
              ref={accessCardsRef}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {accessCards.map((card) => (
                <div
                  key={card.title}
                  className="reveal group rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-amber-500/30 hover:bg-bg-card-hover"
                >
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                    style={{
                      background: "rgba(245,158,11,0.1)",
                      color: "#f59e0b",
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-heading text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            5. BEFORE / AFTER TRANSFORMATION
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="transform-heading"
        >
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={transformHeadRef} className="reveal mb-16 max-w-3xl">
              <span
                className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "#f59e0b" }}
              >
                {o.transformEyebrow}
              </span>
              <h2
                id="transform-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {o.transformHeadingLine1}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f59e0b, #d97706)",
                  }}
                >
                  {o.transformHeadingLine2}
                </span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {o.transformDescription}
              </p>
            </div>

            <div
              ref={transformRef}
              className="reveal grid gap-6 md:grid-cols-2"
            >
              {/* Before */}
              <div className="rounded-xl border border-border bg-bg-card p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                    <IconX />
                  </div>
                  <h3
                    className="font-heading text-lg font-semibold"
                    style={{ color: "#ef4444" }}
                  >
                    {o.transformBeforeTitle}
                  </h3>
                </div>
                <ul className="flex flex-col gap-4">
                  {beforeItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary"
                    >
                      <span className="mt-0.5 text-red-500/60">
                        <IconX />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* After */}
              <div
                className="rounded-xl border p-8"
                style={{
                  borderColor: "rgba(245,158,11,0.3)",
                  background:
                    "linear-gradient(135deg, rgba(245,158,11,0.03), rgba(217,119,6,0.02))",
                }}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: "rgba(245,158,11,0.15)" }}
                  >
                    <span style={{ color: "#f59e0b" }}>
                      <IconCheck />
                    </span>
                  </div>
                  <h3
                    className="font-heading text-lg font-semibold"
                    style={{ color: "#f59e0b" }}
                  >
                    {o.transformAfterTitle}
                  </h3>
                </div>
                <ul className="flex flex-col gap-4">
                  {afterItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm leading-relaxed text-text-secondary"
                    >
                      <span className="mt-0.5" style={{ color: "#f59e0b" }}>
                        <IconCheck />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            6. OIL & GAS SPECIFIC
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="oilgas-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
          <div
            className="absolute left-0 top-0 h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(245,158,11,0.2), transparent)",
            }}
            aria-hidden="true"
          />

          {/* Subtle industrial texture */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(245,158,11,0.3) 40px, rgba(245,158,11,0.3) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(245,158,11,0.3) 40px, rgba(245,158,11,0.3) 41px)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={oilgasHeadRef} className="reveal mb-16 max-w-3xl">
              <span
                className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "#d97706" }}
              >
                {o.oilgasEyebrow}
              </span>
              <h2
                id="oilgas-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {o.oilgasHeadingLine1}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f59e0b, #d97706)",
                  }}
                >
                  {o.oilgasHeadingLine2}
                </span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {o.oilgasDescription}
              </p>
            </div>

            <div
              ref={oilgasCardsRef}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {oilgasCards.map((card) => (
                <div
                  key={card.title}
                  className="reveal rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-amber-500/30 hover:bg-bg-card-hover"
                >
                  <div
                    className="mb-3 h-1 w-8 rounded-full"
                    style={{ background: "#f59e0b" }}
                    aria-hidden="true"
                  />
                  <h3 className="font-heading text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            7. DIFFERENTIATOR TABLE
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="diff-heading"
        >
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={diffHeadRef} className="reveal mb-16 text-center">
              <span
                className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "#f59e0b" }}
              >
                {o.diffEyebrow}
              </span>
              <h2
                id="diff-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {o.diffHeadingLine1}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f59e0b, #d97706)",
                  }}
                >
                  {o.diffHeadingLine2}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
                {o.diffDescription}
              </p>
            </div>

            <div
              ref={diffTableRef}
              className="reveal mx-auto max-w-3xl overflow-hidden rounded-xl border border-border"
            >
              {/* Header */}
              <div className="grid grid-cols-2">
                <div className="border-b border-r border-border bg-bg-card px-6 py-4">
                  <span className="font-heading text-sm font-semibold text-text-muted">
                    {o.diffHeaderGeneric}
                  </span>
                </div>
                <div
                  className="border-b px-6 py-4"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.04))",
                  }}
                >
                  <span
                    className="font-heading text-sm font-semibold"
                    style={{ color: "#f59e0b" }}
                  >
                    {o.diffHeaderHontoOps}
                  </span>
                </div>
              </div>

              {/* Rows */}
              {diffRows.map((row, i) => (
                <div
                  key={row.hontoOps}
                  className={`grid grid-cols-2 ${i < diffRows.length - 1 ? "border-b border-border" : ""}`}
                >
                  <div className="border-r border-border bg-bg-card px-6 py-4 text-sm text-text-muted">
                    {row.generic}
                  </div>
                  <div
                    className="px-6 py-4 text-sm font-medium"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(245,158,11,0.05), rgba(217,119,6,0.02))",
                      color: "#fbbf24",
                    }}
                  >
                    {row.hontoOps}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            8. CLOSING CTA
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="honto-ops-cta-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
          <div
            className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px]"
            style={{
              background:
                "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={ctaRef} className="reveal text-center">
              <span
                className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "#d97706" }}
              >
                {o.ctaEyebrow}
              </span>
              <h2
                id="honto-ops-cta-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {o.ctaHeadingLine1}
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #f59e0b, #d97706)",
                  }}
                >
                  {o.ctaHeadingLine2}
                </span>
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
                {o.ctaDescription}
              </p>

              <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-3 text-left">
                {[o.ctaBullet1, o.ctaBullet2, o.ctaBullet3].map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-sm text-text-secondary"
                  >
                    <span className="mt-0.5" style={{ color: "#f59e0b" }}>
                      <IconCheck />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <a
                  href={`/${locale}/#contact`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-bg transition-all hover:brightness-110"
                  style={{
                    background: "#f59e0b",
                    boxShadow: "0 0 0 0 rgba(245,158,11,0)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 40px rgba(245,158,11,0.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 0 0 0 rgba(245,158,11,0)")
                  }
                >
                  {o.ctaButton}
                  <IconArrow />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
