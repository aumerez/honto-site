import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Navigation from "../Navigation";

describe("Navigation", () => {
  it("renders the logo", () => {
    render(<Navigation />);
    expect(screen.getByText(/honto/)).toBeTruthy();
  });

  it("renders anchor links to each section", () => {
    render(<Navigation />);
    expect(screen.getByText("Problems").getAttribute("href")).toBe("#problems");
    expect(screen.getByText("Method").getAttribute("href")).toBe("#process");
    expect(screen.getByText("Capabilities").getAttribute("href")).toBe(
      "#capabilities"
    );
    expect(screen.getByText("OpsAI").getAttribute("href")).toBe("#opsai");
    expect(screen.getByText("Principles").getAttribute("href")).toBe(
      "#principles"
    );
  });

  it("renders the booking pill and contact CTA", () => {
    render(<Navigation />);
    expect(screen.getByText(/Booking Q3/)).toBeTruthy();
    const contact = screen.getByText(/Contact/);
    expect(contact.getAttribute("href")).toBe("#contact");
  });

  it("has an aria-label on the nav element", () => {
    render(<Navigation />);
    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeTruthy();
  });
});
