"use client";

import QuestionCard from "./QuestionCard";
import { questionsForSection, type AnswerValue } from "./questions";

/** Manual work, friction, bottleneck, and repetitive-workflow questions. */
export default function ProcessSection({
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
      {questionsForSection("PROCESS_DRAG").map((q) => (
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
