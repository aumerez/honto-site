import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Contact from "../page";

describe("Contact page", () => {
  it("renders the page heading", () => {
    render(<Contact />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("Get in touch");
  });

  it("renders the email address", () => {
    render(<Contact />);
    const link = screen.getByText("hello@honto.ai");
    expect(link.closest("a")?.getAttribute("href")).toBe(
      "mailto:hello@honto.ai"
    );
  });

  it("renders response time note", () => {
    render(<Contact />);
    expect(
      screen.getByText(/typically respond within one business day/i)
    ).toBeTruthy();
  });

  it("renders Navigation and Footer", () => {
    render(<Contact />);
    expect(screen.getByRole("navigation", { name: /main/i })).toBeTruthy();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
});
