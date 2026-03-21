import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Insights from "../page";

describe("Insights page", () => {
  it("renders the page heading", () => {
    render(<Insights />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("Insights");
  });

  it("renders the coming soon message", () => {
    render(<Insights />);
    expect(screen.getByText("Coming soon")).toBeTruthy();
  });

  it("renders Navigation and Footer", () => {
    render(<Insights />);
    expect(screen.getByRole("navigation", { name: /main/i })).toBeTruthy();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
});
