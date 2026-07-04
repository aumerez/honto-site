import { describe, it, expect, beforeEach } from "vitest";
import { EMPTY_SUBMISSION } from "../schema";
import {
  STORAGE_KEY,
  clearFlow,
  loadFlow,
  mergeAnswers,
  saveFlow,
} from "../storage";

describe("OpportunityMap storage (migration-safe)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("round-trips a saved session", () => {
    const answers = {
      ...EMPTY_SUBMISSION,
      company: { ...EMPTY_SUBMISSION.company, companyName: "Acme" },
    };
    saveFlow("PROCESS_DRAG", answers);
    const loaded = loadFlow();
    expect(loaded?.state).toBe("PROCESS_DRAG");
    expect(loaded?.answers.company.companyName).toBe("Acme");
    expect(loaded?.version).toBe(1);
  });

  it("returns null when nothing is stored", () => {
    expect(loadFlow()).toBeNull();
  });

  it("survives malformed JSON", () => {
    window.localStorage.setItem(STORAGE_KEY, "not-json{");
    expect(loadFlow()).toBeNull();
  });

  it("ignores an older/absent schema version", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 0, state: "PROCESS_DRAG", answers: {} })
    );
    expect(loadFlow()).toBeNull();
  });

  it("repairs a partial session with defaults and a valid fallback state", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        state: "NOT_A_STATE",
        answers: { company: { companyName: "Acme" } },
      })
    );
    const loaded = loadFlow();
    expect(loaded?.state).toBe("LANDING");
    expect(loaded?.answers.company.companyName).toBe("Acme");
    expect(loaded?.answers.business.priorityOutcomes).toEqual([]);
    expect(loaded?.answers.techStack).toBeNull();
  });

  it("drops unknown / banned fields when merging", () => {
    const merged = mergeAnswers({
      company: { companyName: "Acme", password: "hunter2", apiKey: "sk-123" },
      secretRepo: "git@github.com:acme/private.git",
    } as unknown);
    expect(merged.company.companyName).toBe("Acme");
    expect(JSON.stringify(merged)).not.toContain("hunter2");
    expect(JSON.stringify(merged)).not.toContain("sk-123");
    expect(JSON.stringify(merged)).not.toContain("secretRepo");
  });

  it("never persists unknown fields even if passed through save", () => {
    saveFlow("BUSINESS_CONTEXT", {
      ...EMPTY_SUBMISSION,
      // @ts-expect-error — simulating a polluted object at runtime
      contact: { ...EMPTY_SUBMISSION.contact, password: "leak" },
    });
    const raw = window.localStorage.getItem(STORAGE_KEY) ?? "";
    expect(raw).not.toContain("password");
    expect(raw).not.toContain("leak");
  });

  it("loads an older-shaped saved session without crashing", () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        state: "PROCESS_DRAG",
        answers: {
          company: { companyName: "Acme", legacyField: 1 },
          step1: { foo: "bar" },
          process: { manualWorkLevel: "3" },
        },
      })
    );
    const loaded = loadFlow();
    expect(loaded).not.toBeNull();
    expect(loaded?.state).toBe("PROCESS_DRAG");
    expect(loaded?.answers.company.companyName).toBe("Acme");
    expect(loaded?.answers.process.manualWorkLevel).toBe("3");
    const serialized = JSON.stringify(loaded);
    expect(serialized).not.toContain("legacyField");
    expect(serialized).not.toContain("step1");
  });

  it("clears a stored session", () => {
    saveFlow("LANDING", EMPTY_SUBMISSION);
    clearFlow();
    expect(loadFlow()).toBeNull();
  });
});
