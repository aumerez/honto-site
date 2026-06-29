"use client";

import QuestionCard from "./QuestionCard";
import { questionsForSection, type AnswerValue } from "./questions";

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
  return (
    <div className="om-questions">
      {questionsForSection("EXPERT_LEVERAGE").map((q) => (
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
