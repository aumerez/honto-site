import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Home from "../[locale]/page";
import { LocaleProvider } from "@/context/LocaleContext";
import enDict from "@/locales/en.json";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

function renderHome() {
  return render(
    <LocaleProvider locale="en" dictionary={enDict}>
      <Home />
    </LocaleProvider>
  );
}

describe("Home page", () => {
  it("renders the hero heading", () => {
    renderHome();
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
  });

  it("renders the main navigation", () => {
    renderHome();
    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeTruthy();
  });

  it("renders the problems section heading", () => {
    renderHome();
    expect(
      screen.getByRole("heading", { level: 2, name: /AI strategy/i })
    ).toBeTruthy();
  });

  it("renders the contact form submit button", () => {
    renderHome();
    expect(screen.getByRole("button", { name: /send message/i })).toBeTruthy();
  });

  it("renders the footer", () => {
    renderHome();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
});
