import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders the logo", () => {
    render(<Footer />);
    expect(screen.getByText(/honto/)).toBeTruthy();
  });

  it("renders the footer role", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });

  it("renders link column headings", () => {
    render(<Footer />);
    expect(screen.getByText("Services")).toBeTruthy();
    expect(screen.getByText("Company")).toBeTruthy();
    expect(screen.getByText("Resources")).toBeTruthy();
  });

  it("renders service links", () => {
    render(<Footer />);
    expect(screen.getByText("AI Consulting")).toBeTruthy();
    expect(screen.getByText("AI Agents")).toBeTruthy();
    expect(screen.getByText("AI Skills")).toBeTruthy();
    expect(screen.getByText("RAG Systems")).toBeTruthy();
  });

  it("renders company links", () => {
    render(<Footer />);
    expect(screen.getByText("About")).toBeTruthy();
    expect(screen.getByText("Careers")).toBeTruthy();
    expect(screen.getByText("Contact")).toBeTruthy();
  });

  it("renders resources links", () => {
    render(<Footer />);
    expect(screen.getByText("Documentation")).toBeTruthy();
    expect(screen.getByText("Blog")).toBeTruthy();
    expect(screen.getByText("Case Studies")).toBeTruthy();
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
