import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithLocale } from "@/test-utils/renderWithLocale";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders the logo", () => {
    renderWithLocale(<Footer />);
    expect(screen.getAllByText(/honto/i).length).toBeGreaterThan(0);
  });

  it("renders the footer role", () => {
    renderWithLocale(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });

  it("renders link column headings", () => {
    renderWithLocale(<Footer />);
    expect(screen.getByText("Platform")).toBeTruthy();
    expect(screen.getByText("Services")).toBeTruthy();
    expect(screen.getByText("Company")).toBeTruthy();
    expect(screen.getByText("Resources")).toBeTruthy();
  });

  it("renders service links", () => {
    renderWithLocale(<Footer />);
    expect(screen.getByText("AI Consulting")).toBeTruthy();
    expect(screen.getByText("AI Agents")).toBeTruthy();
    expect(screen.getByText("AI Skills")).toBeTruthy();
    expect(screen.getByText("RAG Systems")).toBeTruthy();
  });

  it("renders company links", () => {
    renderWithLocale(<Footer />);
    expect(screen.getByText("About")).toBeTruthy();
    expect(screen.getByText("Careers")).toBeTruthy();
    expect(screen.getByText("Contact")).toBeTruthy();
  });

  it("renders resources links", () => {
    renderWithLocale(<Footer />);
    expect(screen.getByText("Documentation")).toBeTruthy();
    expect(screen.getByText("Blog")).toBeTruthy();
    expect(screen.getByText("Case Studies")).toBeTruthy();
  });

  it("renders copyright notice with current year", () => {
    renderWithLocale(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`${year}`))).toBeTruthy();
  });

  it("renders legal links", () => {
    renderWithLocale(<Footer />);
    expect(screen.getByText("Privacy Policy")).toBeTruthy();
    expect(screen.getByText("Terms of Service")).toBeTruthy();
  });
});
