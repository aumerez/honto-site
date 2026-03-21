import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import About from "../page";

describe("About page", () => {
  it("renders the page heading", () => {
    render(<About />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("About");
  });

  it("renders the introduction", () => {
    render(<About />);
    expect(
      screen.getByText(/engineering consultancy that designs/i)
    ).toBeTruthy();
  });

  it("renders how we work section", () => {
    render(<About />);
    expect(screen.getByRole("heading", { name: /how we work/i })).toBeTruthy();
  });

  it("renders values", () => {
    render(<About />);
    expect(screen.getByText("Engineering discipline")).toBeTruthy();
    expect(screen.getByText("Honest assessment")).toBeTruthy();
    expect(screen.getByText("Operational ownership")).toBeTruthy();
  });

  it("renders Navigation and Footer", () => {
    render(<About />);
    expect(screen.getByRole("navigation", { name: /main/i })).toBeTruthy();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
});
