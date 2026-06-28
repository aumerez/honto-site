"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/context/LocaleContext";
import OpportunityHero from "./OpportunityHero";
import SectionProgress from "./SectionProgress";
import OpportunityBoard from "./OpportunityBoard";
import { useOpportunityMapFlow } from "./useOpportunityMapFlow";
import { nextState, prevState, type FlowState } from "./state";
import type { QuestionSection } from "./schema";
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
 * Stateful orchestrator for the AI Readiness Map. Phase 1 wires the full state
 * machine, progress, persistence, resume, start-over, and the skip-tech path.
 * Section bodies are placeholders until the UI flow prompt fills them in.
 */
export default function DiscoveryFlow() {
  const { t } = useLocale();
  const copy = t.opportunityMap as OmCopy;
  const flow = useOpportunityMapFlow();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flow.flowState !== "LANDING") {
      containerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [flow.flowState]);

  if (flow.flowState === "LANDING") {
    return (
      <div className="om-page" ref={containerRef}>
        <OpportunityHero copy={copy} onStart={flow.start} />
      </div>
    );
  }

  const nodes: OmBoardNode[] = MILESTONES.map((m) => ({
    key: m.key,
    code: copy.sections[m.key].code,
    title: copy.sections[m.key].title,
    status: nodeStatus(m, flow.flowState, flow.completion),
  }));

  const onSelect = (key: string) => {
    const m = MILESTONES.find((x) => x.key === key);
    if (m) flow.goTo(m.state);
  };

  const stage = stageContent(flow.flowState, copy);
  const showBack = prevState(flow.flowState, flow.techSkipped) !== null;
  const showNext = nextState(flow.flowState, flow.techSkipped) !== null;
  const showSkip = flow.flowState === "SYSTEM_LANDSCAPE";
  const showStartOver =
    flow.flowState === "READINESS_REPORT" || flow.flowState === "SALES_CTA";

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
            <p className="om-stage-body">{stage.body}</p>

            <div className="om-actions">
              {showBack ? (
                <button type="button" className="btn" onClick={flow.back}>
                  {copy.controls.back}
                </button>
              ) : null}
              {showSkip ? (
                <button type="button" className="btn" onClick={flow.skipTech}>
                  {copy.controls.skip}
                </button>
              ) : null}
              {showNext ? (
                <button
                  type="button"
                  className="btn primary"
                  onClick={flow.next}
                >
                  {copy.controls.next}
                </button>
              ) : null}
              {showStartOver ? (
                <button type="button" className="btn" onClick={flow.startOver}>
                  {copy.controls.startOver}
                </button>
              ) : null}
            </div>
          </section>
        </div>

        <OpportunityBoard
          title={copy.board.title}
          subtitle={copy.board.subtitle}
          emptyLabel={copy.board.empty}
          nodes={nodes}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

function stageContent(
  flowState: FlowState,
  copy: OmCopy
): { eyebrow: string; title: string; body: string } {
  const sectionKey = STATE_TO_SECTION[flowState];
  if (sectionKey && flowState !== "READINESS_REPORT") {
    const s = copy.sections[sectionKey];
    return { eyebrow: s.code, title: s.title, body: copy.placeholders.section };
  }
  if (flowState === "TEASER_RESULT") {
    return {
      eyebrow: "",
      title: copy.placeholders.teaserTitle,
      body: copy.placeholders.teaserBody,
    };
  }
  if (flowState === "CONTACT_GATE") {
    return {
      eyebrow: "",
      title: copy.placeholders.gateTitle,
      body: copy.placeholders.gateBody,
    };
  }
  // READINESS_REPORT and SALES_CTA
  return {
    eyebrow: "",
    title: copy.placeholders.reportTitle,
    body: copy.placeholders.reportBody,
  };
}
