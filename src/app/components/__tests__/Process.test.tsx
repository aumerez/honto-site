import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Process from "../Process";

describe("Process", () => {
  it("renders the four phase titles", () => {
    render(<Process />);
    ["Map", "Build", "Deploy", "Operate"].forEach((title) => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  it("renders the section heading", () => {
    render(<Process />);
    expect(
      screen.getByRole("heading", { level: 2, name: /expert judgment/i })
    ).toBeTruthy();
  });
});
