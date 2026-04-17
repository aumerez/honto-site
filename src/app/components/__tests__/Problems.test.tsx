import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Problems from "../Problems";

describe("Problems", () => {
  it("renders the section heading", () => {
    render(<Problems />);
    expect(
      screen.getByRole("heading", { level: 2, name: /AI strategy/i })
    ).toBeTruthy();
  });

  it("renders six problem rows", () => {
    const { container } = render(<Problems />);
    expect(container.querySelectorAll(".problem").length).toBe(6);
  });

  it("numbers problems P.01 through P.06", () => {
    render(<Problems />);
    expect(screen.getByText("P.01")).toBeTruthy();
    expect(screen.getByText("P.06")).toBeTruthy();
  });
});
