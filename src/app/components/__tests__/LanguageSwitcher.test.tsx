import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import LanguageSwitcher from "../LanguageSwitcher";
import { renderWithLocale } from "./testHelpers";

const push = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({ push, refresh }),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    push.mockClear();
    refresh.mockClear();
    document.cookie = "NEXT_LOCALE=; path=/; max-age=0";
  });

  afterEach(() => {
    document.cookie = "NEXT_LOCALE=; path=/; max-age=0";
  });

  it("renders the current locale and opens the menu on click", () => {
    renderWithLocale(<LanguageSwitcher />);
    const trigger = screen.getByRole("button", { name: /change language/i });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.textContent).toContain("EN");

    fireEvent.click(trigger);

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("option", { name: /english/i })).toBeTruthy();
    expect(screen.getByRole("option", { name: /spanish/i })).toBeTruthy();
  });

  it("swaps the locale segment and sets the NEXT_LOCALE cookie on selection", () => {
    renderWithLocale(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /change language/i }));
    fireEvent.click(screen.getByRole("option", { name: /spanish/i }));

    expect(document.cookie).toContain("NEXT_LOCALE=es");
    expect(push).toHaveBeenCalledWith("/es");
    expect(refresh).toHaveBeenCalled();
  });

  it("does nothing when the current locale is selected", () => {
    renderWithLocale(<LanguageSwitcher />);
    fireEvent.click(screen.getByRole("button", { name: /change language/i }));
    fireEvent.click(screen.getByRole("option", { name: /english/i }));

    expect(push).not.toHaveBeenCalled();
  });

  it("shows Spanish labels when active locale is es", () => {
    renderWithLocale(<LanguageSwitcher />, { locale: "es" });
    const trigger = screen.getByRole("button", { name: /cambiar idioma/i });
    expect(trigger.textContent).toContain("ES");
  });
});
