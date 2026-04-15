import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithLocale } from "@/test-utils/renderWithLocale";
import CallToAction from "../CallToAction";

describe("CallToAction", () => {
  it("renders the section heading", () => {
    renderWithLocale(<CallToAction />);
    expect(screen.getByText(/Let's talk about/i)).toBeTruthy();
    expect(screen.getByText(/your AI systems/i)).toBeTruthy();
  });

  it("renders the mailto link with the contact email", () => {
    renderWithLocale(<CallToAction />);
    const link = screen.getByRole("link", { name: /info@honto\.ai/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("mailto:info@honto.ai");
  });

  it("has the correct section id", () => {
    renderWithLocale(<CallToAction />);
    expect(document.getElementById("contact")).toBeTruthy();
  });
});
