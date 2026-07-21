"use client";

import { Fragment } from "react";
import QuestionCard from "./QuestionCard";
import { type AnswerValue, type OmQuestionsCopy } from "./questions";
import { useLocalizedQuestions } from "./useLocalizedQuestions";
import {
  FIELD_LIMITS,
  TECH_CATEGORIES,
  otherKeyFor,
  type Question,
  type TechCategory,
} from "./schema";

const TECH_CATEGORY_SET = new Set<string>(TECH_CATEGORIES);

function otherQuestionFor(
  category: TechCategory,
  label: string,
  copy: OmQuestionsCopy | undefined
): Question {
  const template = copy?.techOtherLabel ?? "Other — {label}";
  return {
    id: otherKeyFor(category),
    section: "SYSTEM_LANDSCAPE",
    type: "text",
    label: template.replace("{label}", label),
    helper: copy?.techOtherHelper ?? "Optional — up to 250 characters.",
    required: false,
    maxLength: FIELD_LIMITS.otherText,
  };
}

/**
 * Optional technical inventory. The note makes clear this is directional and
 * does not connect to any systems; the skip control lives in the flow chrome.
 * When a category's "Other" option is chosen, a free-text field appears right
 * under that category so the user can name the system.
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
  const { forSection, copy } = useLocalizedQuestions();
  return (
    <div>
      <p className="om-tech-note">{note}</p>
      <div className="om-questions">
        {forSection("SYSTEM_LANDSCAPE").map((q) => {
          const selected =
            TECH_CATEGORY_SET.has(q.id) &&
            Array.isArray(values[q.id]) &&
            (values[q.id] as string[]).includes("other");
          const other = selected
            ? otherQuestionFor(q.id as TechCategory, q.label, copy)
            : null;
          return (
            <Fragment key={q.id}>
              <QuestionCard
                question={q}
                value={values[q.id]}
                error={errors[q.id]}
                onChange={(v) => onChange(q.id, v)}
              />
              {other ? (
                <QuestionCard
                  question={other}
                  value={values[other.id]}
                  onChange={(v) => onChange(other.id, v)}
                />
              ) : null}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
