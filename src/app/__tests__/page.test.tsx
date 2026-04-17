import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "../[locale]/page";

describe("Home page", () => {
  it("renders the hero heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
  });

  it("renders the main navigation", () => {
    render(<Home />);
    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeTruthy();
  });

  it("renders the problems section heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 2, name: /AI strategy/i })
    ).toBeTruthy();
  });

  it("renders the contact mailto link", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: /start a conversation/i });
    expect(link.getAttribute("href")).toBe("mailto:info@honto.ai");
  });

  it("renders the footer", () => {
    render(<Home />);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
});
