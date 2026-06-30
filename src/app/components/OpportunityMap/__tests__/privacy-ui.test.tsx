import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithLocale } from "../../__tests__/testHelpers";
import DiscoveryFlow from "../DiscoveryFlow";
import { STORAGE_KEY } from "../storage";
import { auditQuestions } from "../privacy";
import { QUESTIONS } from "../questions";

const BANNED_UI_TERMS = [
  "password",
  "api key",
  "private document",
  "private chat",
  "private repo",
  "employee linkedin",
];

function seed(state: string, answers: Record<string, unknown> = {}) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: 1, state, answers })
  );
}

describe("AI Readiness Map — privacy (no banned data requested)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("no diagnostic question requests banned/private data", () => {
    expect(auditQuestions(QUESTIONS)).toEqual([]);
    const askingCopy = QUESTIONS.map(
      (q) =>
        `${q.label} ${q.helper ?? ""} ${(q.options ?? [])
          .map((o) => o.label)
          .join(" ")}`
    )
      .join(" ")
      .toLowerCase();
    for (const term of BANNED_UI_TERMS) {
      expect(askingCopy).not.toContain(term);
    }
  });

  it("the contact step asks for no banned data in any field label", () => {
    seed("CONTACT_GATE", {
      company: { companyName: "Acme" },
      contact: { company: "Acme" },
    });
    const { container } = renderWithLocale(<DiscoveryFlow />);
    fireEvent.click(screen.getByRole("button", { name: /resume diagnostic/i }));

    const labels = Array.from(container.querySelectorAll("label"))
      .map((l) => (l.textContent ?? "").toLowerCase())
      .join(" | ");
    for (const term of BANNED_UI_TERMS) {
      expect(labels).not.toContain(term);
    }
  });

  it("shows the privacy reassurance before contact submission", () => {
    seed("CONTACT_GATE", {
      company: { companyName: "Acme" },
      contact: { company: "Acme" },
    });
    renderWithLocale(<DiscoveryFlow />);
    fireEvent.click(screen.getByRole("button", { name: /resume diagnostic/i }));
    expect(screen.getByText(/do not ask for passwords/i)).toBeTruthy();
  });
});
