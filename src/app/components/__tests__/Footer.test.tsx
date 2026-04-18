import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders the contentinfo role", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });

  it("renders the copyright and tagline", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Honto/)).toBeTruthy();
    expect(screen.getByText(/enterprise second brain/i)).toBeTruthy();
  });

  it("renders locations and language tokens", () => {
    render(<Footer />);
    expect(screen.getByText(/Palo Alto, CA/)).toBeTruthy();
    expect(screen.getByText(/EN · ES/)).toBeTruthy();
  });
});
