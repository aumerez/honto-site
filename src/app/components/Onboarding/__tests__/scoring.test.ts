import { describe, it, expect } from "vitest";
import { EMPTY_ANSWERS, type Answers } from "../schema";
import {
  bandFor,
  computeScore,
  computeSizing,
  scoreAIUsage,
  scoreDataReadiness,
  scoreGovernance,
  scoreSystems,
  scoreTalent,
  sizeFor,
} from "../scoring";

function answersWith(overrides: Partial<Answers>): Answers {
  return {
    step1: { ...EMPTY_ANSWERS.step1, ...overrides.step1 },
    step2: { ...EMPTY_ANSWERS.step2, ...overrides.step2 },
    step3: { ...EMPTY_ANSWERS.step3, ...overrides.step3 },
    step4: { ...EMPTY_ANSWERS.step4, ...overrides.step4 },
    step5: { ...EMPTY_ANSWERS.step5, ...overrides.step5 },
  };
}

describe("bandFor", () => {
  it("maps boundary values to the correct band", () => {
    expect(bandFor(0)).toBe("foundational");
    expect(bandFor(25)).toBe("foundational");
    expect(bandFor(26)).toBe("emerging");
    expect(bandFor(50)).toBe("emerging");
    expect(bandFor(51)).toBe("operational");
    expect(bandFor(75)).toBe("operational");
    expect(bandFor(76)).toBe("advanced");
    expect(bandFor(100)).toBe("advanced");
  });
});

describe("sizeFor", () => {
  it("maps boundary weeks to the correct T-shirt", () => {
    expect(sizeFor(4)).toBe("S");
    expect(sizeFor(6)).toBe("S");
    expect(sizeFor(7)).toBe("M");
    expect(sizeFor(10)).toBe("M");
    expect(sizeFor(11)).toBe("L");
    expect(sizeFor(16)).toBe("L");
    expect(sizeFor(17)).toBe("XL");
    expect(sizeFor(100)).toBe("XL");
  });
});

describe("scoreSystems", () => {
  it("returns 0 for empty answers", () => {
    expect(scoreSystems(EMPTY_ANSWERS)).toBe(0);
  });

  it("awards modern stack the full 20 points", () => {
    const a = answersWith({
      step2: {
        ...EMPTY_ANSWERS.step2,
        crm: ["salesforce"],
        erp: ["sap"],
        warehouse: ["snowflake"],
        identity: ["okta"],
      },
      step3: { ...EMPTY_ANSWERS.step3, integrated: "yes" },
    });
    expect(scoreSystems(a)).toBe(20);
  });

  it("treats postgres-only warehouse as legacy", () => {
    const a = answersWith({
      step2: { ...EMPTY_ANSWERS.step2, warehouse: ["postgres"] },
    });
    expect(scoreSystems(a)).toBe(0);
  });

  it("partial credit for 'other' selections", () => {
    const a = answersWith({
      step2: { ...EMPTY_ANSWERS.step2, crm: ["other"] },
    });
    expect(scoreSystems(a)).toBe(2);
  });

  it("treats 'none' selection as no system", () => {
    const a = answersWith({
      step2: { ...EMPTY_ANSWERS.step2, crm: ["none"] },
    });
    expect(scoreSystems(a)).toBe(0);
  });
});

describe("scoreDataReadiness", () => {
  it("returns 0 for empty answers", () => {
    expect(scoreDataReadiness(EMPTY_ANSWERS)).toBe(0);
  });

  it("awards full 25 points for ideal data posture", () => {
    const a = answersWith({
      step3: {
        ...EMPTY_ANSWERS.step3,
        dataLocation: "warehouse",
        dataVolume: "1tb+",
        documented: "yes",
        integrated: "yes",
      },
    });
    expect(scoreDataReadiness(a)).toBe(25);
  });

  it("gives no volume points if user picks 'dontKnow'", () => {
    const a = answersWith({
      step3: { ...EMPTY_ANSWERS.step3, dataVolume: "dontKnow" },
    });
    expect(scoreDataReadiness(a)).toBe(0);
  });
});

describe("scoreAIUsage", () => {
  it("returns 0 for empty answers", () => {
    expect(scoreAIUsage(EMPTY_ANSWERS)).toBe(0);
  });

  it("awards full 25 points for production AI + high familiarity + shipped projects", () => {
    const a = answersWith({
      step4: {
        ...EMPTY_ANSWERS.step4,
        currentUse: "production",
        priorProjects: "production",
        llmFamiliarity: "high",
      },
    });
    expect(scoreAIUsage(a)).toBe(25);
  });
});

describe("scoreGovernance", () => {
  it("returns 0 for empty answers", () => {
    expect(scoreGovernance(EMPTY_ANSWERS)).toBe(0);
  });

  it("awards points for any privacy selection (including 'none')", () => {
    const a = answersWith({
      step4: { ...EMPTY_ANSWERS.step4, privacy: ["none"] },
    });
    expect(scoreGovernance(a)).toBe(6);
  });

  it("awards full 15 points for formal program plus any privacy", () => {
    const a = answersWith({
      step4: {
        ...EMPTY_ANSWERS.step4,
        governance: "formal",
        privacy: ["gdpr"],
      },
    });
    expect(scoreGovernance(a)).toBe(15);
  });
});

