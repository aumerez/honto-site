/**
 * Honto AI Readiness Map — banned-data guard.
 *
 * The diagnostic must never request sensitive or private data. These helpers
 * scan public copy / question text for banned request patterns and are used by
 * tests (and may be used by future copy-audit tooling) to keep the flow safe.
 */

import type { Question } from "./schema";

export type BannedPattern = { key: string; pattern: RegExp };

/**
 * Patterns target the *banned phrasings*, not legitimate adjacent terms — e.g.
 * "API availability" and "company LinkedIn page" must NOT match, while
 * "API key" and "employee LinkedIn" must.
 */
export const BANNED_PATTERNS: BannedPattern[] = [
  { key: "password", pattern: /\bpasswords?\b/i },
  { key: "apiKey", pattern: /\bapi\s*-?\s*keys?\b/i },
  { key: "credentials", pattern: /\bcredentials?\b/i },
  { key: "privateDocument", pattern: /\bprivate\s+document/i },
  { key: "privateChat", pattern: /\bprivate\s+chat/i },
  { key: "privateRepo", pattern: /\bprivate\s+(repo|repositor)/i },
  { key: "employeeLinkedin", pattern: /\bemployee[^.]*linkedin/i },
  { key: "employeeProfile", pattern: /\bemployee[^.]*profile/i },
  { key: "personalProfile", pattern: /\bpersonal\s+(linkedin|profile)/i },
  { key: "ssn", pattern: /\b(ssn|social\s+security)\b/i },
];

/** Returns the keys of every banned pattern found in `text`. */
export function scanText(text: string): string[] {
  return BANNED_PATTERNS.filter((p) => p.pattern.test(text)).map((p) => p.key);
}

export type QuestionViolation = { id: string; matched: string[] };

/** Scans question labels, helper text, and option labels for banned requests. */
export function auditQuestions(questions: Question[]): QuestionViolation[] {
  const violations: QuestionViolation[] = [];
  for (const q of questions) {
    const text = [
      q.label,
      q.helper ?? "",
      ...(q.options?.map((o) => o.label) ?? []),
    ].join("\n");
    const matched = scanText(text);
    if (matched.length > 0) violations.push({ id: q.id, matched });
  }
  return violations;
}
