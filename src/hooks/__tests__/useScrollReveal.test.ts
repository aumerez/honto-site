import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useScrollReveal } from "../useScrollReveal";

describe("useScrollReveal", () => {
  it("returns a ref object", () => {
    const { result } = renderHook(() => useScrollReveal());
    expect(result.current).toHaveProperty("current");
    expect(result.current.current).toBeNull();
  });

  it("accepts a custom threshold", () => {
    const { result } = renderHook(() => useScrollReveal(0.5));
    expect(result.current).toHaveProperty("current");
  });
});
