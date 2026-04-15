import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithLocale } from "@/test-utils/renderWithLocale";
import Hero from "../Hero";

describe("Hero", () => {
  it("renders the main heading", () => {
    renderWithLocale(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toContain("AI Systems That Think");
  });

  it("renders the eyebrow text", () => {
    renderWithLocale(<Hero />);
    expect(screen.getByText("AI Systems Engineering")).toBeTruthy();
  });

  it("renders the subheadline", () => {
    renderWithLocale(<Hero />);
    expect(
      screen.getByText(/production-grade AI infrastructure/i)
    ).toBeTruthy();
  });

  it("renders CTA buttons", () => {
    renderWithLocale(<Hero />);
    expect(screen.getByText("Explore Services")).toBeTruthy();
    expect(screen.getByText("Contact Us")).toBeTruthy();
  });

  it("renders the three stats", () => {
    renderWithLocale(<Hero />);
    expect(screen.getByText("99.9%")).toBeTruthy();
    expect(screen.getByText("System uptime")).toBeTruthy();
    expect(screen.getByText("10x")).toBeTruthy();
    expect(screen.getByText("Faster decisions")).toBeTruthy();
    expect(screen.getByText("<2s")).toBeTruthy();
    expect(screen.getByText("Response time")).toBeTruthy();
  });

  it("has an aria-label on the hero section", () => {
    renderWithLocale(<Hero />);
    expect(document.querySelector('section[aria-label="Hero"]')).toBeTruthy();
  });
});
