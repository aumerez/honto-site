"use client";

import QuestionCard from "./QuestionCard";
import { questionsForSection, type AnswerValue } from "./questions";

/** Renders the business context or business goals questions as cards. */
export default function BusinessSection({
  section,
  values,
  errors,
  onChange,
}: {
  section: "BUSINESS_CONTEXT" | "BUSINESS_GOALS";
  values: Record<string, AnswerValue>;
  errors: Record<string, string>;
  onChange: (id: string, value: AnswerValue) => void;
}) {
  return (
    <div className="om-questions">
      {questionsForSection(section).map((q) => (
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
