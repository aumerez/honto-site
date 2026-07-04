import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import OpportunityReport from "../OpportunityReport";
import { generateReport } from "../report";
import {
  EMPTY_SUBMISSION,
  EMPTY_TECH_STACK,
  type OpportunityMapSubmission,
} from "../schema";
import enDict from "@/locales/en.json";
import type { OmCopy } from "../types";

const copy = (enDict as { opportunityMap: unknown }).opportunityMap as OmCopy;
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

function richSubmission(): OpportunityMapSubmission {
  const s = clone(EMPTY_SUBMISSION);
  s.company = {
    companyName: "Acme",
    website: "",
    industry: "tech",
    companySize: "201-1000",
    stage: "scaling",
    mainPressure: "efficiency",
  };
  s.business = {
    priorityOutcomes: ["cost", "speed"],
    urgentArea: "operations",
    timeframe: "asap",
  };
  s.process = {
    ...s.process,
    manualWorkLevel: "5",
    repetitiveWorkflows: ["dataEntry"],
    dataCopyPaste: "constant",
  };
  s.team = { ...s.team, overloadedFunctions: ["operations", "finance"] };
  s.techStack = {
    ...EMPTY_TECH_STACK,
    crm: ["salesforce"],
    integrationReadiness: "low",
    dataReadiness: "messy",
  };
  s.techSkipped = false;
  return s;
}

function renderReport(answers: OpportunityMapSubmission, onReview = vi.fn()) {
  render(
    <OpportunityReport answers={answers} copy={copy} onReview={onReview} />
  );
  return onReview;
}

const CODES = [
  "[01]",
  "[02]",
  "[03]",
  "[04]",
  "[05]",
  "[06]",
  "[07]",
  "[08]",
  "[09]",
  "[10]",
];

describe("OpportunityReport", () => {
  it("renders all ten numbered sections", () => {
    renderReport(richSubmission());
    for (const code of CODES) {
      expect(screen.getByText(code)).toBeTruthy();
    }
  });

  it("renders the opportunity score, band, and explanation", () => {
    const answers = richSubmission();
    const r = generateReport(answers);
    renderReport(answers);
    expect(screen.getByText("/ 100")).toBeTruthy();
    expect(screen.getByText(String(r.signal.score))).toBeTruthy();
    expect(screen.getByText(r.signal.explanation)).toBeTruthy();
    expect(
      screen.getAllByText(copy.signalBands[r.signal.band]).length
    ).toBeGreaterThan(0);
  });

  it("renders an allowed complexity label and never 'Medium'", () => {
    const answers = richSubmission();
    const r = generateReport(answers);
    renderReport(answers);
    expect(
      ["Simple", "Structured", "Advanced"].includes(
        copy.report.complexityBands[r.complexity.band]
      )
    ).toBe(true);
    expect(
      screen.getByText(copy.report.complexityBands[r.complexity.band])
    ).toBeTruthy();
    expect(screen.queryAllByText(/medium/i)).toHaveLength(0);
  });

  it("renders exactly three first moves", () => {
    const { container } = render(
      <OpportunityReport
        answers={richSubmission()}
        copy={copy}
        onReview={vi.fn()}
      />
    );
    expect(container.querySelectorAll(".om-report-moves li")).toHaveLength(3);
  });

  it("renders a four-week operating plan", () => {
    renderReport(richSubmission());
    expect(screen.getByText("Week 1")).toBeTruthy();
    expect(screen.getByText("Week 2")).toBeTruthy();
    expect(screen.getByText("Week 3")).toBeTruthy();
    expect(screen.getByText("Week 4")).toBeTruthy();
  });

  it("renders a working Review with Honto CTA", () => {
    const onReview = renderReport(richSubmission());
    const cta = screen.getByRole("button", { name: /review with honto/i });
    fireEvent.click(cta);
    expect(onReview).toHaveBeenCalledOnce();
  });

  it("renders a lighter-confidence state when the tech stack is skipped", () => {
    const answers = richSubmission();
    answers.techStack = null;
    answers.techSkipped = true;
    renderReport(answers);
    expect(screen.getByText(copy.report.skippedNote)).toBeTruthy();
    // Still a complete, ten-section report.
    for (const code of CODES) {
      expect(screen.getByText(code)).toBeTruthy();
    }
  });

  it("renders a complete report from a partial/empty submission", () => {
    const { container } = render(
      <OpportunityReport
        answers={EMPTY_SUBMISSION}
        copy={copy}
        onReview={vi.fn()}
      />
    );
    for (const code of CODES) {
      expect(screen.getByText(code)).toBeTruthy();
    }
    expect(container.querySelectorAll(".om-report-moves li")).toHaveLength(3);
    expect(screen.getByText("Week 4")).toBeTruthy();
  });
});
