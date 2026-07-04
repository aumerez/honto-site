import { describe, it, expect } from "vitest";
import enDict from "@/locales/en.json";
import esDict from "@/locales/es.json";
import ptDict from "@/locales/pt.json";

type Dict = { opportunityMap: Record<string, unknown> };

const dicts: Record<string, Dict> = {
  en: enDict as unknown as Dict,
  es: esDict as unknown as Dict,
  pt: ptDict as unknown as Dict,
};
const LOCALES = ["en", "es", "pt"] as const;

const BANNED_PHRASES = [
  "magic",
  "supercharge",
  "fun quiz",
  "unlock your potential",
  "ai wizard",
  "revolutionize everything",
  "just connect everything",
];

const BANNED_DATA_TERMS = [
  "password",
  "api key",
  "private document",
  "private chat",
  "private repo",
  "employee linkedin",
];

describe("Opportunity Map i18n", () => {
  it("defines opportunityMap copy in every supported locale", () => {
    for (const l of LOCALES) {
      expect(dicts[l].opportunityMap).toBeTruthy();
    }
  });

  it("keeps the same top-level keys across locales", () => {
    const keys = (l: string) => Object.keys(dicts[l].opportunityMap).sort();
    expect(keys("es")).toEqual(keys("en"));
    expect(keys("pt")).toEqual(keys("en"));
  });

  it("exposes the required page keys", () => {
    for (const l of LOCALES) {
      const om = dicts[l].opportunityMap as {
        cta: string;
        report: { cards: { review: string } };
        signalBands: { strong: string };
        privacy: { line1: string };
      };
      expect(om.cta).toBeTruthy();
      expect(om.report.cards.review).toBeTruthy();
      expect(om.signalBands.strong).toBeTruthy();
      expect(om.privacy.line1).toBeTruthy();
    }
  });

  it("contains no banned marketing phrases", () => {
    for (const l of LOCALES) {
      const text = JSON.stringify(dicts[l].opportunityMap).toLowerCase();
      for (const phrase of BANNED_PHRASES) {
        expect(text).not.toContain(phrase);
      }
    }
  });

  it("never asks for banned/private data in public copy", () => {
    // The privacy notices intentionally name these items in the negative
    // ("we do not ask for…"), so they are excluded from the asking-copy scan.
    for (const l of LOCALES) {
      const om = { ...dicts[l].opportunityMap } as Record<string, unknown> & {
        privacy?: unknown;
        meta?: { privacy?: string };
      };
      delete om.privacy;
      if (om.meta) om.meta = { ...om.meta, privacy: "" };
      const asking = JSON.stringify(om).toLowerCase();
      for (const term of BANNED_DATA_TERMS) {
        expect(asking).not.toContain(term);
      }
    }
  });
});
