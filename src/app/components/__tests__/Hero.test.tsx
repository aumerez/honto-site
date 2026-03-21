import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Hero from "../Hero";

describe("Hero", () => {
  it("renders the main heading", () => {
    render(<Hero />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toContain("Your AI systems");
  });

  it("renders the eyebrow text", () => {
    render(<Hero />);
    expect(screen.getByText("AI Systems Engineering")).toBeTruthy();
  });

  it("renders the subheadline", () => {
    render(<Hero />);
    expect(screen.getByText(/Most AI initiatives stall/i)).toBeTruthy();
  });

  it("renders the CTA link", () => {
    render(<Hero />);
    expect(screen.getByText("Start a conversation")).toBeTruthy();
  });

  it("has an aria-label on the hero section", () => {
    render(<Hero />);
    expect(document.querySelector('section[aria-label="Hero"]')).toBeTruthy();
  });
});