describe("scoreTalent", () => {
  it("maps each tier to the right score", () => {
    expect(scoreTalent(EMPTY_ANSWERS)).toBe(0);
    expect(
      scoreTalent(
        answersWith({ step4: { ...EMPTY_ANSWERS.step4, talent: "one" } })
      )
    ).toBe(5);
    expect(
      scoreTalent(
        answersWith({
          step4: { ...EMPTY_ANSWERS.step4, talent: "small" },
        })
      )
    ).toBe(10);
    expect(
      scoreTalent(
        answersWith({
          step4: { ...EMPTY_ANSWERS.step4, talent: "dedicated" },
        })
      )
    ).toBe(15);
  });
});

describe("computeScore", () => {
  it("returns total 0 and band foundational for empty answers", () => {
    const r = computeScore(EMPTY_ANSWERS);
    expect(r.total).toBe(0);
    expect(r.band).toBe("foundational");
    expect(r.dimensions).toEqual({
      systems: 0,
      dataReadiness: 0,
      aiUsage: 0,
      governance: 0,
      talent: 0,
    });
  });

  it("returns total 100 and band advanced for max answers", () => {
    const a = answersWith({
      step2: {
        ...EMPTY_ANSWERS.step2,
        crm: ["salesforce"],
        erp: ["sap"],
        warehouse: ["snowflake"],
        identity: ["okta"],
      },
      step3: {
        ...EMPTY_ANSWERS.step3,
        dataLocation: "warehouse",
        dataVolume: "1tb+",
        documented: "yes",
        integrated: "yes",
      },
      step4: {
        ...EMPTY_ANSWERS.step4,
        currentUse: "production",
        priorProjects: "production",
        llmFamiliarity: "high",
        governance: "formal",
        privacy: ["gdpr"],
        talent: "dedicated",
      },
    });
    const r = computeScore(a);
    expect(r.total).toBe(100);
    expect(r.band).toBe("advanced");
  });
});

describe("computeSizing", () => {
  it("returns base 4 weeks (S) for empty answers", () => {
    const r = computeSizing(EMPTY_ANSWERS);
    expect(r.weeks).toBe(4);
    expect(r.size).toBe("S");
    expect(r.weeksMin).toBe(4);
    expect(r.weeksMax).toBe(6);
    expect(r.reasons).toEqual([]);
  });

  it("adds 1 week per system category beyond the first 3", () => {
    const a = answersWith({
      step2: {
        ...EMPTY_ANSWERS.step2,
        crm: ["salesforce"],
        erp: ["sap"],
        warehouse: ["snowflake"],
        comms: ["slack"],
        ticketing: ["zendesk"],
      },
    });
    const r = computeSizing(a);
    expect(r.weeks).toBe(4 + 2);
    expect(r.reasons).toContain("manySystems");
  });

  it("adds 2 weeks for 11+ custom apps", () => {
    const a = answersWith({
      step2: { ...EMPTY_ANSWERS.step2, customApps: "11+" },
    });
    expect(computeSizing(a).weeks).toBe(6);
  });

  it("adds 2 weeks for fragmented data and 2 more for undocumented processes", () => {
    const a = answersWith({
      step3: {
        ...EMPTY_ANSWERS.step3,
        dataLocation: "spreadsheets",
        documented: "no",
      },
    });
    const r = computeSizing(a);
    expect(r.weeks).toBe(8);
    expect(r.size).toBe("M");
    expect(r.reasons).toEqual(
      expect.arrayContaining(["fragmentedData", "undocumented"])
    );
  });

  it("adds 2 weeks per high-stakes compliance constraint", () => {
    const a = answersWith({
      step4: {
        ...EMPTY_ANSWERS.step4,
        privacy: ["hipaa", "soc2", "pci"],
      },
    });
    expect(computeSizing(a).weeks).toBe(4 + 6);
  });

  it("does not add compliance weeks for GDPR/internal/none alone", () => {
    const a = answersWith({
      step4: {
        ...EMPTY_ANSWERS.step4,
        privacy: ["gdpr", "internal", "none"],
      },
    });
    expect(computeSizing(a).weeks).toBe(4);
  });

  it("adds 1 week if no AI/ML talent on team", () => {
    const a = answersWith({
      step4: { ...EMPTY_ANSWERS.step4, talent: "none" },
    });
    expect(computeSizing(a).weeks).toBe(5);
    expect(computeSizing(a).reasons).toContain("noTalent");
  });

  it("hits XL when many factors stack up", () => {
    const a = answersWith({
      step2: {
        ...EMPTY_ANSWERS.step2,
        crm: ["salesforce"],
        erp: ["sap"],
        warehouse: ["snowflake"],
        comms: ["slack"],
        ticketing: ["zendesk"],
        identity: ["okta"],
        productivity: ["notion"],
        customApps: "11+",
      },
      step3: {
        ...EMPTY_ANSWERS.step3,
        dataLocation: "spreadsheets",
        documented: "no",
      },
      step4: {
        ...EMPTY_ANSWERS.step4,
        privacy: ["hipaa", "pci", "soc2"],
        talent: "none",
      },
    });
    const r = computeSizing(a);
    expect(r.size).toBe("XL");
    expect(r.weeksMax).toBeNull();
  });
});
