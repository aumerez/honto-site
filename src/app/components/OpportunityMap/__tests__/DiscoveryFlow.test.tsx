import { describe, it, expect, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithLocale } from "../../__tests__/testHelpers";
import DiscoveryFlow from "../DiscoveryFlow";

function clickButton(name: RegExp) {
  fireEvent.click(screen.getByRole("button", { name }));
}

// Stage titles render as <h2>; board nodes reuse the same label text, so we
// query the heading to disambiguate.
function stageHeading(name: string) {
  return screen.getByRole("heading", { level: 2, name });
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

  it("advances section by section", () => {
    renderWithLocale(<DiscoveryFlow />);
    clickButton(/start the map/i);
    clickButton(/continue/i); // → Business goals
    expect(stageHeading("Business goals")).toBeTruthy();
    clickButton(/back/i); // ← Business context
    expect(stageHeading("Business context")).toBeTruthy();
  });

  it("can skip the tech stack and reach the contact gate", () => {
    renderWithLocale(<DiscoveryFlow />);
    clickButton(/start the map/i);
    // BC → BG → PD → EL → TEASER → SYSTEM_LANDSCAPE
    for (let i = 0; i < 5; i++) clickButton(/continue/i);
    expect(stageHeading("System landscape")).toBeTruthy();
    clickButton(/skip this section/i);
    expect(stageHeading("Unlock your readiness report")).toBeTruthy();
  });

  it("resumes a prior session after remount", async () => {
    const { unmount } = renderWithLocale(<DiscoveryFlow />);
    clickButton(/start the map/i);
    expect(stageHeading("Business context")).toBeTruthy();
    unmount();

    renderWithLocale(<DiscoveryFlow />);
    await waitFor(() => expect(stageHeading("Business context")).toBeTruthy());
  });
});
