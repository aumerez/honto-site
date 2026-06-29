/**
 * Honto AI Readiness Map — insight generation.
 *
 * Turns answers into four maps (business leverage, process drag, expert
 * leverage, system readiness), each item carrying an impact level and a
 * suggested Honto action. Deterministic and answer-driven — no generic filler
 * is emitted unless the corresponding answer is present.
 */

import type {
  InsightItem,
  OpportunityInsights,
  OpportunityMapSubmission,
  SystemReadiness,
} from "./schema";

const OUTCOME_LABEL: Record<string, string> = {
  growth: "grow revenue",
  cost: "cut operating cost",
  speed: "move faster",
  quality: "improve quality",
  cx: "improve customer experience",
  compliance: "reduce compliance risk",
  visibility: "increase visibility",
};

const OUTCOME_ACTION: Record<string, string> = {
  growth: "Deploy agents that accelerate pipeline and conversion.",
  cost: "Automate high-volume manual work to cut operating cost.",
  speed: "Compress cycle times with end-to-end workflow automation.",
  quality: "Add AI checks that catch errors before they ship.",
  cx: "Stand up AI-assisted customer response.",
  compliance: "Automate evidence collection and audit trails.",
  visibility: "Build live dashboards from your operational data.",
};

const AREA_LABEL: Record<string, string> = {
  sales: "sales",
  marketing: "marketing",
  operations: "operations",
  finance: "finance",
  support: "customer support",
  product: "product",
  data: "data & analytics",
  hr: "people / HR",
  other: "the priority area",
};

const FUNCTION_LABEL: Record<string, string> = {
  engineering: "engineering",
  product: "product",
  sales: "sales",
  marketing: "marketing",
  operations: "operations",
  finance: "finance",
  data: "data",
  support: "support",
  leadership: "leadership",
};

const WORKFLOW_LABEL: Record<string, string> = {
  dataEntry: "manual data entry",
  reporting: "report building",
  scheduling: "scheduling and coordination",
  invoicing: "invoicing",
  onboarding: "onboarding",
  reconciliation: "reconciliation",
  statusUpdates: "status updates",
  other: "repetitive work",
};

export function outcomeLabel(value: string): string {
  return OUTCOME_LABEL[value] ?? value;
}

export function areaLabel(value: string): string {
  return AREA_LABEL[value] ?? value;
}

