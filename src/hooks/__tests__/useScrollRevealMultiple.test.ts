import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useScrollRevealMultiple } from "../useScrollRevealMultiple";

describe("useScrollRevealMultiple", () => {
  it("returns a ref object", () => {
    const { result } = renderHook(() => useScrollRevealMultiple());
    expect(result.current).toHaveProperty("current");
    expect(result.current.current).toBeNull();
  });

  it("accepts custom threshold and stagger", () => {
    const { result } = renderHook(() => useScrollRevealMultiple(0.2, 200));
    expect(result.current).toHaveProperty("current");
  });
});
