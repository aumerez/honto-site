/**
 * Honto AI Readiness Map — report assembly.
 *
 * Combines the deterministic scores and insights into the data a readiness
 * report needs: top-3 first moves, a 30-day operating plan, a suggested sales
 * angle, and a suggested first demo/review scenario. The 10-card presentation
 * and React rendering live in the report component.
 */

import type {
  ImpactLevel,
  InsightItem,
  OpportunityMapSubmission,
  OpportunityReport,
  ThirtyDayWeek,
} from "./schema";
import { computeComplexity, computeSignal, signalBandLabel } from "./scoring";
import { areaLabel, generateInsights, outcomeLabel } from "./insights";

const IMPACT_RANK: Record<ImpactLevel, number> = { high: 3, medium: 2, low: 1 };

const DEFAULT_MOVES = [
  "Map your highest-volume manual workflow and automate it first.",
  "Connect your core systems so data flows without manual copying.",
  "Stand up a focused pilot with clear before/after metrics.",
];

function allInsightItems(
  insights: ReturnType<typeof generateInsights>
): InsightItem[] {
  return [
    ...insights.businessLeverage,
    ...insights.processDrag,
    ...insights.expertLeverage,
    ...insights.systemReadiness.items,
  ];
}

/** Exactly three actions, highest impact first, padded with sensible defaults. */
function firstMoves(items: InsightItem[]): string[] {
  const ranked = [...items].sort(
    (a, b) => IMPACT_RANK[b.impact] - IMPACT_RANK[a.impact]
  );
  const moves: string[] = [];
  for (const item of ranked) {
    if (!moves.includes(item.action)) moves.push(item.action);
    if (moves.length === 3) break;
  }
  for (const fallback of DEFAULT_MOVES) {
    if (moves.length === 3) break;
    if (!moves.includes(fallback)) moves.push(fallback);
  }
  return moves.slice(0, 3);
}

function thirtyDayPlan(
  s: OpportunityMapSubmission,
  moves: string[],
  phase: string
): ThirtyDayWeek[] {
  const area = s.business.urgentArea
    ? areaLabel(s.business.urgentArea)
    : "the priority area";
  const topOutcome = s.business.priorityOutcomes[0]
    ? outcomeLabel(s.business.priorityOutcomes[0])
    : "the target outcome";
  return [
    {
      week: 1,
      focus: "Discovery & access",
      detail: `Map systems, data, and the top workflow in ${area}.`,
    },
    {
      week: 2,
      focus: "First automation",
      detail: moves[0],
    },
    {
      week: 3,
      focus: "Pilot in production",
      detail: `Ship the pilot (first phase: ${phase}). ${moves[1]}`,
    },
    {
      week: 4,
      focus: "Measure & expand",
      detail: `Review impact on ${topOutcome} and scope the next move: ${moves[2]}`,
    },
  ];
}

function salesAngle(
  s: OpportunityMapSubmission,
  signalLabel: string,
  topMove: string,
  phase: string,
  band: string
): string {
  const company = s.company.companyName.trim() || "This team";
  const area = s.business.urgentArea
    ? areaLabel(s.business.urgentArea)
    : "their priority area";
  return `${signalLabel}. ${company} can see fast leverage in ${area}: ${topMove} Estimated first phase: ${phase} (${band}).`;
}

function demoScenario(
  s: OpportunityMapSubmission,
  insights: ReturnType<typeof generateInsights>
): string {
  const area = s.business.urgentArea
    ? areaLabel(s.business.urgentArea)
    : "the priority";
  const topDrag =
    insights.processDrag[0]?.label.toLowerCase() ?? "a high-volume workflow";
  return `Show a working agent that takes over ${topDrag} for the ${area} team — the fastest visible win.`;
}

export function generateReport(s: OpportunityMapSubmission): OpportunityReport {
  const signal = computeSignal(s);
  const complexity = computeComplexity(s);
  const insights = generateInsights(s);

  const moves = firstMoves(allInsightItems(insights));
  const plan = thirtyDayPlan(s, moves, complexity.estimatedFirstPhase);

  return {
    signal,
    complexity,
    insights,
    firstMoves: moves,
    thirtyDayPlan: plan,
    salesAngle: salesAngle(
      s,
      signalBandLabel(signal.band),
      moves[0],
      complexity.estimatedFirstPhase,
      complexity.band
    ),
    demoScenario: demoScenario(s, insights),
    techSkipped: s.techSkipped,
  };
}
