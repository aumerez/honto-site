import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HontoOpsSection from "../HontoOpsSection";
import { renderWithLocale } from "@/test/renderWithLocale";

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

  it("links the Explore honto.ops CTA to the locale-scoped path", () => {
    renderWithLocale(<HontoOpsSection />);
    const link = screen.getByRole("link", { name: /explore honto\.ops/i });
    expect(link.getAttribute("href")).toBe("/en/honto-ops");
  });
});
