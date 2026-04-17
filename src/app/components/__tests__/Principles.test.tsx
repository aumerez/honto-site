import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Principles from "../Principles";

describe("Principles", () => {
  it("renders six principles numbered P.01 through P.06", () => {
    render(<Principles />);
    for (let i = 1; i <= 6; i += 1) {
      expect(screen.getByText(`P.0${i}`)).toBeTruthy();
    }
  });

  it("renders the section heading", () => {
    render(<Principles />);
    expect(
      screen.getByRole("heading", { level: 2, name: /non-negotiable/i })
    ).toBeTruthy();
  });
});
