import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BulwarkCaseStudy from "../page";

describe("Bulwark case study page", () => {
  it("renders the page heading", () => {
    render(<BulwarkCaseStudy />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("Bulwark");
  });

  it("renders the subtitle", () => {
    render(<BulwarkCaseStudy />);
    expect(
      screen.getByText("Open-source governance layer for AI agents")
    ).toBeTruthy();
  });

  it("renders stats", () => {
    render(<BulwarkCaseStudy />);
    expect(screen.getByText("487")).toBeTruthy();
    expect(screen.getByText("Unit tests")).toBeTruthy();
    expect(screen.getByText("10")).toBeTruthy();
    expect(screen.getByText("Rust crates")).toBeTruthy();
  });

  it("renders the challenge section", () => {
    render(<BulwarkCaseStudy />);
    expect(screen.getByText("The Challenge")).toBeTruthy();
    expect(screen.getByText("No credential isolation")).toBeTruthy();
    expect(screen.getByText("No policy enforcement")).toBeTruthy();
    expect(screen.getByText("No content inspection")).toBeTruthy();
    expect(screen.getByText("No audit trail")).toBeTruthy();
  });

  it("renders core capabilities", () => {
    render(<BulwarkCaseStudy />);
    expect(screen.getByText("Policy Enforcement")).toBeTruthy();
    expect(screen.getByText("Credential Management")).toBeTruthy();
    expect(screen.getAllByText("Content Inspection").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Rate Limiting")).toBeTruthy();
    expect(screen.getByText("MCP-Native")).toBeTruthy();
  });

  it("renders the pipeline steps", () => {
    render(<BulwarkCaseStudy />);
    expect(screen.getByText("Agent Request")).toBeTruthy();
    expect(screen.getByText("Session Validation")).toBeTruthy();
    expect(screen.getByText("Policy Evaluation")).toBeTruthy();
    expect(screen.getByText("Credential Injection")).toBeTruthy();
    expect(screen.getByText("Upstream Tool")).toBeTruthy();
  });

  it("renders the integration modes table", () => {
    render(<BulwarkCaseStudy />);
    expect(screen.getByText("MCP Gateway (stdio)")).toBeTruthy();
    expect(screen.getByText("MCP Gateway (HTTP)")).toBeTruthy();
    expect(screen.getByText("HTTP Proxy")).toBeTruthy();
  });

  it("renders the architecture crates", () => {
    render(<BulwarkCaseStudy />);
    expect(screen.getByText("cli/")).toBeTruthy();
    expect(screen.getByText("proxy/")).toBeTruthy();
    expect(screen.getByText("mcp/")).toBeTruthy();
    expect(screen.getByText("vault/")).toBeTruthy();
    expect(screen.getByText("audit/")).toBeTruthy();
  });

  it("renders breadcrumb navigation", () => {
    render(<BulwarkCaseStudy />);
    const breadcrumbLink = screen.getAllByText("Case Studies")[0];
    expect(breadcrumbLink.closest("a")?.getAttribute("href")).toBe(
      "/case-studies"
    );
  });

  it("renders Navigation and Footer", () => {
    render(<BulwarkCaseStudy />);
    expect(
      screen.getByRole("navigation", { name: /main/i })
    ).toBeTruthy();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
});
