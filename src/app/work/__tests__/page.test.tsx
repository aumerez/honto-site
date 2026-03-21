import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Work from "../page";

describe("Work page", () => {
  it("renders the page heading", () => {
    render(<Work />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeTruthy();
    expect(heading.textContent).toBe("Work");
  });

  it("renders the Bulwark project card", () => {
    render(<Work />);
    expect(screen.getByText("Bulwark")).toBeTruthy();
    expect(
      screen.getAllByText(/security-first middleware/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders project tags", () => {
    render(<Work />);
    expect(screen.getByText("Rust")).toBeTruthy();
    expect(screen.getByText("MCP Protocol")).toBeTruthy();
  });

  it("renders a link to the Bulwark project", () => {
    render(<Work />);
    const link = screen.getByText("View project").closest("a");
    expect(link?.getAttribute("href")).toBe("/work/bulwark");
  });

  it("renders Navigation and Footer", () => {
    render(<Work />);
    expect(screen.getByRole("navigation", { name: /main/i })).toBeTruthy();
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });
});
