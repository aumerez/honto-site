"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useScrollRevealMultiple } from "@/hooks/useScrollRevealMultiple";
import { useLocale } from "@/context/LocaleContext";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import PlatformArchitecture from "../../components/PlatformArchitecture";

/* ──────────────────────────────────────────────
   honto Platform Page
   The canonical "what is the platform" page.
   ────────────────────────────────────────────── */

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

function IconCheck({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconDot() {
  return (
    <span
      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-violet"
      aria-hidden="true"
    />
  );
}

/* ──────────────────────────────────────────────
   WholoGraph horizontal flow diagram
   ────────────────────────────────────────────── */

function WholoGraphFlow() {
  const { t } = useLocale();
  const p = t.platform;
  const ref = useScrollReveal<HTMLDivElement>(0.1);

  const steps = [
    p.wholoFlowStep1,
    p.wholoFlowStep2,
    p.wholoFlowStep3,
    p.wholoFlowStep4,
    p.wholoFlowStep5,
    p.wholoFlowStep6,
  ];

  return (
    <div ref={ref} className="reveal">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-card p-6 md:p-10">
        {/* subtle background wash */}
        <div
          className="absolute inset-0 opacity-60"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.05) 0%, rgba(0,229,255,0.05) 100%)",
          }}
        />

        <div className="relative grid gap-6 md:grid-cols-[1fr_2fr_1fr] md:items-stretch md:gap-4">
          {/* Input */}
          <div className="rounded-xl border border-border bg-bg p-5">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
              {p.wholoFlowInputTitle}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {p.wholoFlowInputExample}
            </p>
            <div className="mt-4 border-t border-border pt-4">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                {p.wholoFlowOutputBack}
              </div>
            </div>
          </div>

          {/* Engine */}
          <div className="rounded-xl border border-violet/30 bg-bg p-5">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
                {p.wholoFlowEngineTitle}
              </div>
              <span
                className="h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                aria-hidden="true"
              />
            </div>
            <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
              {steps.map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <span className="font-mono text-[10px] font-semibold text-violet">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Output */}
          <div className="rounded-xl border border-border bg-bg p-5">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
              {p.wholoFlowOutputTitle}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-text-secondary md:text-sm">
              {p.wholoFlowOutputExamples}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Page
   ────────────────────────────────────────────── */

