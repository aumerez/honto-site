"use client";

import QuestionCard from "./QuestionCard";
import { questionsForSection, type AnswerValue } from "./questions";
import { FIELD_LIMITS, TECH_CATEGORIES, type Question } from "./schema";

const OTHER_SYSTEMS_QUESTION: Question = {
  id: "otherSystems",
  section: "SYSTEM_LANDSCAPE",
  type: "textarea",
  label: "Other systems",
  helper:
    "Optional — name any systems you marked as “Other” (up to 250 characters).",
  required: false,
  maxLength: FIELD_LIMITS.otherSystems,
};

/**
 * Optional technical inventory. The note makes clear this is directional and
 * does not connect to any systems; the skip control lives in the flow chrome.
 * A free-text field appears when the user marks any category as "Other".
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
  const hasOther = TECH_CATEGORIES.some((cat) => {
    const v = values[cat];
    return Array.isArray(v) && v.includes("other");
  });

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
        {hasOther ? (
          <QuestionCard
            question={OTHER_SYSTEMS_QUESTION}
            value={values.otherSystems}
            onChange={(v) => onChange("otherSystems", v)}
          />
        ) : null}
      </div>
    </div>
  );
}
