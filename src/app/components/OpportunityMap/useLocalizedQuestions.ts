"use client";

import { useLocale } from "@/context/LocaleContext";
import type { Question, QuestionSection } from "./schema";
import {
  localizeQuestion,
  localizeQuestions,
  questionsForSection,
  type OmQuestionsCopy,
} from "./questions";

/**
 * Reads the active locale's `opportunityMap.questions` overrides and returns
 * helpers that render the diagnostic questions in that language, falling back
 * to the English source copy for any untranslated key.
 */
export function useLocalizedQuestions() {
  const { t } = useLocale();
  const copy = (t.opportunityMap as { questions?: OmQuestionsCopy } | undefined)
    ?.questions;
  return {
    copy,
    forSection: (section: QuestionSection): Question[] =>
      localizeQuestions(questionsForSection(section), copy),
    localize: (q: Question): Question => localizeQuestion(q, copy),
  };
}
