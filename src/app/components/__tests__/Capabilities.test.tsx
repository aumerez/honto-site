import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Capabilities from "../Capabilities";

describe("Capabilities", () => {
  it("renders six capability cards numbered C.01 through C.06", () => {
    render(<Capabilities />);
    for (let i = 1; i <= 6; i += 1) {
      expect(screen.getByText(`C.0${i}`)).toBeTruthy();
    }
  });

  it("renders the section heading", () => {
    render(<Capabilities />);
    expect(
      screen.getByRole("heading", { level: 2, name: /full stack/i })
    ).toBeTruthy();
  });
});
