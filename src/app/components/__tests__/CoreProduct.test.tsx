import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CoreProduct from "../CoreProduct";

describe("CoreProduct", () => {
  it("renders the section heading", () => {
    render(<CoreProduct />);
    expect(screen.getByText("The Expert")).toBeTruthy();
    expect(screen.getByText("Intelligence Platform")).toBeTruthy();
  });

  it("renders all four feature cards", () => {
    render(<CoreProduct />);
    expect(screen.getByText("Knowledge Capture")).toBeTruthy();
    expect(screen.getByText("Consistent Expertise")).toBeTruthy();
    expect(screen.getByText("Decision Support")).toBeTruthy();
    expect(screen.getByText("Scale Expertise")).toBeTruthy();
  });

  it("renders feature descriptions", () => {
    render(<CoreProduct />);
    expect(
      screen.getByText(/Automatically extract and structure/i)
    ).toBeTruthy();
  });

  it("renders the Learn more link", () => {
    render(<CoreProduct />);
    expect(screen.getByText("Learn more")).toBeTruthy();
  });

  it("has the correct section id", () => {
    render(<CoreProduct />);
    expect(document.getElementById("product")).toBeTruthy();
  });
});
