import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HowItWorks from "../HowItWorks";

describe("HowItWorks", () => {
  it("renders the section heading", () => {
    render(<HowItWorks />);
    expect(
      screen.getByRole("heading", { name: /how it works/i })
    ).toBeTruthy();
  });

  it("renders all four steps", () => {
    render(<HowItWorks />);
    expect(screen.getByText("Map")).toBeTruthy();
    expect(screen.getByText("Build")).toBeTruthy();
    expect(screen.getByText("Deploy")).toBeTruthy();
    expect(screen.getByText("Scale")).toBeTruthy();
  });

  it("renders step numbers", () => {
    render(<HowItWorks />);
    expect(screen.getByText("01")).toBeTruthy();
    expect(screen.getByText("02")).toBeTruthy();
    expect(screen.getByText("03")).toBeTruthy();
    expect(screen.getByText("04")).toBeTruthy();
  });

  it("renders step descriptions", () => {
    render(<HowItWorks />);
    expect(
      screen.getByText(/analyze your domain, processes/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/Production-grade deployment/i)
    ).toBeTruthy();
  });

  it("has the correct section id", () => {
    render(<HowItWorks />);
    expect(document.getElementById("how-it-works")).toBeTruthy();
  });
});
