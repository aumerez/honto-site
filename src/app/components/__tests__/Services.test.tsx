import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Services from "../Services";

describe("Services", () => {
  it("renders the section heading", () => {
    render(<Services />);
    expect(
      screen.getByRole("heading", { name: /from strategy through production/i })
    ).toBeTruthy();
  });

  it("renders all four practice areas", () => {
    render(<Services />);
    expect(screen.getByText("Strategy & Architecture")).toBeTruthy();
    expect(screen.getByText("Agent Systems")).toBeTruthy();
    expect(screen.getByText("Knowledge Systems & RAG")).toBeTruthy();
    expect(screen.getByText("Custom AI Modules")).toBeTruthy();
  });

  it("renders practice descriptions", () => {
    render(<Services />);
    expect(screen.getByText(/Assessing your operations/i)).toBeTruthy();
  });

  it("has the correct section id", () => {
    render(<Services />);
    expect(document.getElementById("services")).toBeTruthy();
  });

  it("uses aria-labelledby for the section", () => {
    render(<Services />);
    const section = document.getElementById("services");
    expect(section?.getAttribute("aria-labelledby")).toBe("services-heading");
  });
});
