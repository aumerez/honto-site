import { describe, it, expect } from "vitest";
import {
  FIELD_TYPES,
  QUESTION_SECTIONS,
  isSkippableSection,
  type FieldType,
} from "../schema";
import {
  QUESTIONS,
  findMissingRequired,
  questionsForSection,
  type AnswerValue,
} from "../questions";

const OPTION_TYPES: FieldType[] = ["select", "multiselect", "scale"];

describe("OpportunityMap questions", () => {
  it("every question has id, section, label, and a valid type", () => {
    for (const q of QUESTIONS) {
      expect(q.id).toBeTruthy();
      expect(q.label).toBeTruthy();
      expect(QUESTION_SECTIONS).toContain(q.section);
      expect(FIELD_TYPES).toContain(q.type);
    }
  });

  it("has globally unique question ids", () => {
    const ids = QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("option-based questions have non-empty options", () => {
    for (const q of QUESTIONS) {
      if (OPTION_TYPES.includes(q.type)) {
        expect(q.options && q.options.length > 0).toBe(true);
        for (const opt of q.options ?? []) {
          expect(opt.value).toBeTruthy();
          expect(opt.label).toBeTruthy();
        }
      }
    }
  });

  it("every question section has at least one question", () => {
    for (const section of QUESTION_SECTIONS) {
      expect(questionsForSection(section).length).toBeGreaterThan(0);
    }
  });

  it("declares the expected required fields per section", () => {
    const requiredIds = (section: (typeof QUESTION_SECTIONS)[number]) =>
      questionsForSection(section)
        .filter((q) => q.required)
        .map((q) => q.id)
        .sort();

    expect(requiredIds("BUSINESS_CONTEXT")).toEqual(
      ["companyName", "companySize", "industry", "mainPressure", "stage"].sort()
    );
    expect(requiredIds("BUSINESS_GOALS")).toEqual(
      ["priorityOutcomes", "timeframe", "urgentArea"].sort()
    );
    expect(requiredIds("PROCESS_DRAG")).toEqual(["manualWorkLevel"]);
    expect(requiredIds("EXPERT_LEVERAGE")).toEqual(["overloadedFunctions"]);
    expect(requiredIds("CONTACT_GATE")).toEqual(
      ["consent", "contactName", "email", "role"].sort()
    );
  });

  it("keeps the tech stack section optional and skippable", () => {
    expect(isSkippableSection("SYSTEM_LANDSCAPE")).toBe(true);
    const required = questionsForSection("SYSTEM_LANDSCAPE").filter(
      (q) => q.required
    );
    expect(required).toHaveLength(0);
  });

  describe("findMissingRequired", () => {
    it("flags every required field when answers are empty", () => {
      const missing = findMissingRequired("BUSINESS_CONTEXT", {});
      expect(missing.sort()).toEqual(
        [
          "companyName",
          "companySize",
          "industry",
          "mainPressure",
          "stage",
        ].sort()
      );
    });

    it("returns nothing for the skippable tech section even when empty", () => {
      expect(findMissingRequired("SYSTEM_LANDSCAPE", {})).toEqual([]);
    });

    it("passes once required fields are filled", () => {
      const values: Record<string, AnswerValue> = {
        priorityOutcomes: ["growth"],
        urgentArea: "sales",
        timeframe: "asap",
      };
      expect(findMissingRequired("BUSINESS_GOALS", values)).toEqual([]);
    });

    it("treats an unchecked required checkbox as missing", () => {
      const values: Record<string, AnswerValue> = {
        contactName: "Dana",
        email: "dana@acme.com",
        role: "founderExec",
        company: "Acme",
        consent: false,
      };
      expect(findMissingRequired("CONTACT_GATE", values)).toEqual(["consent"]);
    });
  });
});
