import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithLocale } from "@/test-utils/renderWithLocale";
import HowItWorks from "../HowItWorks";

describe("HowItWorks", () => {
  it("renders the section heading", () => {
    renderWithLocale(<HowItWorks />);
    expect(screen.getByRole("heading", { name: /how it works/i })).toBeTruthy();
  });

  it("renders all four steps", () => {
    renderWithLocale(<HowItWorks />);
    expect(screen.getByText("Map")).toBeTruthy();
    expect(screen.getByText("Build")).toBeTruthy();
    expect(screen.getByText("Deploy")).toBeTruthy();
    expect(screen.getByText("Scale")).toBeTruthy();
  });

  it("renders step numbers", () => {
    renderWithLocale(<HowItWorks />);
    expect(screen.getByText("01")).toBeTruthy();
    expect(screen.getByText("02")).toBeTruthy();
    expect(screen.getByText("03")).toBeTruthy();
    expect(screen.getByText("04")).toBeTruthy();
  });

  it("renders step descriptions", () => {
    renderWithLocale(<HowItWorks />);
    expect(screen.getByText(/analyze your domain, processes/i)).toBeTruthy();
    expect(screen.getByText(/Production-grade deployment/i)).toBeTruthy();
  });

  it("has the correct section id", () => {
    renderWithLocale(<HowItWorks />);
    expect(document.getElementById("how-it-works")).toBeTruthy();
  });
});
