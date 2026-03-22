import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../page";

describe("Home page", () => {
  it("renders the hero heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
  });

  it("renders the main navigation", () => {
    render(<Home />);
    const navs = screen.getAllByRole("navigation", { name: /main/i });
    expect(navs.length).toBeGreaterThanOrEqual(1);
  });

  it("renders practice areas", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", {
        name: /from strategy through production/i,
      })
    ).toBeTruthy();
  });

  it("renders about section with Bulwark mention", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /focused work/i })).toBeTruthy();
    expect(screen.getByText("Bulwark")).toBeTruthy();
  });

  it("renders contact section", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /let's talk/i })).toBeTruthy();
  });

  it("renders the footer", () => {
    render(<Home />);
    const footers = screen.getAllByRole("contentinfo");
    expect(footers.length).toBeGreaterThanOrEqual(1);
  });
});
