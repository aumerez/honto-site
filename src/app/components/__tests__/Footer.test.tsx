import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../Footer";
import { renderWithLocale } from "./testHelpers";

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

  it("renders locations and language tokens", () => {
    renderWithLocale(<Footer />);
    expect(screen.getByText(/Palo Alto, CA/)).toBeTruthy();
    expect(screen.getByText(/EN · ES · PT/)).toBeTruthy();
  });

  it("shows Spanish tagline when locale is es", () => {
    renderWithLocale(<Footer />, { locale: "es" });
    expect(screen.getByText(/el segundo cerebro de la empresa/i)).toBeTruthy();
  });

  it("shows Portuguese tagline when locale is pt", () => {
    renderWithLocale(<Footer />, { locale: "pt" });
    expect(screen.getByText(/o segundo cérebro da empresa/i)).toBeTruthy();
  });

  it("links to the honto LinkedIn company page", () => {
    renderWithLocale(<Footer />);
    const link = screen.getByRole("link", { name: /linkedin/i });
    expect(link.getAttribute("href")).toBe(
      "https://www.linkedin.com/company/honto-ai"
    );
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });
});
