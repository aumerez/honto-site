import { describe, it, expect } from "vitest";
import {
  QUESTIONS,
  localizeQuestion,
  type OmQuestionsCopy,
} from "../questions";
import esDict from "@/locales/es.json";
import ptDict from "@/locales/pt.json";

const esCopy = (esDict.opportunityMap as { questions?: OmQuestionsCopy })
  .questions;
const ptCopy = (ptDict.opportunityMap as { questions?: OmQuestionsCopy })
  .questions;

const questionIds = new Set(QUESTIONS.map((q) => q.id));
const optionValues = new Map<string, Set<string>>(
  QUESTIONS.filter((q) => q.options).map((q) => [
    q.id,
    new Set((q.options ?? []).map((o) => o.value)),
  ])
);

describe.each([
  ["es", esCopy],
  ["pt", ptCopy],
])("%s question translations", (_locale, copy) => {
  it("is present in the locale dictionary", () => {
    expect(copy).toBeTruthy();
  });

  it("only references real question ids in labels and helpers", () => {
    for (const id of Object.keys(copy?.labels ?? {}))
      expect(questionIds.has(id)).toBe(true);
    for (const id of Object.keys(copy?.helpers ?? {}))
      expect(questionIds.has(id)).toBe(true);
  });

  it("only references real option values (no orphan keys that silently fall back)", () => {
    for (const [qid, map] of Object.entries(copy?.options ?? {})) {
      expect(optionValues.has(qid)).toBe(true);
      const values = optionValues.get(qid)!;
      for (const value of Object.keys(map))
        expect(values.has(value)).toBe(true);
    }
  });

  it("translates labels and options away from the English source", () => {
    const industry = QUESTIONS.find((q) => q.id === "industry")!;
    const localized = localizeQuestion(industry, copy);
    expect(localized.label).not.toBe(industry.label);
    const fintech = localized.options?.find((o) => o.value === "fintech");
    const enFintech = industry.options?.find((o) => o.value === "fintech");
    expect(fintech?.label).not.toBe(enFintech?.label);
  });

  it("leaves untranslated brand options as the English fallback", () => {
    const crm = QUESTIONS.find((q) => q.id === "crm")!;
    const localized = localizeQuestion(crm, copy);
    // Brand names are intentionally not translated.
    expect(
      localized.options?.find((o) => o.value === "salesforce")?.label
    ).toBe("Salesforce");
    // But "other" is translated.
    expect(localized.options?.find((o) => o.value === "other")?.label).not.toBe(
      "Other"
    );
  });
});

describe("localizeQuestion fallback", () => {
  it("returns the English question untouched when no copy is provided", () => {
    const q = QUESTIONS[0];
    expect(localizeQuestion(q, undefined)).toBe(q);
  });
});
