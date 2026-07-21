"use client";

import QuestionCard from "./QuestionCard";
import { type AnswerValue } from "./questions";
import { useLocalizedQuestions } from "./useLocalizedQuestions";

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
  const { forSection } = useLocalizedQuestions();
  return (
    <div className="om-questions">
      {forSection("PROCESS_DRAG").map((q) => (
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
