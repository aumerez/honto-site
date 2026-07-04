"use client";

import {
  CheckboxGroup,
  RadioGroup,
  SelectField,
  TextAreaField,
  TextField,
  type Option,
} from "../Onboarding/Fields";
import type { Question } from "./schema";
import type { AnswerValue } from "./questions";

/**
 * Renders a single diagnostic question inside a technical card, delegating to
 * the shared form primitives. Supports every field type in the schema:
 * text, textarea, single select, multi select, scale, checkbox, URL, email.
 */
export default function QuestionCard({
  question,
  value,
  error,
  onChange,
}: {
  question: Question;
  value: AnswerValue | undefined;
  error?: string;
  onChange: (value: AnswerValue) => void;
}) {
  const options = (question.options ?? []) as Option[];
  const asText = typeof value === "string" ? value : "";
  const asList = Array.isArray(value) ? value : [];

  // text / email / url and select carry their own inline error + styling.
  const inlineError =
    question.type === "text" ||
    question.type === "email" ||
    question.type === "url" ||
    question.type === "select";

  return (
    <div className="om-qcard">
      {renderField()}
      {question.helper ? <p className="om-qhelper">{question.helper}</p> : null}
      {error && !inlineError ? (
        <span className="ob-field-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );

  function renderField() {
    switch (question.type) {
      case "text":
      case "email":
      case "url":
        return (
          <TextField
            label={question.label}
            name={question.id}
            type={question.type === "email" ? "email" : "text"}
            inputMode={question.type === "email" ? "email" : "text"}
            value={asText}
            onChange={onChange}
            required={question.required}
            maxLength={question.maxLength}
            error={error}
          />
        );
      case "textarea":
        return (
          <TextAreaField
            label={question.label}
            name={question.id}
            value={asText}
            onChange={onChange}
            required={question.required}
            maxLength={question.maxLength}
            rows={3}
          />
        );
      case "select":
        return (
          <SelectField
            label={question.label}
            name={question.id}
            value={asText}
            options={options}
            onChange={onChange}
            required={question.required}
            error={error}
          />
        );
      case "multiselect":
        return (
          <CheckboxGroup
            legend={question.label}
            name={question.id}
            values={asList}
            options={options}
            onChange={(vals) => onChange(vals)}
          />
        );
      case "scale":
        return (
          <RadioGroup
            legend={question.label}
            name={question.id}
            value={asText}
            options={options}
            onChange={onChange}
            required={question.required}
          />
        );
      case "checkbox":
        return (
          <label className="ob-check om-qcheck">
            <input
              type="checkbox"
              name={question.id}
              checked={value === true}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span>{question.label}</span>
          </label>
        );
      default:
        return null;
    }
  }
}
