import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CaseStudies from "../page";

describe("Case Studies page", () => {
  it("renders the page heading", () => {
    render(<CaseStudies />);
    expect(
      screen.getByRole("heading", { level: 1 })
    ).toBeTruthy();
    expect(screen.getByText("Systems we've built")).toBeTruthy();
  });

  it("renders the page description", () => {
    render(<CaseStudies />);
    expect(
      screen.getByText(/Real-world AI infrastructure/i)
    ).toBeTruthy();
  });

  it("renders the Bulwark case study card", () => {
    render(<CaseStudies />);
    expect(screen.getByText("Bulwark")).toBeTruthy();
    expect(
      screen.getAllByText("Open-source governance layer for AI agents").length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders case study tags", () => {
    render(<CaseStudies />);
    expect(screen.getByText("Rust")).toBeTruthy();
    expect(screen.getByText("MCP Protocol")).toBeTruthy();
    expect(screen.getByText("Policy Engine")).toBeTruthy();
    expect(screen.getByText("Credential Vault")).toBeTruthy();
    expect(screen.getByText("Audit Logging")).toBeTruthy();
  });

  it("renders a link to the Bulwark case study", () => {
    render(<CaseStudies />);
    const link = screen.getByText("Read case study").closest("a");
    expect(link?.getAttribute("href")).toBe("/case-studies/bulwark");
  });

  it("renders Navigation and Footer", () => {
    render(<CaseStudies />);
    expect(
      screen.getByRole("navigation", { name: /main/i })
    ).toBeTruthy();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
});