export default function PlatformPage() {
  const { locale, t } = useLocale();
  const p = t.platform;

  /* Reveal refs per section */
  const heroRef = useScrollReveal<HTMLDivElement>();
  const problemHeadRef = useScrollReveal<HTMLDivElement>();
  const problemCardsRef = useScrollRevealMultiple(0.08, 100);
  const solutionRef = useScrollReveal<HTMLDivElement>();
  const opsHeadRef = useScrollReveal<HTMLDivElement>();
  const opsTableRef = useScrollRevealMultiple(0.08, 80);
  const opsChatRef = useScrollReveal<HTMLDivElement>(0.1);
  const opsPlaybookRef = useScrollReveal<HTMLDivElement>(0.1);
  const opsDocsRef = useScrollReveal<HTMLDivElement>(0.1);
  const wholoHeadRef = useScrollReveal<HTMLDivElement>();
  const wholoCapsRef = useScrollRevealMultiple(0.08, 100);
  const wholoLayersRef = useScrollRevealMultiple(0.1, 100);
  const infraHeadRef = useScrollReveal<HTMLDivElement>();
  const infraCardsRef = useScrollRevealMultiple(0.08, 100);
  const diffHeadRef = useScrollReveal<HTMLDivElement>();
  const diffCardsRef = useScrollRevealMultiple(0.08, 100);
  const intelHeadRef = useScrollReveal<HTMLDivElement>();
  const bestPracticeRef = useScrollRevealMultiple(0.08, 100);
  const watchmanRef = useScrollRevealMultiple(0.08, 100);
  const usersHeadRef = useScrollReveal<HTMLDivElement>();
  const usersCardsRef = useScrollRevealMultiple(0.08, 100);
  const industriesHeadRef = useScrollReveal<HTMLDivElement>();
  const industriesTableRef = useScrollReveal<HTMLDivElement>(0.05);
  const techHeadRef = useScrollReveal<HTMLDivElement>();
  const techTableRef = useScrollReveal<HTMLDivElement>(0.05);
  const deployHeadRef = useScrollReveal<HTMLDivElement>();
  const deployStepsRef = useScrollRevealMultiple(0.08, 120);
  const securityHeadRef = useScrollReveal<HTMLDivElement>();
  const securityTableRef = useScrollReveal<HTMLDivElement>(0.05);
  const ctaRef = useScrollReveal<HTMLDivElement>();

  /* ── Data arrays ── */

  const problemCards = [
    { title: p.problem1Title, desc: p.problem1Desc },
    { title: p.problem2Title, desc: p.problem2Desc },
    { title: p.problem3Title, desc: p.problem3Desc },
    { title: p.problem4Title, desc: p.problem4Desc },
    { title: p.problem5Title, desc: p.problem5Desc },
    { title: p.problem6Title, desc: p.problem6Desc },
    { title: p.problem7Title, desc: p.problem7Desc },
  ];

  const opsFeatures = [
    { title: p.opsFeatureTasksTitle, desc: p.opsFeatureTasksDesc },
    { title: p.opsFeatureDocsTitle, desc: p.opsFeatureDocsDesc },
    { title: p.opsFeatureMessagesTitle, desc: p.opsFeatureMessagesDesc },
    { title: p.opsFeatureApprovalsTitle, desc: p.opsFeatureApprovalsDesc },
    { title: p.opsFeatureProjectsTitle, desc: p.opsFeatureProjectsDesc },
    { title: p.opsFeaturePlaybooksTitle, desc: p.opsFeaturePlaybooksDesc },
    { title: p.opsFeatureKpisTitle, desc: p.opsFeatureKpisDesc },
    { title: p.opsFeatureConnectorsTitle, desc: p.opsFeatureConnectorsDesc },
    { title: p.opsFeatureModulesTitle, desc: p.opsFeatureModulesDesc },
  ];

  const opsChatBullets = [
    p.opsChatBullet1,
    p.opsChatBullet2,
    p.opsChatBullet3,
    p.opsChatBullet4,
    p.opsChatBullet5,
    p.opsChatBullet6,
  ];

  const opsDocsBullets = [
    p.opsDocsBullet1,
    p.opsDocsBullet2,
    p.opsDocsBullet3,
    p.opsDocsBullet4,
  ];

  const playbookSteps = [
    p.opsPlaybooksAIStep1,
    p.opsPlaybooksAIStep2,
    p.opsPlaybooksAIStep3,
    p.opsPlaybooksAIStep4,
  ];

  const wholoCaps = [
    { title: p.wholoCap1Title, desc: p.wholoCap1Desc },
    { title: p.wholoCap2Title, desc: p.wholoCap2Desc },
    { title: p.wholoCap3Title, desc: p.wholoCap3Desc },
    { title: p.wholoCap4Title, desc: p.wholoCap4Desc },
    { title: p.wholoCap5Title, desc: p.wholoCap5Desc },
    { title: p.wholoCap6Title, desc: p.wholoCap6Desc },
  ];

  const wholoLayers = [
    { name: p.wholoLayer1Name, role: p.wholoLayer1Role },
    { name: p.wholoLayer2Name, role: p.wholoLayer2Role },
    { name: p.wholoLayer3Name, role: p.wholoLayer3Role },
    { name: p.wholoLayer4Name, role: p.wholoLayer4Role },
  ];

  const infraStack = [
    { title: p.infraStack1Title, desc: p.infraStack1Desc },
    { title: p.infraStack2Title, desc: p.infraStack2Desc },
    { title: p.infraStack3Title, desc: p.infraStack3Desc },
    { title: p.infraStack4Title, desc: p.infraStack4Desc },
  ];

  const diffCards = [
    {
      title: p.diff1Title,
      desc: p.diff1Desc,
      bullets: [p.diff1Bullet1, p.diff1Bullet2, p.diff1Bullet3, p.diff1Bullet4],
    },
    {
      title: p.diff2Title,
      desc: p.diff2Desc,
      bullets: [p.diff2Bullet1, p.diff2Bullet2, p.diff2Bullet3, p.diff2Bullet4],
    },
    {
      title: p.diff3Title,
      desc: p.diff3Desc,
      bullets: [p.diff3Bullet1, p.diff3Bullet2, p.diff3Bullet3, p.diff3Bullet4],
    },
    {
      title: p.diff4Title,
      desc: p.diff4Desc,
      bullets: [p.diff4Bullet1, p.diff4Bullet2, p.diff4Bullet3, p.diff4Bullet4],
    },
  ];

  const bestPractices = [
    { title: p.bestPractice1Title, desc: p.bestPractice1Desc },
    { title: p.bestPractice2Title, desc: p.bestPractice2Desc },
    { title: p.bestPractice3Title, desc: p.bestPractice3Desc },
    { title: p.bestPractice4Title, desc: p.bestPractice4Desc },
  ];

  const watchmanCards = [
    { title: p.watchman1Title, desc: p.watchman1Desc },
    { title: p.watchman2Title, desc: p.watchman2Desc },
    { title: p.watchman3Title, desc: p.watchman3Desc },
    { title: p.watchman4Title, desc: p.watchman4Desc },
    { title: p.watchman5Title, desc: p.watchman5Desc },
  ];

  const userCards = [
    { name: p.user1Name, desc: p.user1Desc },
    { name: p.user2Name, desc: p.user2Desc },
    { name: p.user3Name, desc: p.user3Desc },
    { name: p.user4Name, desc: p.user4Desc },
    { name: p.user5Name, desc: p.user5Desc },
  ];

  const industries = [
    {
      name: p.industry1Name,
      systems: p.industry1Systems,
      useCases: p.industry1UseCases,
    },
    {
      name: p.industry2Name,
      systems: p.industry2Systems,
      useCases: p.industry2UseCases,
    },
    {
      name: p.industry3Name,
      systems: p.industry3Systems,
      useCases: p.industry3UseCases,
    },
    {
      name: p.industry4Name,
      systems: p.industry4Systems,
      useCases: p.industry4UseCases,
    },
    {
      name: p.industry5Name,
      systems: p.industry5Systems,
      useCases: p.industry5UseCases,
    },
    {
      name: p.industry6Name,
      systems: p.industry6Systems,
      useCases: p.industry6UseCases,
    },
  ];

  const techRows = [
    {
      component: p.tech1Component,
      tech: p.tech1Technology,
      purpose: p.tech1Purpose,
    },
    {
      component: p.tech2Component,
      tech: p.tech2Technology,
      purpose: p.tech2Purpose,
    },
    {
      component: p.tech3Component,
      tech: p.tech3Technology,
      purpose: p.tech3Purpose,
    },
    {
      component: p.tech4Component,
      tech: p.tech4Technology,
      purpose: p.tech4Purpose,
    },
    {
      component: p.tech5Component,
      tech: p.tech5Technology,
      purpose: p.tech5Purpose,
    },
    {
      component: p.tech6Component,
      tech: p.tech6Technology,
      purpose: p.tech6Purpose,
    },
    {
      component: p.tech7Component,
      tech: p.tech7Technology,
      purpose: p.tech7Purpose,
    },
    {
      component: p.tech8Component,
      tech: p.tech8Technology,
      purpose: p.tech8Purpose,
    },
    {
      component: p.tech9Component,
      tech: p.tech9Technology,
      purpose: p.tech9Purpose,
    },
  ];

  const deploySteps = [
    {
      name: p.deployStep1Name,
      title: p.deployStep1Title,
      desc: p.deployStep1Desc,
    },
    {
      name: p.deployStep2Name,
      title: p.deployStep2Title,
      desc: p.deployStep2Desc,
    },
    {
      name: p.deployStep3Name,
      title: p.deployStep3Title,
      desc: p.deployStep3Desc,
    },
    {
      name: p.deployStep4Name,
      title: p.deployStep4Title,
      desc: p.deployStep4Desc,
    },
    {
      name: p.deployStep5Name,
      title: p.deployStep5Title,
      desc: p.deployStep5Desc,
    },
  ];

  const securityRows = [
    { control: p.security1Control, impl: p.security1Impl },
    { control: p.security2Control, impl: p.security2Impl, status: "wip" },
    { control: p.security3Control, impl: p.security3Impl, status: "wip" },
    { control: p.security4Control, impl: p.security4Impl },
    { control: p.security5Control, impl: p.security5Impl },
    { control: p.security6Control, impl: p.security6Impl },
    { control: p.security7Control, impl: p.security7Impl },
    { control: p.security8Control, impl: p.security8Impl },
    { control: p.security9Control, impl: p.security9Impl },
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
          aria-label="honto Platform Hero"
        >
          <div
            className="grid-bg absolute inset-0 opacity-20"
            aria-hidden="true"
          />
          <div
            className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[160px] md:h-[1000px] md:w-[1000px]"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-2/3 h-[420px] w-[420px] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-28 md:px-8 md:pt-32">
            <nav
              className="animate-fade-in mb-10 flex items-center gap-2 text-sm text-text-muted"
              aria-label="Breadcrumb"
            >
              <a
                href={`/${locale}`}
                className="transition-colors hover:text-violet"
              >
                {p.breadcrumbHome}
              </a>
              <span aria-hidden="true">/</span>
              <span className="text-violet">{p.breadcrumbPlatform}</span>
            </nav>

            <div ref={heroRef} className="reveal max-w-4xl">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-violet" aria-hidden="true" />
                <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                  {p.heroEyebrow}
                </span>
              </div>

              <h1 className="font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {p.heroTitleLine1}
                <br />
                <span className="gradient-text">{p.heroTitleLine2}</span>
              </h1>

              <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-text-secondary md:text-xl">
                {p.heroSubtitle}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href={`/${locale}/#contact`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-bg transition-all hover:shadow-[0_0_32px_var(--color-accent-glow)] hover:brightness-110"
                >
                  {p.heroBookDemo}
                  <IconArrow />
                </a>
                <a
                  href="#problem"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-3.5 text-base font-medium text-text-secondary transition-all hover:border-violet/40 hover:text-violet"
                >
                  {p.heroExplore}
                </a>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-6 border-t border-border pt-8 md:max-w-xl">
                {[
                  { value: p.heroStat1Value, label: p.heroStat1Label },
                  { value: p.heroStat2Value, label: p.heroStat2Label },
                  { value: p.heroStat3Value, label: p.heroStat3Label },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-heading text-3xl font-bold text-violet md:text-4xl">
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

          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float"
            aria-hidden="true"
          >
            <div className="flex h-8 w-5 items-start justify-center rounded-full border border-border-light p-1">
              <div className="h-1.5 w-1 animate-pulse-glow rounded-full bg-violet" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            2. PROBLEM
        ═══════════════════════════════════════════ */}
        <section
          id="problem"
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="platform-problem-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
          <div
            className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-violet/20 to-transparent"
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={problemHeadRef} className="reveal mb-16 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {p.problemEyebrow}
              </span>
              <h2
                id="platform-problem-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.problemHeadingLine1}
                <br />
                <span className="gradient-text">{p.problemHeadingLine2}</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.problemDescription}
              </p>
            </div>

            <div
              ref={problemCardsRef}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {problemCards.map((card) => (
                <div
                  key={card.title}
                  className="reveal rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-violet/30 hover:bg-bg-card-hover"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-violet">
                    <IconAlert />
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
            3. SOLUTION INTRO + ARCHITECTURE DIAGRAM
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden pb-0 pt-24 md:pt-32"
          aria-labelledby="platform-solution-heading"
        >
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div
              ref={solutionRef}
              className="reveal mx-auto max-w-3xl text-center"
            >
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {p.solutionEyebrow}
              </span>
              <h2
                id="platform-solution-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.solutionHeadingLine1}
                <br />
                <span className="gradient-text">{p.solutionHeadingLine2}</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.solutionDescription}
              </p>
            </div>
          </div>
        </section>

        <PlatformArchitecture variant="compact" />

        {/* ═══════════════════════════════════════════
            4. honto.ops — AI WORKSTATION
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="ops-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={opsHeadRef} className="reveal mb-16 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {p.opsEyebrow}
              </span>
              <h2
                id="ops-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.opsHeading}
              </h2>
              <p className="mt-3 font-mono text-sm uppercase tracking-wider text-text-muted">
                {p.opsSubtitle}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.opsDescription}
              </p>
            </div>

            {/* My Space — feature grid */}
            <div className="mb-20">
              <div className="mb-8">
                <h3 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
                  {p.opsMySpaceTitle}
                </h3>
                <p className="mt-2 text-text-secondary">{p.opsMySpaceDesc}</p>
              </div>

              <div
                ref={opsTableRef}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {opsFeatures.map((f) => (
                  <div
                    key={f.title}
                    className="reveal rounded-xl border border-border bg-bg-card p-5 transition-all duration-300 hover:border-violet/30 hover:bg-bg-card-hover"
                  >
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
                      {f.title}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat capability list */}
            <div
              ref={opsChatRef}
              className="reveal mb-20 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16"
            >
              <div>
                <h3 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
                  {p.opsChatTitle}
                </h3>
                <p className="mt-3 text-text-secondary">{p.opsChatDesc}</p>
              </div>
              <ul className="space-y-3">
                {opsChatBullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-lg border border-border bg-bg-card p-4"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet/15 text-violet">
                      <IconCheck />
                    </span>
                    <span className="text-sm leading-relaxed text-text-secondary">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Playbooks example */}
            <div ref={opsPlaybookRef} className="reveal mb-20">
              <div className="mb-8 max-w-3xl">
                <h3 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
                  {p.opsPlaybooksTitle}
                </h3>
                <p className="mt-3 text-text-secondary">{p.opsPlaybooksDesc}</p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-bg-card">
                {/* user message */}
                <div className="border-b border-border p-6 md:p-8">
                  <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                    {p.opsPlaybooksUserLabel}
                  </div>
                  <p className="text-text-secondary">
                    “{p.opsPlaybooksUserSays}”
                  </p>
                </div>
                {/* AI response */}
                <div className="bg-bg/40 p-6 md:p-8">
                  <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                      aria-hidden="true"
                    />
                    {p.opsPlaybooksAILabel}
                  </div>
                  <p className="text-text-secondary">{p.opsPlaybooksAIIntro}</p>
                  <ol className="mt-4 space-y-2">
                    {playbookSteps.map((step, i) => (
                      <li
                        key={step}
                        className="flex items-start gap-3 text-sm text-text-primary"
                      >
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet/15 font-mono text-[10px] font-semibold text-violet">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-bg p-3">
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                        {p.opsPlaybooksTriggerLabel}
                      </div>
                      <div className="mt-1 text-text-secondary">
                        {p.opsPlaybooksTrigger}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-bg p-3">
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                        {p.opsPlaybooksStatusLabel}
                      </div>
                      <div className="mt-1 text-violet">
                        {p.opsPlaybooksStatus}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document intelligence */}
            <div
              ref={opsDocsRef}
              className="reveal grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16"
            >
              <div>
                <h3 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
                  {p.opsDocsTitle}
                </h3>
                <p className="mt-3 text-text-secondary">{p.opsDocsDesc}</p>
              </div>
              <ul className="space-y-3">
                {opsDocsBullets.map((bullet, i) => (
                  <li key={i} className="flex gap-3">
                    <IconDot />
                    <span className="text-sm leading-relaxed text-text-secondary">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            5. honto.wholograph — ORCHESTRATOR
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="wholo-heading"
        >
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={wholoHeadRef} className="reveal mb-14 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {p.wholoEyebrow}
              </span>
              <h2
                id="wholo-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.wholoHeading}
              </h2>
              <p className="mt-3 font-mono text-sm uppercase tracking-wider text-text-muted">
                {p.wholoSubtitle}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.wholoDescription}
              </p>
            </div>

            {/* Flow diagram */}
            <div className="mb-16 md:mb-20">
              <WholoGraphFlow />
            </div>

            {/* Capabilities grid */}
            <div className="mb-20">
              <h3 className="mb-8 font-heading text-xl font-bold tracking-tight md:text-2xl">
                {p.wholoCapabilitiesHeading}
              </h3>
              <div
                ref={wholoCapsRef}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {wholoCaps.map((cap, i) => (
                  <div
                    key={cap.title}
                    className="reveal rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:bg-bg-card-hover"
                  >
                    <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h4 className="font-heading text-base font-semibold">
                      {cap.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {cap.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Layers */}
            <div>
              <h3 className="mb-8 font-heading text-xl font-bold tracking-tight md:text-2xl">
                {p.wholoLayersHeading}
              </h3>
              <div ref={wholoLayersRef} className="space-y-3">
                {wholoLayers.map((layer) => (
                  <div
                    key={layer.name}
                    className="reveal flex flex-col gap-2 rounded-xl border border-border bg-bg-card p-5 md:flex-row md:items-start md:gap-8"
                  >
                    <div className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-accent md:w-56 md:shrink-0">
                      {layer.name}
                    </div>
                    <div className="text-sm leading-relaxed text-text-secondary">
                      {layer.role}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            6. honto.infra
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="infra-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={infraHeadRef} className="reveal mb-14 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {p.infraEyebrow}
              </span>
              <h2
                id="infra-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.infraHeading}
              </h2>
              <p className="mt-3 font-mono text-sm uppercase tracking-wider text-text-muted">
                {p.infraSubtitle}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.infraDescription}
              </p>
            </div>

            <div
              ref={infraCardsRef}
              className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {infraStack.map((s) => (
                <div
                  key={s.title}
                  className="reveal rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-violet/30 hover:bg-bg-card-hover"
                >
                  <h3 className="font-heading text-base font-semibold">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-violet/30 bg-bg-card p-6 md:p-8">
              <h3 className="font-heading text-lg font-bold tracking-tight md:text-xl">
                {p.infraWhyTitle}
              </h3>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {p.infraWhyDesc}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            7. DIFFERENTIATORS
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="diff-heading"
        >
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={diffHeadRef} className="reveal mb-16 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {p.diffEyebrow}
              </span>
              <h2
                id="diff-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.diffHeadingLine1}
                <br />
                <span className="gradient-text">{p.diffHeadingLine2}</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.diffDescription}
              </p>
            </div>

            <div ref={diffCardsRef} className="grid gap-6 md:grid-cols-2">
              {diffCards.map((card, i) => (
                <div
                  key={card.title}
                  className="reveal rounded-2xl border border-border bg-bg-card p-7 transition-all duration-300 hover:border-violet/30 hover:bg-bg-card-hover md:p-8"
                >
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-3 font-heading text-xl font-bold tracking-tight md:text-2xl">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-text-secondary">{card.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {card.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-sm text-text-secondary"
                      >
                        <IconCheck className="mt-0.5 shrink-0 text-violet" />
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            8. INTELLIGENCE — Best Practice + Watchman
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="intel-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={intelHeadRef} className="reveal mb-16 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {p.intelEyebrow}
              </span>
              <h2
                id="intel-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.intelHeading}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.intelSubtitle}
              </p>
            </div>

            {/* Best Practice */}
            <div className="mb-20">
              <div className="mb-8 max-w-3xl">
                <h3 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
                  {p.bestPracticeTitle}
                </h3>
                <p className="mt-3 text-text-secondary">{p.bestPracticeDesc}</p>
              </div>
              <div
                ref={bestPracticeRef}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {bestPractices.map((bp) => (
                  <div
                    key={bp.title}
                    className="reveal rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:bg-bg-card-hover"
                  >
                    <h4 className="font-heading text-base font-semibold">
                      {bp.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {bp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Watchman */}
            <div>
              <div className="mb-8 max-w-3xl">
                <h3 className="font-heading text-xl font-bold tracking-tight md:text-2xl">
                  {p.watchmanTitle}
                </h3>
                <p className="mt-3 text-text-secondary">{p.watchmanDesc}</p>
              </div>
              <div
                ref={watchmanRef}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {watchmanCards.map((w, i) => (
                  <div
                    key={w.title}
                    className="reveal rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-violet/30 hover:bg-bg-card-hover"
                  >
                    <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h4 className="font-heading text-base font-semibold">
                      {w.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {w.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            9. WHO USES honto
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="users-heading"
        >
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={usersHeadRef} className="reveal mb-16 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {p.usersEyebrow}
              </span>
              <h2
                id="users-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.usersHeadingLine1}
                <br />
                <span className="gradient-text">{p.usersHeadingLine2}</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.usersDescription}
              </p>
            </div>

            <div
              ref={usersCardsRef}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {userCards.map((u, i) => (
                <div
                  key={u.name}
                  className="reveal rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-violet/30 hover:bg-bg-card-hover"
                >
                  <div className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-heading text-base font-semibold">
                    {u.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {u.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            10. INDUSTRIES
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="industries-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={industriesHeadRef} className="reveal mb-16 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {p.industriesEyebrow}
              </span>
              <h2
                id="industries-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.industriesHeading}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.industriesSubtitle}
              </p>
            </div>

            <div
              ref={industriesTableRef}
              className="reveal overflow-hidden rounded-2xl border border-border"
            >
              <div className="hidden grid-cols-[1.1fr_1.4fr_2fr] border-b border-border bg-bg-card md:grid">
                <div className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {p.industriesColIndustry}
                </div>
                <div className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {p.industriesColSystems}
                </div>
                <div className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {p.industriesColUseCases}
                </div>
              </div>
              {industries.map((row, i) => (
                <div
                  key={row.name}
                  className={`flex flex-col gap-2 border-b border-border px-5 py-5 last:border-b-0 md:grid md:grid-cols-[1.1fr_1.4fr_2fr] md:gap-0 md:py-4 ${
                    i % 2 === 1 ? "bg-bg-card/40" : ""
                  }`}
                >
                  <div className="font-heading font-semibold text-text-primary md:px-5">
                    {row.name}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-accent md:px-5">
                    {row.systems}
                  </div>
                  <div className="text-sm text-text-secondary md:px-5">
                    {row.useCases}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            11. TECHNOLOGY STACK
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="tech-heading"
        >
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={techHeadRef} className="reveal mb-16 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {p.techEyebrow}
              </span>
              <h2
                id="tech-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.techHeading}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.techSubtitle}
              </p>
            </div>

            <div
              ref={techTableRef}
              className="reveal overflow-hidden rounded-2xl border border-border"
            >
              <div className="hidden grid-cols-[1.2fr_1.6fr_2fr] border-b border-border bg-bg-card md:grid">
                <div className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {p.techColComponent}
                </div>
                <div className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {p.techColTechnology}
                </div>
                <div className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {p.techColPurpose}
                </div>
              </div>
              {techRows.map((row, i) => (
                <div
                  key={row.component}
                  className={`flex flex-col gap-2 border-b border-border px-5 py-5 last:border-b-0 md:grid md:grid-cols-[1.2fr_1.6fr_2fr] md:gap-0 md:py-4 ${
                    i % 2 === 1 ? "bg-bg-card/40" : ""
                  }`}
                >
                  <div className="font-heading font-semibold text-text-primary md:px-5">
                    {row.component}
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider text-violet md:px-5">
                    {row.tech}
                  </div>
                  <div className="text-sm text-text-secondary md:px-5">
                    {row.purpose}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            12. DEPLOYMENT TIMELINE
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="deploy-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={deployHeadRef} className="reveal mb-16 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                {p.deployEyebrow}
              </span>
              <h2
                id="deploy-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.deployHeading}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.deploySubtitle}
              </p>
            </div>

            <div ref={deployStepsRef} className="relative">
              {/* connecting line */}
              <div
                className="absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-violet/60 via-violet/20 to-accent/60 md:block"
                aria-hidden="true"
              />
              <ol className="space-y-6 md:space-y-10">
                {deploySteps.map((step, i) => (
                  <li
                    key={step.name}
                    className="reveal relative grid gap-4 md:grid-cols-[auto_1fr] md:gap-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet/40 bg-bg-elevated font-mono text-sm font-bold text-violet">
                        {i + 1}
                      </div>
                      <div className="md:hidden">
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
                          {step.name}
                        </div>
                        <h3 className="mt-1 font-heading text-base font-semibold">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <div className="ml-14 md:ml-0">
                      <div className="hidden md:block">
                        <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-violet">
                          {step.name}
                        </div>
                        <h3 className="mt-1 font-heading text-lg font-semibold md:text-xl">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-text-secondary md:text-base">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            13. SECURITY & COMPLIANCE
        ═══════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="security-heading"
        >
          <div className="relative mx-auto max-w-7xl px-5 md:px-8">
            <div ref={securityHeadRef} className="reveal mb-16 max-w-3xl">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {p.securityEyebrow}
              </span>
              <h2
                id="security-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.securityHeading}
              </h2>
              <p className="mt-3 font-mono text-sm uppercase tracking-wider text-text-muted">
                {p.securitySubheading}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.securityDescription}
              </p>
            </div>

            <div
              ref={securityTableRef}
              className="reveal overflow-hidden rounded-2xl border border-border"
            >
              <div className="hidden grid-cols-[1fr_2.4fr] border-b border-border bg-bg-card md:grid">
                <div className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {p.securityColControl}
                </div>
                <div className="px-5 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                  {p.securityColImplementation}
                </div>
              </div>
              {securityRows.map((row, i) => (
                <div
                  key={row.control}
                  className={`flex flex-col gap-2 border-b border-border px-5 py-5 last:border-b-0 md:grid md:grid-cols-[1fr_2.4fr] md:gap-0 md:py-4 ${
                    i % 2 === 1 ? "bg-bg-card/40" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 font-heading font-semibold text-text-primary md:px-5">
                    {row.control}
                    {row.status === "wip" && (
                      <span className="rounded-full border border-violet/40 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-violet">
                        WIP
                      </span>
                    )}
                  </div>
                  <div className="text-sm leading-relaxed text-text-secondary md:px-5">
                    {row.impl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            14. CTA
        ═══════════════════════════════════════════ */}
        <section
          id="contact"
          className="relative overflow-hidden py-24 md:py-32"
          aria-labelledby="platform-cta-heading"
        >
          <div className="absolute inset-0 bg-bg-elevated" aria-hidden="true" />
          <div
            className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px]"
            style={{
              background:
                "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
            <div ref={ctaRef} className="reveal">
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-violet">
                {p.ctaEyebrow}
              </span>
              <h2
                id="platform-cta-heading"
                className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
              >
                {p.ctaHeadingLine1}
                <br />
                <span className="gradient-text">{p.ctaHeadingLine2}</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-text-secondary">
                {p.ctaDescription}
              </p>

              <ul className="mx-auto mt-8 inline-flex flex-col gap-3 text-left">
                {[p.ctaBullet1, p.ctaBullet2, p.ctaBullet3].map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-3 text-text-secondary"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet/15 text-violet">
                      <IconCheck />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <a
                  href={`/${locale}/#contact`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-violet px-8 py-4 text-base font-semibold text-bg transition-all hover:shadow-[0_0_32px_var(--color-violet-glow)] hover:brightness-110"
                >
                  {p.ctaButton}
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
