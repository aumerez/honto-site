import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "../Hero";

describe("Hero", () => {
  it("renders the main heading with the tagline", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toMatch(/From static knowledge/i);
    expect(heading.textContent).toMatch(/execution\./i);
  });

  it("renders the subheadline", () => {
    render(<Hero />);
    expect(screen.getByText(/captures your company's expertise/i)).toBeTruthy();
  });

  it("renders both CTA buttons with anchor targets", () => {
    render(<Hero />);
    const primary = screen.getByRole("link", { name: /start an engagement/i });
    expect(primary.getAttribute("href")).toBe("#contact");

    const secondary = screen.getByRole("link", { name: /see what we solve/i });
    expect(secondary.getAttribute("href")).toBe("#problems");
  });

  it("has an aria-label on the hero section", () => {
    render(<Hero />);
    expect(document.querySelector('section[aria-label="Hero"]')).toBeTruthy();
  });
});
