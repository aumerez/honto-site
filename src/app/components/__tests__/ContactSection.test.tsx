import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ContactSection from "../ContactSection";

describe("ContactSection", () => {
  it("renders the section heading", () => {
    render(<ContactSection />);
    expect(screen.getByRole("heading", { name: /let's talk/i })).toBeTruthy();
  });

  it("renders the email address", () => {
    render(<ContactSection />);
    const link = screen.getByText("hello@honto.ai");
    expect(link.closest("a")?.getAttribute("href")).toBe(
      "mailto:hello@honto.ai"
    );
  });

  it("renders a link to the contact page", () => {
    render(<ContactSection />);
    const link = screen.getByText("Contact page");
    expect(link.closest("a")?.getAttribute("href")).toBe("/contact");
  });
});
