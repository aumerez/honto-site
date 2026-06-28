import { screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderWithLocale } from "../components/__tests__/testHelpers";
import OpportunityMapPage from "../components/OpportunityMap/OpportunityMapPage";
import OpportunityMapRoute from "../[locale]/opportunity-map/page";

describe("AI Readiness Map (Opportunity Map) — page shell", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the editorial hero headline at landing", () => {
    renderWithLocale(<OpportunityMapPage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
  });

  it("renders the primary start CTA as a button", () => {
    renderWithLocale(<OpportunityMapPage />);
    expect(screen.getByRole("button", { name: /start the map/i })).toBeTruthy();
  });

  it("renders privacy-safe microcopy", () => {
    renderWithLocale(<OpportunityMapPage />);
    expect(screen.getByText(/no passwords/i)).toBeTruthy();
    expect(screen.getByText(/credentials/i)).toBeTruthy();
  });

  it("does not present any data-collection inputs at landing", () => {
    const { container } = renderWithLocale(<OpportunityMapPage />);
    expect(container.querySelectorAll("input, textarea, select").length).toBe(
      0
    );
  });

  it("does not request banned sensitive data as labeled inputs", () => {
    const { container } = renderWithLocale(<OpportunityMapPage />);
    const fields = Array.from(
      container.querySelectorAll("input, textarea, select, label")
    );
    expect(fields).toHaveLength(0);
  });

  it("renders the localized start CTA in Spanish", () => {
    renderWithLocale(<OpportunityMapPage />, { locale: "es" });
    expect(
      screen.getByRole("button", { name: /iniciar el mapa/i })
    ).toBeTruthy();
  });

  it("renders the localized start CTA in Portuguese", () => {
    renderWithLocale(<OpportunityMapPage />, { locale: "pt" });
    expect(
      screen.getByRole("button", { name: /iniciar o mapa/i })
    ).toBeTruthy();
  });

  it("renders the full route shell with navigation without throwing", () => {
    renderWithLocale(<OpportunityMapRoute />);
    expect(screen.getByRole("navigation")).toBeTruthy();
  });
});
