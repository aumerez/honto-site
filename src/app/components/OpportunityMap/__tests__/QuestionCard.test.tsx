import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionCard from "../QuestionCard";
import type { Question } from "../schema";
import type { AnswerValue } from "../questions";

function q(partial: Partial<Question>): Question {
  return {
    id: "field",
    section: "BUSINESS_CONTEXT",
    type: "text",
    label: "Label",
    required: false,
    ...partial,
  } as Question;
}

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

function renderCard(question: Question, value: AnswerValue | undefined) {
  const onChange = vi.fn();
  render(
    <QuestionCard question={question} value={value} onChange={onChange} />
  );
  return onChange;
}

describe("QuestionCard", () => {
  it("renders and edits a text field", () => {
    const onChange = renderCard(q({ type: "text", label: "Name" }), "");
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Acme" },
    });
    expect(onChange).toHaveBeenCalledWith("Acme");
  });

  it("renders and edits a textarea", () => {
    const onChange = renderCard(q({ type: "textarea", label: "Notes" }), "");
    fireEvent.change(screen.getByLabelText("Notes"), {
      target: { value: "hello" },
    });
    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("renders and edits an email field", () => {
    const onChange = renderCard(q({ type: "email", label: "Email" }), "");
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "a@b.com" },
    });
    expect(onChange).toHaveBeenCalledWith("a@b.com");
  });

  it("renders and edits a URL field", () => {
    const onChange = renderCard(q({ type: "url", label: "Website" }), "");
    fireEvent.change(screen.getByLabelText("Website"), {
      target: { value: "https://acme.com" },
    });
    expect(onChange).toHaveBeenCalledWith("https://acme.com");
  });

  it("renders and selects from a single select", () => {
    const onChange = renderCard(
      q({ type: "select", label: "Pick", options: OPTIONS }),
      ""
    );
    fireEvent.change(screen.getByLabelText("Pick"), { target: { value: "b" } });
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("renders and toggles a multi select", () => {
    const onChange = renderCard(
      q({ type: "multiselect", label: "Many", options: OPTIONS }),
      []
    );
    fireEvent.click(screen.getByLabelText("Alpha"));
    expect(onChange).toHaveBeenCalledWith(["a"]);
  });

  it("renders and picks a scale value", () => {
    const onChange = renderCard(
      q({
        type: "scale",
        label: "Rate",
        options: [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
        ],
      }),
      ""
    );
    fireEvent.click(screen.getByLabelText("3"));
    expect(onChange).toHaveBeenCalledWith("3");
  });

  it("renders and toggles a checkbox", () => {
    const onChange = renderCard(
      q({ type: "checkbox", label: "I agree" }),
      false
    );
    fireEvent.click(screen.getByLabelText("I agree"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("renders helper text and a validation error", () => {
    render(
      <QuestionCard
        question={q({
          type: "multiselect",
          label: "Many",
          options: OPTIONS,
          helper: "Choose some",
        })}
        value={[]}
        error="This field is required."
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText("Choose some")).toBeTruthy();
    expect(screen.getByText("This field is required.")).toBeTruthy();
  });
});
