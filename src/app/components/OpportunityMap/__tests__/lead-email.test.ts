import { describe, it, expect } from "vitest";
import { buildBusinessEmail, buildLeadEmail } from "../lead-email";
import { generateReport } from "../report";
import { EMPTY_SUBMISSION, type OpportunityMapSubmission } from "../schema";

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

function submission(): OpportunityMapSubmission {
  const s = clone(EMPTY_SUBMISSION);
  s.company = {
    companyName: "Acme",
    website: "https://acme.com",
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
  s.process = { ...s.process, manualWorkLevel: "5", dataCopyPaste: "constant" };
  s.team = { ...s.team, overloadedFunctions: ["operations", "finance"] };
  s.contact = {
    contactName: "Dana Lee",
    email: "dana@acme.com",
    role: "founderExec",
    company: "Acme",
    phone: "",
    companyLinkedin: "",
    consent: true,
  };
  return s;
}

describe("buildLeadEmail", () => {
  it("uses the required subject format", () => {
    const s = submission();
    const report = generateReport(s);
    const email = buildLeadEmail(s, report);
    expect(email.subject).toBe(
      `New Honto AI Readiness Lead — Acme — Signal ${report.signal.score}/100`
    );
    expect(email.replyTo).toBe("dana@acme.com");
  });

  it("includes every required summary field", () => {
    const s = submission();
    const report = generateReport(s);
    const { text } = buildLeadEmail(s, report);
    const expected = [
      "Company: Acme",
      "Contact: Dana Lee",
      "Email: dana@acme.com",
      "Role: founderExec",
      "Website: https://acme.com",
      "Industry: tech",
      "Company size: 201-1000",
      "Stage: scaling",
      "Main problem: efficiency",
      "Business goals: cost, speed",
      "Manual work level: 5",
      "Most overloaded areas: operations, finance",
      "Current stack:",
      "Integration readiness:",
      "Data readiness:",
      "Security requirement:",
      "AI opportunity signal:",
      "Implementation complexity:",
      "Estimated first phase:",
      "Top 3 first moves:",
      "Suggested sales angle:",
      "Suggested first review/demo:",
    ];
    for (const line of expected) {
      expect(text).toContain(line);
    }
  });

  it("includes the deterministic sales fields", () => {
    const s = submission();
    const report = generateReport(s);
    const { text } = buildLeadEmail(s, report);
    expect(text).toContain(report.salesAngle);
    expect(text).toContain(report.demoScenario);
    expect(text).toContain(report.complexity.estimatedFirstPhase);
    expect(text).toContain(report.complexity.band);
  });

  it("marks a skipped tech stack instead of failing", () => {
    const s = submission();
    s.techStack = null;
    s.techSkipped = true;
    const report = generateReport(s);
    const { text } = buildLeadEmail(s, report);
    expect(text).toContain("Current stack: Skipped");
    expect(text).toContain("Integration readiness: Not provided");
  });
});

describe("buildBusinessEmail", () => {
  it("summarizes the business context with the early subject", () => {
    const email = buildBusinessEmail(submission());
    expect(email.subject).toBe(
      "New Honto AI Readiness — Acme — business context"
    );
    expect(email.text).toContain("Company: Acme");
    expect(email.text).toContain("Business goals: cost, speed");
    expect(email.text).toContain("Most urgent area: operations");
    // The early email carries no scoring/report content.
    expect(email.text).not.toContain("AI opportunity signal");
    expect(email.text).not.toContain("Top 3 first moves");
    expect(email.replyTo).toBeUndefined();
  });
});
