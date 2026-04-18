import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../Footer";
import { renderWithLocale } from "@/test/renderWithLocale";

describe("Footer", () => {
  it("renders the contentinfo role", () => {
    renderWithLocale(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });

  it("renders the copyright and tagline", () => {
    renderWithLocale(<Footer />);
    expect(screen.getByText(/© 2026 Honto/)).toBeTruthy();
    expect(screen.getByText(/enterprise second brain/i)).toBeTruthy();
  });

  it("renders the location and locale switcher", () => {
    renderWithLocale(<Footer />);
    expect(screen.getByText(/Palo Alto, CA/)).toBeTruthy();
    expect(screen.getByText("EN")).toBeTruthy();
    expect(screen.getByText("ES")).toBeTruthy();
  });

  it("renders Spanish copyright when locale is es", () => {
    renderWithLocale(<Footer />, "es");
    expect(screen.getByText(/segundo cerebro empresarial/i)).toBeTruthy();
  });
});
