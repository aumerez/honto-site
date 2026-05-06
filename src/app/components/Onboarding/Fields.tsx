"use client";

import type { ChangeEvent } from "react";

type TextFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "email" | "tel";
  pattern?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  maxLength?: number;
  autoComplete?: string;
  error?: string;
};

export function TextField({
  label,
  name,
  value,
  onChange,
  required,
  type = "text",
  pattern,
  inputMode,
  maxLength,
  autoComplete,
  error,
}: TextFieldProps) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <label className="ob-field">
      <span className="ob-field-label">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        pattern={pattern}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "ob-input-error" : undefined}
      />
      {error ? (
        <span id={errorId} className="ob-field-error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

type ComboboxFieldProps = {
  label: string;
  name: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  placeholder?: string;
};

export function ComboboxField({
  label,
  name,
  value,
  options,
  onChange,
  required,
  maxLength,
  autoComplete,
  placeholder,
}: ComboboxFieldProps) {
  const listId = `${name}-list`;
  return (
    <label className="ob-field">
      <span className="ob-field-label">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      <input
        name={name}
        type="text"
        value={value}
        required={required}
        list={listId}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="ob-combobox"
      />
      <datalist id={listId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </label>
  );
}

type TextAreaFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  maxLength?: number;
  rows?: number;
};

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  required,
  maxLength,
  rows = 3,
}: TextAreaFieldProps) {
  return (
    <label className="ob-field">
      <span className="ob-field-label">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      <textarea
        name={name}
        value={value}
        required={required}
        maxLength={maxLength}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export type Option = { value: string; label: string };

type RadioGroupProps = {
  legend: string;
  name: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  required?: boolean;
};

export function RadioGroup({
  legend,
  name,
  value,
  options,
  onChange,
  required,
}: RadioGroupProps) {
  return (
    <fieldset className="ob-fieldset">
      <legend className="ob-field-label">
        {legend}
        {required ? <span aria-hidden="true"> *</span> : null}
      </legend>
      <div className="ob-radio-group">
        {options.map((opt) => (
          <label key={opt.value} className="ob-radio">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
              }
              required={required && !value}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type CheckboxGroupProps = {
  legend: string;
  name: string;
  values: string[];
  options: readonly Option[];
  onChange: (values: string[]) => void;
};

export function CheckboxGroup({
  legend,
  name,
  values,
  options,
  onChange,
}: CheckboxGroupProps) {
  function toggle(value: string, checked: boolean) {
    if (checked) {
      onChange(Array.from(new Set([...values, value])));
    } else {
      onChange(values.filter((v) => v !== value));
    }
  }
  return (
    <fieldset className="ob-fieldset">
      <legend className="ob-field-label">{legend}</legend>
      <div className="ob-check-group">
        {options.map((opt) => (
          <label key={opt.value} className="ob-check">
            <input
              type="checkbox"
              name={name}
              value={opt.value}
              checked={values.includes(opt.value)}
              onChange={(e) => toggle(opt.value, e.target.checked)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  options: readonly Option[];
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
};

export function SelectField({
  label,
  name,
  value,
  options,
  onChange,
  required,
  placeholder,
  error,
}: SelectFieldProps) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <label className="ob-field">
      <span className="ob-field-label">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      <select
        name={name}
        value={value}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        onChange={(e) => onChange(e.target.value)}
        className={error ? "ob-input-error" : undefined}
      >
        <option value="" disabled>
          {placeholder ?? "—"}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <span id={errorId} className="ob-field-error" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}
