"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import OpportunityHero from "./OpportunityHero";
import SectionProgress from "./SectionProgress";
import OpportunityBoard from "./OpportunityBoard";
import BusinessSection from "./BusinessSection";
import ProcessSection from "./ProcessSection";
import TeamSection from "./TeamSection";
import TechStackSection from "./TechStackSection";
import ContactGate from "./ContactGate";
import InsightTeaser from "./InsightTeaser";
import OpportunityReport from "./OpportunityReport";
import { useOpportunityMapFlow } from "./useOpportunityMapFlow";
import { nextState, prevState, type FlowState } from "./state";
import {
  EMPTY_TECH_STACK,
  QUESTION_SECTIONS,
  validateContact,
  type ContactInfo,
  type OpportunityMapSubmission,
  type QuestionSection,
} from "./schema";
import { findMissingRequired, type AnswerValue } from "./questions";
import { computeComplexity, computeSignal } from "./scoring";
import {
  trackOpportunityMapEvent,
  type OpportunityMapEvent,
} from "./analytics";
import type { OmBoardNode, OmCopy, OmSectionKey } from "./types";

type Milestone = { key: OmSectionKey; state: FlowState };

const MILESTONES: Milestone[] = [
  { key: "businessContext", state: "BUSINESS_CONTEXT" },
  { key: "businessGoals", state: "BUSINESS_GOALS" },
  { key: "processDrag", state: "PROCESS_DRAG" },
  { key: "expertLeverage", state: "EXPERT_LEVERAGE" },
  { key: "systemLandscape", state: "SYSTEM_LANDSCAPE" },
  { key: "report", state: "READINESS_REPORT" },
];

const STATE_TO_SECTION: Partial<Record<FlowState, OmSectionKey>> = {
  BUSINESS_CONTEXT: "businessContext",
  BUSINESS_GOALS: "businessGoals",
  PROCESS_DRAG: "processDrag",
  EXPERT_LEVERAGE: "expertLeverage",
  SYSTEM_LANDSCAPE: "systemLandscape",
  READINESS_REPORT: "report",
};

const SECTION_KEY: Record<
  QuestionSection,
  "company" | "business" | "process" | "team" | "techStack" | "contact"
> = {
  BUSINESS_CONTEXT: "company",
  BUSINESS_GOALS: "business",
  PROCESS_DRAG: "process",
  EXPERT_LEVERAGE: "team",
  SYSTEM_LANDSCAPE: "techStack",
  CONTACT_GATE: "contact",
};

function isQuestionSection(s: FlowState): s is QuestionSection {
  return (QUESTION_SECTIONS as readonly string[]).includes(s);
}

function nodeStatus(
  m: Milestone,
  flowState: FlowState,
  completion: Record<QuestionSection, boolean>
): OmBoardNode["status"] {
  if (m.state === flowState) return "current";
  if (m.key === "report") return flowState === "SALES_CTA" ? "done" : "pending";
  return completion[m.state as QuestionSection] ? "done" : "pending";
}

/**
 * Best-effort lead notification. The report is shown locally regardless of
 * delivery, so failures are swallowed and never block the user.
 */
function submitLead(answers: OpportunityMapSubmission) {
  void fetch("/api/opportunity-map", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submission: answers }),
  }).catch(() => {});
}

