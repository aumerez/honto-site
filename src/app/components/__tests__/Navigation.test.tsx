import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Navigation from "../Navigation";
import { renderWithLocale } from "@/test/renderWithLocale";

describe("Navigation", () => {
  it("renders the logo", () => {
    renderWithLocale(<Navigation />);
    expect(screen.getByRole("link", { name: /^honto\.$/i })).toBeTruthy();
  });

  it("renders anchor links to each section", () => {
    renderWithLocale(<Navigation />);
    expect(screen.getByText("Problems").getAttribute("href")).toBe("#problems");
    expect(screen.getByText("Method").getAttribute("href")).toBe("#process");
    expect(screen.getByText("Capabilities").getAttribute("href")).toBe(
      "#capabilities"
    );
    expect(screen.getByText("honto.ops").getAttribute("href")).toBe(
      "#honto-ops"
    );
    expect(screen.getByText("Principles").getAttribute("href")).toBe(
      "#principles"
    );
  });

  it("renders the contact CTA", () => {
    renderWithLocale(<Navigation />);
    const contact = screen.getByText(/Contact/);
    expect(contact.getAttribute("href")).toBe("#contact");
  });

  it("has an aria-label on the nav element", () => {
    renderWithLocale(<Navigation />);
    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeTruthy();
  });

  it("renders nav anchors in Spanish when locale is es", () => {
    renderWithLocale(<Navigation />, "es");
    expect(screen.getByText("Problemas").getAttribute("href")).toBe(
      "#problems"
    );
    expect(screen.getByText("Método").getAttribute("href")).toBe("#process");
  });
});
