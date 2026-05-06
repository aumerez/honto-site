import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Onboarding from "../[locale]/onboarding/page";
import { LocaleProvider } from "@/context/LocaleContext";
import enDict from "@/locales/en.json";
import esDict from "@/locales/es.json";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/onboarding",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("Onboarding page", () => {
  it("renders the heading in English", () => {
    render(
      <LocaleProvider locale="en" dictionary={enDict}>
        <Onboarding />
      </LocaleProvider>
    );
    expect(
      screen.getByRole("heading", { level: 1, name: /readiness for ai/i })
    ).toBeTruthy();
  });

  it("renders the heading in Spanish", () => {
    render(
      <LocaleProvider locale="es" dictionary={esDict}>
        <Onboarding />
      </LocaleProvider>
    );
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /madurez de tu organización/i,
      })
    ).toBeTruthy();
  });

  it("renders the navigation with the AI Readiness CTA", () => {
    render(
      <LocaleProvider locale="en" dictionary={enDict}>
        <Onboarding />
      </LocaleProvider>
    );
    expect(screen.getByRole("link", { name: /ai readiness/i })).toBeTruthy();
  });
});
