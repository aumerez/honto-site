import { describe, it, expect } from "vitest";
import { BANNED_PATTERNS, auditQuestions, scanText } from "../privacy";
import { QUESTIONS } from "../questions";

describe("OpportunityMap privacy guard", () => {
  it("defines banned patterns", () => {
    expect(BANNED_PATTERNS.length).toBeGreaterThan(0);
  });

  it("catches each banned request phrasing", () => {
    expect(scanText("Enter your password")).toContain("password");
    expect(scanText("Paste your API key here")).toContain("apiKey");
    expect(scanText("Provide your credentials")).toContain("credentials");
    expect(scanText("Upload a private document")).toContain("privateDocument");
    expect(scanText("Share your private chat logs")).toContain("privateChat");
    expect(scanText("Link your private repository")).toContain("privateRepo");
    expect(scanText("Add each employee LinkedIn URL")).toContain(
      "employeeLinkedin"
    );
    expect(scanText("Share their personal profile")).toContain(
      "personalProfile"
    );
  });

  it("does not flag legitimate, privacy-safe copy", () => {
    expect(scanText("Company website")).toEqual([]);
    expect(scanText("Public company LinkedIn page")).toEqual([]);
    expect(scanText("API availability across your systems")).toEqual([]);
    expect(scanText("Identity / SSO")).toEqual([]);
  });

  it("finds no banned requests anywhere in the real question set", () => {
    expect(auditQuestions(QUESTIONS)).toEqual([]);
  });
});
