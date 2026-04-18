import { describe, it, expect } from "vitest";
import Marquee from "../Marquee";
import { renderWithLocale } from "./testHelpers";

describe("Marquee", () => {
  it("renders four duplicated tracks for seamless scroll", () => {
    const { container } = renderWithLocale(<Marquee />);
    const track = container.querySelector(".marquee-track");
    expect(track).toBeTruthy();
    expect(track?.children.length).toBe(4);
  });

  it("includes key capability terms", () => {
    const { container } = renderWithLocale(<Marquee />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/Autonomous agents/);
    expect(text).toMatch(/Retrieval pipelines/);
  });

  it("localizes to Spanish terms", () => {
    const { container } = renderWithLocale(<Marquee />, { locale: "es" });
    expect(container.textContent ?? "").toMatch(/Agentes autónomos/);
  });
});
