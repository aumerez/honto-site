import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Process from "../Process";
import { renderWithLocale } from "./testHelpers";

describe("Process", () => {
  it("renders the four phase titles", () => {
    renderWithLocale(<Process />);
    ["Map", "Build", "Deploy", "Operate"].forEach((title) => {
      expect(screen.getByText(title)).toBeTruthy();
    });
  });

  it("renders the section heading", () => {
    renderWithLocale(<Process />);
    expect(
      screen.getByRole("heading", { level: 2, name: /expert judgment/i })
    ).toBeTruthy();
  });
});
