import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CompressedAbout from "../CompressedAbout";

describe("CompressedAbout", () => {
  it("renders the section heading", () => {
    render(<CompressedAbout />);
    expect(screen.getByRole("heading", { name: /small team/i })).toBeTruthy();
  });

  it("renders the description", () => {
    render(<CompressedAbout />);
    expect(
      screen.getByText(/engineering consultancy focused on AI systems/i)
    ).toBeTruthy();
  });

  it("renders a link to the about page", () => {
    render(<CompressedAbout />);
    const link = screen.getByText(/how we work/i);
    expect(link.closest("a")?.getAttribute("href")).toBe("/about");
  });
});
