import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Navigation from "../Navigation";
import { renderWithLocale } from "./testHelpers";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("Navigation", () => {
  it("renders the logo", () => {
    renderWithLocale(<Navigation />);
    expect(screen.getByRole("link", { name: /^honto\.$/i })).toBeTruthy();
  });

  it("renders anchor links to each section", () => {
    renderWithLocale(<Navigation />);
    expect(screen.getByText("Problems").getAttribute("href")).toBe(
      "/en#problems"
    );
    expect(screen.getByText("Method").getAttribute("href")).toBe("/en#process");
    expect(screen.getByText("Capabilities").getAttribute("href")).toBe(
      "/en#capabilities"
    );
    expect(screen.getByText("honto.ops").getAttribute("href")).toBe(
      "/en#honto-ops"
    );
    expect(screen.getByText("Principles").getAttribute("href")).toBe(
      "/en#principles"
    );
  });

  it("renders the contact CTA", () => {
    renderWithLocale(<Navigation />);
    const contact = screen.getByRole("link", { name: /contact/i });
    expect(contact.getAttribute("href")).toBe("/en#contact");
  });

  it("renders the AI Readiness CTA pointing to the locale onboarding route", () => {
    renderWithLocale(<Navigation />);
    const cta = screen.getByRole("link", { name: /ai readiness/i });
    expect(cta.getAttribute("href")).toBe("/en/onboarding");
  });

  it("points the AI Readiness CTA at the Spanish onboarding route in es", () => {
    renderWithLocale(<Navigation />, { locale: "es" });
    const cta = screen.getByRole("link", { name: /madurez en ia/i });
    expect(cta.getAttribute("href")).toBe("/es/onboarding");
  });

  it("has an aria-label on the nav element", () => {
    renderWithLocale(<Navigation />);
    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeTruthy();
  });

  it("translates nav links when rendered in Spanish", () => {
    renderWithLocale(<Navigation />, { locale: "es" });
    expect(screen.getByText("Problemas")).toBeTruthy();
    expect(screen.getByText("Método")).toBeTruthy();
    expect(screen.getByText("Principios")).toBeTruthy();
  });

  it("renders the language switcher", () => {
    renderWithLocale(<Navigation />);
    expect(
      screen.getByRole("button", { name: /change language/i })
    ).toBeTruthy();
  });
});
