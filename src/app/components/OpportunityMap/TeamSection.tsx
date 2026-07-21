"use client";

import QuestionCard from "./QuestionCard";
import { type AnswerValue } from "./questions";
import { useLocalizedQuestions } from "./useLocalizedQuestions";

/** Team load, knowledge concentration, decision and handoff questions. */
export default function TeamSection({
  values,
  errors,
  onChange,
}: {
  values: Record<string, AnswerValue>;
  errors: Record<string, string>;
  onChange: (id: string, value: AnswerValue) => void;
}) {
  const { forSection } = useLocalizedQuestions();
  return (
    <div className="om-questions">
      {forSection("EXPERT_LEVERAGE").map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          value={values[q.id]}
          error={errors[q.id]}
          onChange={(v) => onChange(q.id, v)}
        />
      ))}
    </div>
  );
}
