import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Marquee from "../Marquee";

describe("Marquee", () => {
  it("renders four duplicated tracks for seamless scroll", () => {
    const { container } = render(<Marquee />);
    const track = container.querySelector(".marquee-track");
    expect(track).toBeTruthy();
    expect(track?.children.length).toBe(4);
  });

  it("includes key capability terms", () => {
    const { container } = render(<Marquee />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/Autonomous agents/);
    expect(text).toMatch(/Retrieval pipelines/);
  });
});
