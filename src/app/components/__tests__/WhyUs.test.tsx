import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import WhyUs from "../WhyUs";

describe("WhyUs", () => {
  it("renders the section heading", () => {
    render(<WhyUs />);
    expect(
      screen.getByRole("heading", { name: /built different/i })
    ).toBeTruthy();
  });

  it("renders all six differentiators", () => {
    render(<WhyUs />);
    expect(screen.getByText("Engineering-Grade Standards")).toBeTruthy();
    expect(screen.getByText("Security & Traceability")).toBeTruthy();
    expect(screen.getByText("DevSecOps Mindset")).toBeTruthy();
    expect(screen.getByText("Production-Proven")).toBeTruthy();
    expect(screen.getByText("Reliable & Aligned")).toBeTruthy();
    expect(screen.getByText("Domain-Native")).toBeTruthy();
  });

  it("renders differentiator descriptions", () => {
    render(<WhyUs />);
    expect(
      screen.getByText(/critical infrastructure is built/i)
    ).toBeTruthy();
  });

  it("has the correct section id", () => {
    render(<WhyUs />);
    expect(document.getElementById("why-us")).toBeTruthy();
  });
});
