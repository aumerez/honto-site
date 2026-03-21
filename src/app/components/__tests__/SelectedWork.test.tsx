import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SelectedWork from "../SelectedWork";

describe("SelectedWork", () => {
  it("renders the section heading", () => {
    render(<SelectedWork />);
    expect(
      screen.getByRole("heading", { name: /projects that shipped/i })
    ).toBeTruthy();
  });

  it("renders the Bulwark project card", () => {
    render(<SelectedWork />);
    expect(screen.getByText("Bulwark")).toBeTruthy();
    expect(screen.getByText(/security middleware for AI agents/i)).toBeTruthy();
  });

  it("renders project tags", () => {
    render(<SelectedWork />);
    expect(screen.getByText("Rust")).toBeTruthy();
    expect(screen.getByText("Agent Governance")).toBeTruthy();
  });

  it("renders a case study link", () => {
    render(<SelectedWork />);
    expect(screen.getByText("Read case study")).toBeTruthy();
  });
});