export default function DiscoveryFlow() {
  const { locale, t } = useLocale();
  const copy = t.opportunityMap as OmCopy;
  const flow = useOpportunityMapFlow();
  const [attempted, setAttempted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAttempted(false);
    const fs = flow.flowState;
    if (fs !== "LANDING") {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    const viewed: Partial<Record<typeof fs, OpportunityMapEvent>> = {
      LANDING: "opportunity_map_page_viewed",
      TEASER_RESULT: "teaser_result_viewed",
      SYSTEM_LANDSCAPE: "tech_stack_started",
      CONTACT_GATE: "contact_gate_viewed",
      READINESS_REPORT: "report_generated",
    };
    const event = viewed[fs];
    if (event) track(event);
    // Fire view events only when the section changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flow.flowState]);

  if (flow.flowState === "LANDING") {
    return (
      <div className="om-page" ref={containerRef}>
        <OpportunityHero
          copy={copy}
          hasSavedProgress={flow.hasSavedProgress}
          onStart={() => {
            track("opportunity_map_start_clicked");
            flow.start();
          }}
          onResume={flow.resume}
          onStartOver={flow.startOver}
        />
      </div>
    );
  }

  const slice = currentSlice(flow.flowState);
  const errors = currentErrors();
  const stage = stageContent(flow.flowState, copy);

  const nodes: OmBoardNode[] = MILESTONES.map((m) => ({
    key: m.key,
    code: copy.sections[m.key].code,
    title: copy.sections[m.key].title,
    status: nodeStatus(m, flow.flowState, flow.completion),
  }));

  return (
    <div className="om-page" ref={containerRef}>
      <div className="om-layout">
        <div className="om-main">
          <SectionProgress
            label={copy.progress.label}
            progress={flow.progress}
            nodes={nodes}
          />
          <section className="om-stage" aria-labelledby="om-stage-h">
            {stage.eyebrow ? (
              <span className="om-stage-eyebrow">{stage.eyebrow}</span>
            ) : null}
            <h2 id="om-stage-h" className="om-stage-title">
              {stage.title}
            </h2>

            {renderBody()}
            {renderControls()}
          </section>
        </div>

        <OpportunityBoard
          title={copy.board.title}
          subtitle={copy.board.subtitle}
          emptyLabel={copy.board.empty}
          nodes={nodes}
          onSelect={(key) => {
            const m = MILESTONES.find((x) => x.key === key);
            if (m) flow.goTo(m.state);
          }}
        />
      </div>
    </div>
  );

  function onChange(id: string, value: AnswerValue) {
    if (!isQuestionSection(flow.flowState)) return;
    flow.patch(SECTION_KEY[flow.flowState], { [id]: value });
  }

  function track(event: OpportunityMapEvent) {
    trackOpportunityMapEvent(event, {
      section: flow.flowState,
      locale,
      techSkipped: flow.techSkipped,
      scoreBand: computeSignal(flow.answers).band,
      complexityBand: computeComplexity(flow.answers).band,
    });
  }

  function renderBody() {
    const fs = flow.flowState;
    if (fs === "BUSINESS_CONTEXT" || fs === "BUSINESS_GOALS") {
      return (
        <BusinessSection
          section={fs}
          values={slice}
          errors={errors}
          onChange={onChange}
        />
      );
    }
    if (fs === "PROCESS_DRAG") {
      return (
        <ProcessSection values={slice} errors={errors} onChange={onChange} />
      );
    }
    if (fs === "EXPERT_LEVERAGE") {
      return <TeamSection values={slice} errors={errors} onChange={onChange} />;
    }
    if (fs === "SYSTEM_LANDSCAPE") {
      return (
        <TechStackSection
          values={slice}
          errors={errors}
          onChange={onChange}
          note={copy.techNote}
        />
      );
    }
    if (fs === "TEASER_RESULT") {
      return (
        <InsightTeaser
          answers={flow.answers}
          bands={copy.signalBands}
          signalLine={copy.teaser.signalLine}
          leverageLead={copy.teaser.leverageLead}
          prioritize={copy.teaser.prioritize}
        />
      );
    }
    if (fs === "CONTACT_GATE") {
      return (
        <ContactGate
          values={slice}
          errors={errors}
          onChange={onChange}
          privacy={[copy.privacy.line1, copy.privacy.line2, copy.privacy.line3]}
        />
      );
    }
    if (fs === "READINESS_REPORT") {
      return (
        <OpportunityReport
          answers={flow.answers}
          copy={copy}
          onReview={() => {
            track("review_cta_clicked");
            flow.next();
          }}
        />
      );
    }
    return renderSalesCta();
  }

  function renderSalesCta() {
    return (
      <div className="om-sales">
        <p className="om-stage-body">{copy.sales.body}</p>
        <a className="btn primary" href={`/${locale}#contact`}>
          {copy.sales.cta}
        </a>
      </div>
    );
  }

  function renderControls() {
    const fs = flow.flowState;
    const hasBack = prevState(fs, flow.techSkipped) !== null;
    const showSkip = fs === "SYSTEM_LANDSCAPE";
    // The report carries its own "Review with Honto" CTA (the [10] card), so no
    // separate advance button there.
    const showAdvance =
      nextState(fs, flow.techSkipped) !== null && fs !== "READINESS_REPORT";
    const showStartOver = fs === "READINESS_REPORT" || fs === "SALES_CTA";
    const advanceLabel =
      fs === "CONTACT_GATE" ? copy.controls.seeReport : copy.controls.next;

    return (
      <div className="om-actions">
        {hasBack ? (
          <button type="button" className="btn" onClick={flow.back}>
            {copy.controls.back}
          </button>
        ) : null}
        {showSkip ? (
          <button type="button" className="btn" onClick={flow.skipTech}>
            {copy.controls.skip}
          </button>
        ) : null}
        {showAdvance ? (
          <button type="button" className="btn primary" onClick={handleAdvance}>
            {advanceLabel}
          </button>
        ) : null}
        {showStartOver ? (
          <button type="button" className="btn" onClick={flow.startOver}>
            {copy.controls.startOver}
          </button>
        ) : null}
      </div>
    );
  }

  function handleAdvance() {
    const fs = flow.flowState;
    if (fs === "CONTACT_GATE") {
      if (!validateContact(flow.answers.contact).ok) {
        setAttempted(true);
        return;
      }
      track("contact_submitted");
      submitLead(flow.answers);
      flow.next();
      return;
    }
    if (isQuestionSection(fs)) {
      const missing = findMissingRequired(fs, currentSlice(fs));
      if (missing.length > 0) {
        setAttempted(true);
        return;
      }
    }
    const completed: Partial<Record<FlowState, OpportunityMapEvent>> = {
      BUSINESS_GOALS: "business_section_completed",
      PROCESS_DRAG: "process_section_completed",
      EXPERT_LEVERAGE: "team_section_completed",
      SYSTEM_LANDSCAPE: "tech_stack_completed",
    };
    const event = completed[fs];
    if (event) track(event);
    flow.next();
  }

  function currentSlice(fs: FlowState): Record<string, AnswerValue> {
    switch (fs) {
      case "BUSINESS_CONTEXT":
        return flow.answers.company as unknown as Record<string, AnswerValue>;
      case "BUSINESS_GOALS":
        return flow.answers.business as unknown as Record<string, AnswerValue>;
      case "PROCESS_DRAG":
        return flow.answers.process as unknown as Record<string, AnswerValue>;
      case "EXPERT_LEVERAGE":
        return flow.answers.team as unknown as Record<string, AnswerValue>;
      case "SYSTEM_LANDSCAPE":
        return (flow.answers.techStack ??
          EMPTY_TECH_STACK) as unknown as Record<string, AnswerValue>;
      case "CONTACT_GATE":
        return flow.answers.contact as unknown as Record<string, AnswerValue>;
      default:
        return {};
    }
  }

  function currentErrors(): Record<string, string> {
    if (!attempted) return {};
    const fs = flow.flowState;
    if (fs === "CONTACT_GATE") {
      const { errors: e } = validateContact(flow.answers.contact);
      return mapContactErrors(e);
    }
    if (isQuestionSection(fs)) {
      return Object.fromEntries(
        findMissingRequired(fs, currentSlice(fs)).map((id) => [
          id,
          copy.validation.required,
        ])
      );
    }
    return {};
  }

  function mapContactErrors(
    raw: Record<string, string>
  ): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [field, code] of Object.entries(raw)) {
      if (code === "required") out[field] = copy.validation.required;
      else if (field === "email") out[field] = copy.validation.invalidEmail;
      else if (field === ("companyLinkedin" satisfies keyof ContactInfo))
        out[field] = copy.validation.invalidUrl;
      else if (field === "phone") out[field] = copy.validation.invalidPhone;
      else out[field] = copy.validation.required;
    }
    return out;
  }
}

function stageContent(
  flowState: FlowState,
  copy: OmCopy
): { eyebrow: string; title: string } {
  const sectionKey = STATE_TO_SECTION[flowState];
  if (sectionKey && flowState !== "READINESS_REPORT") {
    const s = copy.sections[sectionKey];
    return { eyebrow: s.code, title: s.title };
  }
  if (flowState === "TEASER_RESULT") {
    return { eyebrow: "", title: copy.teaser.title };
  }
  if (flowState === "CONTACT_GATE") {
    return { eyebrow: "", title: copy.gate.title };
  }
  if (flowState === "READINESS_REPORT") {
    return { eyebrow: "", title: copy.report.title };
  }
  return { eyebrow: "", title: copy.sales.title };
}
