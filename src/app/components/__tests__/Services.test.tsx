import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithLocale } from "@/test-utils/renderWithLocale";
import Services from "../Services";

describe("Services", () => {
  it("renders the section heading", () => {
    renderWithLocale(<Services />);
    expect(
      screen.getByRole("heading", { name: /end-to-end ai capabilities/i })
    ).toBeTruthy();
  });

  it("renders all five service cards", () => {
    renderWithLocale(<Services />);
    expect(screen.getByText("AI Consulting & Strategy")).toBeTruthy();
    expect(screen.getByText("AI Agents & Autonomous Workflows")).toBeTruthy();
    expect(screen.getByText("Domain-Specific AI Skills")).toBeTruthy();
    expect(screen.getByText("AI Infrastructure")).toBeTruthy();
    expect(screen.getByText("RAG & Knowledge Systems")).toBeTruthy();
  });

  it("renders service descriptions", () => {
    renderWithLocale(<Services />);
    expect(
      screen.getByText(/Actionable roadmaps for AI adoption/i)
    ).toBeTruthy();
    expect(screen.getByText(/Autonomous agents that execute/i)).toBeTruthy();
  });

  it("has the correct section id", () => {
    renderWithLocale(<Services />);
    expect(document.getElementById("services")).toBeTruthy();
  });

  it("uses aria-labelledby for the section", () => {
    renderWithLocale(<Services />);
    const section = document.getElementById("services");
    expect(section?.getAttribute("aria-labelledby")).toBe("services-heading");
  });
});
