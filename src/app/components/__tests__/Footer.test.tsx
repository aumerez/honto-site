import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders the logo", () => {
    render(<Footer />);
    expect(screen.getAllByText(/Honto/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders the footer role", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });

  it("renders navigation links", () => {
    render(<Footer />);
    expect(screen.getByText("Work")).toBeTruthy();
    expect(screen.getByText("About")).toBeTruthy();
    expect(screen.getByText("Insights")).toBeTruthy();
    expect(screen.getByText("Contact")).toBeTruthy();
  });

  it("renders the description", () => {
    render(<Footer />);
    expect(
      screen.getByText("Engineering consultancy for AI systems.")
    ).toBeTruthy();
  });

  it("renders copyright notice with current year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`${year}`))).toBeTruthy();
  });

  it("renders legal links", () => {
    render(<Footer />);
    expect(screen.getByText("Privacy Policy")).toBeTruthy();
    expect(screen.getByText("Terms of Service")).toBeTruthy();
  });
});
