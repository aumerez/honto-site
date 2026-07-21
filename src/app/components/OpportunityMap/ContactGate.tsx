"use client";

import QuestionCard from "./QuestionCard";
import { type AnswerValue } from "./questions";
import { useLocalizedQuestions } from "./useLocalizedQuestions";

/**
 * Contact capture. The report stays gated until these validate (enforced by the
 * flow controller). Privacy microcopy sits directly above submission.
 */
export default function ContactGate({
  values,
  errors,
  onChange,
  privacy,
}: {
  values: Record<string, AnswerValue>;
  errors: Record<string, string>;
  onChange: (id: string, value: AnswerValue) => void;
  privacy: string[];
}) {
  const { forSection } = useLocalizedQuestions();
  return (
    <div>
      <div className="om-questions">
        {forSection("CONTACT_GATE").map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            value={values[q.id]}
            error={errors[q.id]}
            onChange={(v) => onChange(q.id, v)}
          />
        ))}
      </div>
      <ul className="om-privacy">
        {privacy.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  );
}
