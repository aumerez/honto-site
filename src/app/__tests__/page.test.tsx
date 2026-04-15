import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithLocale } from "@/test-utils/renderWithLocale";
import Home from "../[locale]/page";

describe("Home page", () => {
  it("renders the hero heading", () => {
    renderWithLocale(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
  });

  it("renders the main navigation", () => {
    renderWithLocale(<Home />);
    const navs = screen.getAllByRole("navigation", { name: /main/i });
    expect(navs.length).toBeGreaterThanOrEqual(1);
  });

  it("renders service cards", () => {
    renderWithLocale(<Home />);
    expect(screen.getAllByText(/AI Consulting/i).length).toBeGreaterThanOrEqual(
      1
    );
  });

  it("renders the contact section with email", () => {
    renderWithLocale(<Home />);
    const emailLinks = screen.getAllByRole("link", {
      name: /info@honto\.ai/i,
    });
    expect(emailLinks.length).toBeGreaterThanOrEqual(1);
    expect(emailLinks[0].getAttribute("href")).toBe("mailto:info@honto.ai");
  });

  it("renders the footer", () => {
    renderWithLocale(<Home />);
    const footers = screen.getAllByRole("contentinfo");
    expect(footers.length).toBeGreaterThanOrEqual(1);
  });
});
