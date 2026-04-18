import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HontoOpsSection from "../HontoOpsSection";
import { renderWithLocale } from "./testHelpers";

describe("HontoOpsSection", () => {
  it("renders the product section heading", () => {
    renderWithLocale(<HontoOpsSection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /second brain/i })
    ).toBeTruthy();
  });

  it("renders four feature tiles", () => {
    const { container } = renderWithLocale(<HontoOpsSection />);
    expect(container.querySelectorAll(".honto-ops-feat .f").length).toBe(4);
  });

  it("links the CTA to the locale-prefixed honto.ops route", () => {
    renderWithLocale(<HontoOpsSection />);
    const link = screen.getByRole("link", { name: /explore honto\.ops/i });
    expect(link.getAttribute("href")).toBe("/en/honto-ops");
  });

  it("prefixes CTA with /es when in Spanish", () => {
    renderWithLocale(<HontoOpsSection />, { locale: "es" });
    const link = screen.getByRole("link", { name: /explorar honto\.ops/i });
    expect(link.getAttribute("href")).toBe("/es/honto-ops");
  });
});
