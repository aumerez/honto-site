"use client";

import QuestionCard from "./QuestionCard";
import { questionsForSection, type AnswerValue } from "./questions";

/**
 * Optional technical inventory. The note makes clear this is directional and
 * does not connect to any systems; the skip control lives in the flow chrome.
 */
export default function TechStackSection({
  values,
  errors,
  onChange,
  note,
}: {
  values: Record<string, AnswerValue>;
  errors: Record<string, string>;
  onChange: (id: string, value: AnswerValue) => void;
  note: string;
}) {
  return (
    <div>
      <p className="om-tech-note">{note}</p>
      <div className="om-questions">
        {questionsForSection("SYSTEM_LANDSCAPE").map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            value={values[q.id]}
            error={errors[q.id]}
            onChange={(v) => onChange(q.id, v)}
          />
        ))}
      </div>
    </div>
  );
}
