import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithLocale } from "@/test-utils/renderWithLocale";
import Navigation from "../Navigation";

describe("Navigation", () => {
  it("renders the logo", () => {
    renderWithLocale(<Navigation />);
    expect(screen.getByLabelText("Honto — Home")).toBeTruthy();
  });

  it("renders all navigation links", () => {
    renderWithLocale(<Navigation />);
    expect(screen.getAllByText("Services").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Product").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("How It Works").length).toBeGreaterThanOrEqual(
      1
    );
    expect(screen.getAllByText("Why Honto").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Case Studies").length).toBeGreaterThanOrEqual(
      1
    );
  });

  it("renders Book a Demo CTA", () => {
    renderWithLocale(<Navigation />);
    expect(screen.getAllByText("Book a Demo").length).toBeGreaterThanOrEqual(1);
  });

  it("has correct aria-label on nav element", () => {
    renderWithLocale(<Navigation />);
    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeTruthy();
  });

  it("toggles mobile menu on button click", () => {
    renderWithLocale(<Navigation />);
    const button = screen.getByLabelText("Open menu");
    expect(button.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(button);
    expect(screen.getByLabelText("Close menu")).toBeTruthy();
    expect(
      screen.getByLabelText("Close menu").getAttribute("aria-expanded")
    ).toBe("true");
  });

  it("closes mobile menu when a link is clicked", () => {
    renderWithLocale(<Navigation />);
    fireEvent.click(screen.getByLabelText("Open menu"));

    const mobileMenu = document.getElementById("mobile-menu");
    expect(mobileMenu?.getAttribute("aria-hidden")).toBe("false");

    const mobileLinks = mobileMenu?.querySelectorAll("a");
    if (mobileLinks && mobileLinks.length > 0) {
      fireEvent.click(mobileLinks[0]);
    }

    expect(mobileMenu?.getAttribute("aria-hidden")).toBe("true");
  });
});
