import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OpsAISection from "../OpsAISection";

describe("OpsAISection", () => {
  it("renders the product section heading", () => {
    render(<OpsAISection />);
    expect(
      screen.getByRole("heading", { level: 2, name: /second brain/i })
    ).toBeTruthy();
  });

  it("renders four feature tiles", () => {
    const { container } = render(<OpsAISection />);
    expect(container.querySelectorAll(".opsai-feat .f").length).toBe(4);
  });

  it("links the Explore OpsAI CTA to /opsai", () => {
    render(<OpsAISection />);
    const link = screen.getByRole("link", { name: /explore opsai/i });
    expect(link.getAttribute("href")).toBe("/opsai");
  });
});