function labelList(values: string[], map: Record<string, string>): string {
  const labels = values.map((v) => map[v] ?? v);
  if (labels.length <= 1) return labels[0] ?? "";
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

/* ── Business leverage ───────────────────────────────────────────────── */

function businessLeverage(s: OpportunityMapSubmission): InsightItem[] {
  const items: InsightItem[] = [];
  const b = s.business;

  b.priorityOutcomes.slice(0, 3).forEach((outcome, i) => {
    items.push({
      key: `outcome.${outcome}`,
      label: `Goal: ${OUTCOME_LABEL[outcome] ?? outcome}`,
      impact: i === 0 ? "high" : "medium",
      action:
        OUTCOME_ACTION[outcome] ?? "Target this outcome with a focused pilot.",
    });
  });

  if (b.urgentArea) {
    items.push({
      key: `urgentArea.${b.urgentArea}`,
      label: `Most urgent in ${AREA_LABEL[b.urgentArea] ?? b.urgentArea}`,
      impact: "high",
      action: `Concentrate the first engagement on ${AREA_LABEL[b.urgentArea] ?? b.urgentArea}.`,
    });
  }

  return items;
}

/* ── Process drag ────────────────────────────────────────────────────── */

function processDrag(s: OpportunityMapSubmission): InsightItem[] {
  const items: InsightItem[] = [];
  const p = s.process;

  if (p.manualWorkLevel === "5" || p.manualWorkLevel === "4") {
    items.push({
      key: "manualWork",
      label: "Heavy manual, repetitive workload",
      impact: p.manualWorkLevel === "5" ? "high" : "medium",
      action: "Automate the highest-volume repetitive workflows first.",
    });
  }
  if (p.repetitiveWorkflows.length > 0) {
    items.push({
      key: "repetitiveWorkflows",
      label: `Time lost to ${labelList(p.repetitiveWorkflows.slice(0, 3), WORKFLOW_LABEL)}`,
      impact: "medium",
      action: "Build agents that own these workflows end to end.",
    });
  }
  if (
    p.approvalBottlenecks === "frequent" ||
    p.approvalBottlenecks === "severe"
  ) {
    items.push({
      key: "approvalBottlenecks",
      label: "Approvals stall work",
      impact: p.approvalBottlenecks === "severe" ? "high" : "medium",
      action: "Add rules-based routing and automated approvals.",
    });
  }
  if (p.dataCopyPaste === "often" || p.dataCopyPaste === "constant") {
    items.push({
      key: "dataCopyPaste",
      label: "Data copied between systems by hand",
      impact: p.dataCopyPaste === "constant" ? "high" : "medium",
      action: "Connect systems so data flows without manual copying.",
    });
  }
  if (p.commFragmentation === "high") {
    items.push({
      key: "commFragmentation",
      label: "Work scattered across many tools",
      impact: "medium",
      action: "Centralize signals into one operational view.",
    });
  }
  if (p.reportingPain === "5" || p.reportingPain === "4") {
    items.push({
      key: "reportingPain",
      label: "Reporting is painful",
      impact: "medium",
      action: "Automate recurring reports from source data.",
    });
  }

  return items;
}

/* ── Expert leverage ─────────────────────────────────────────────────── */

function expertLeverage(s: OpportunityMapSubmission): InsightItem[] {
  const items: InsightItem[] = [];
  const t = s.team;

  if (t.overloadedFunctions.length > 0) {
    items.push({
      key: "overloaded",
      label: `Overloaded: ${labelList(t.overloadedFunctions.slice(0, 3), FUNCTION_LABEL)}`,
      impact: t.overloadedFunctions.length >= 3 ? "high" : "medium",
      action: "Give the most stretched function an AI copilot.",
    });
  }
  if (
    t.knowledgeRisk === "5" ||
    t.knowledgeRisk === "4" ||
    t.knowledgeConcentration.length > 0
  ) {
    items.push({
      key: "knowledgeRisk",
      label: "Critical know-how concentrated in a few functions",
      impact: t.knowledgeRisk === "5" ? "high" : "medium",
      action: "Capture expert workflows into reusable, automated playbooks.",
    });
  }
  if (t.decisionBottlenecks === "frequent") {
    items.push({
      key: "decisionBottlenecks",
      label: "Decisions wait on a few people",
      impact: "medium",
      action: "Surface decision-ready summaries to speed approvals.",
    });
  }
  if (t.handoffIssues === "often") {
    items.push({
      key: "handoffIssues",
      label: "Handoffs between teams cause friction",
      impact: "medium",
      action: "Automate handoffs with shared, structured triggers.",
    });
  }

  return items;
}

/* ── System readiness ────────────────────────────────────────────────── */

function systemReadiness(s: OpportunityMapSubmission): SystemReadiness {
  if (!s.techStack) {
    return {
      summary:
        "System landscape not provided — readiness is an approximate estimate. A short technical review would sharpen it.",
      confidence: "approximate",
      items: [
        {
          key: "techUnknown",
          label: "Technical scope to be confirmed",
          impact: "low",
          action: "Run a 30-minute system review to firm up the plan.",
        },
      ],
    };
  }

  const t = s.techStack;
  const items: InsightItem[] = [];
  if (t.integrationReadiness === "low") {
    items.push({
      key: "siloed",
      label: "Systems are mostly siloed",
      impact: "high",
      action: "Stand up the integration layer agents will rely on.",
    });
  }
  if (t.dataReadiness === "messy") {
    items.push({
      key: "messyData",
      label: "Data is fragmented",
      impact: "high",
      action: "Begin with a focused data-readiness step.",
    });
  }
  if (t.apiAvailability === "few" || t.apiAvailability === "none") {
    items.push({
      key: "fewApis",
      label: "Limited API coverage",
      impact: "medium",
      action: "Plan connectors for systems without clean APIs.",
    });
  }
  if (t.securityRequirements.some((r) => r !== "none")) {
    items.push({
      key: "security",
      label: "Compliance requirements in scope",
      impact: "medium",
      action: "Bake audit trails and access controls in from day one.",
    });
  }

  const summary =
    items.length > 0
      ? "Some groundwork is needed before automation compounds, but the path is clear."
      : "Your systems are in good shape — automation can land quickly.";

  return { summary, confidence: "estimated", items };
}

export function generateInsights(
  s: OpportunityMapSubmission
): OpportunityInsights {
  return {
    businessLeverage: businessLeverage(s),
    processDrag: processDrag(s),
    expertLeverage: expertLeverage(s),
    systemReadiness: systemReadiness(s),
  };
}
