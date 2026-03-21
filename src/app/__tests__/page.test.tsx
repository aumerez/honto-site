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

  it("renders service cards", () => {
    render(<Home />);
    expect(screen.getAllByText(/AI Consulting/i).length).toBeGreaterThanOrEqual(
      1
    );
  });

  it("renders the contact section", () => {
    render(<Home />);
    const buttons = screen.getAllByRole("button", {
      name: /book a discovery call/i,
    });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the footer", () => {
    render(<Home />);
    const footers = screen.getAllByRole("contentinfo");
    expect(footers.length).toBeGreaterThanOrEqual(1);
  });
});
