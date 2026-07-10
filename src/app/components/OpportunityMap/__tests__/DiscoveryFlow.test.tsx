import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithLocale } from "../../__tests__/testHelpers";
import DiscoveryFlow from "../DiscoveryFlow";
import { STORAGE_KEY } from "../storage";
import type { FlowState } from "../state";

function seed(state: FlowState, answers: Record<string, unknown> = {}) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: 1, state, answers })
  );
}

function clickButton(name: RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
}

function stageHeading(name: string) {
  return screen.getByRole("heading", { level: 2, name });
}

function setField(name: string, value: string) {
  const el = document.querySelector(`[name="${name}"]`);
  if (!el) throw new Error(`field not found: ${name}`);
  fireEvent.change(el, { target: { value } });
}

function checkField(name: string) {
  const el = document.querySelector(`input[name="${name}"]`);
  if (!el) throw new Error(`checkbox not found: ${name}`);
  fireEvent.click(el);
}

function fillBusinessContext() {
  setField("companyName", "Acme");
  setField("industry", "tech");
  setField("companySize", "51-200");
  setField("stage", "scaling");
  setField("mainPressure", "growth");
}

describe("DiscoveryFlow", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts the map from the hero CTA", () => {
    renderWithLocale(<DiscoveryFlow />);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    clickButton(/start the map/i);
    expect(stageHeading("Business context")).toBeTruthy();
  });

  it("blocks advancing until required fields are answered", () => {
    renderWithLocale(<DiscoveryFlow />);
    clickButton(/start the map/i);
    clickButton(/continue/i);
    expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    expect(stageHeading("Business context")).toBeTruthy(); // did not advance
  });

  it("advances once required fields are filled", () => {
    renderWithLocale(<DiscoveryFlow />);
    clickButton(/start the map/i);
    fillBusinessContext();
    clickButton(/continue/i);
    expect(stageHeading("Business goals")).toBeTruthy();
  });

  it("shows the directional teaser before the contact gate", () => {
    seed("TEASER_RESULT");
    renderWithLocale(<DiscoveryFlow />);
    clickButton(/resume diagnostic/i);
    expect(stageHeading("Your directional signal")).toBeTruthy();
    expect(screen.getByText(/directional opportunity/i)).toBeTruthy();
    // The full report is not revealed here.
    expect(
      screen.queryByRole("heading", { level: 2, name: "Your AI readiness map" })
    ).toBeNull();
  });

  it("lets the user skip the technical inventory", () => {
    seed("SYSTEM_LANDSCAPE");
    renderWithLocale(<DiscoveryFlow />);
    clickButton(/resume diagnostic/i);
    expect(stageHeading("System landscape")).toBeTruthy();
    clickButton(/skip this section/i);
    expect(stageHeading("Unlock your readiness map")).toBeTruthy();
  });

  it("reveals the other-systems box when an Other option is chosen", () => {
    seed("SYSTEM_LANDSCAPE");
    renderWithLocale(<DiscoveryFlow />);
    clickButton(/resume diagnostic/i);
    expect(stageHeading("System landscape")).toBeTruthy();
    expect(screen.queryByText("Other — CRM")).toBeNull();

    const crmOther = document.querySelector('input[name="crm"][value="other"]');
    expect(crmOther).not.toBeNull();
    fireEvent.click(crmOther as Element);
    expect(screen.getByText("Other — CRM")).toBeTruthy();
  });

  it("gates the report until contact fields validate", () => {
    // Company name carries over from business context — never re-asked here.
    seed("CONTACT_GATE", {
      company: { companyName: "Acme" },
      contact: { company: "Acme" },
    });
    renderWithLocale(<DiscoveryFlow />);
    clickButton(/resume diagnostic/i);
    expect(stageHeading("Unlock your readiness map")).toBeTruthy();
    // The contact step does not ask for the company name again.
    expect(document.querySelector('[name="company"]')).toBeNull();

    // Empty submit is blocked.
    clickButton(/see my readiness map/i);
    expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("heading", { level: 2, name: "Your AI readiness map" })
    ).toBeNull();

    // Valid contact unlocks the report.
    setField("contactName", "Dana");
    setField("email", "dana@acme.com");
    setField("role", "founderExec");
    checkField("consent");
    clickButton(/see my readiness map/i);
    expect(stageHeading("Your AI readiness map")).toBeTruthy();
  });

  it("resumes a saved session from the landing screen", () => {
    seed("BUSINESS_GOALS");
    renderWithLocale(<DiscoveryFlow />);
    expect(
      screen.getByRole("button", { name: /resume diagnostic/i })
    ).toBeTruthy();
    clickButton(/resume diagnostic/i);
    expect(stageHeading("Business goals")).toBeTruthy();
  });

  it("starts over from the landing screen", () => {
    seed("BUSINESS_GOALS");
    renderWithLocale(<DiscoveryFlow />);
    clickButton(/start over/i);
    expect(screen.getByRole("button", { name: /start the map/i })).toBeTruthy();
  });
});
