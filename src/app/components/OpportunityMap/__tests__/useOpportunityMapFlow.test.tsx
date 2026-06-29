import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useOpportunityMapFlow } from "../useOpportunityMapFlow";
import { STORAGE_KEY } from "../storage";

describe("useOpportunityMapFlow", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("hydrates to LANDING on first load", () => {
    const { result } = renderHook(() => useOpportunityMapFlow());
    expect(result.current.hydrated).toBe(true);
    expect(result.current.flowState).toBe("LANDING");
    expect(result.current.progress).toBe(0);
  });

  it("starts and steps forward and back", () => {
    const { result } = renderHook(() => useOpportunityMapFlow());
    act(() => result.current.start());
    expect(result.current.flowState).toBe("BUSINESS_CONTEXT");
    expect(result.current.progress).toBeGreaterThan(0);
    act(() => result.current.next());
    expect(result.current.flowState).toBe("BUSINESS_GOALS");
    act(() => result.current.back());
    expect(result.current.flowState).toBe("BUSINESS_CONTEXT");
  });

  it("skips the tech stack and lands on the contact gate", () => {
    const { result } = renderHook(() => useOpportunityMapFlow());
    act(() => result.current.start());
    for (let i = 0; i < 5; i++) act(() => result.current.next());
    expect(result.current.flowState).toBe("SYSTEM_LANDSCAPE");
    act(() => result.current.skipTech());
    expect(result.current.flowState).toBe("CONTACT_GATE");
    expect(result.current.techSkipped).toBe(true);
    expect(result.current.answers.techStack).toBeNull();
  });

  it("records answers and section completion via patch", () => {
    const { result } = renderHook(() => useOpportunityMapFlow());
    act(() =>
      result.current.patch("company", {
        companyName: "Acme",
        industry: "tech",
        companySize: "51-200",
        stage: "scaling",
        mainPressure: "growth",
      })
    );
    expect(result.current.completion.BUSINESS_CONTEXT).toBe(true);
    expect(result.current.completedSections).toBe(1);
    // Company name carries onto the contact record (never re-asked).
    expect(result.current.answers.contact.company).toBe("Acme");
  });

  it("offers resume after remount and resumes to the saved state", () => {
    const first = renderHook(() => useOpportunityMapFlow());
    act(() => first.result.current.start());
    act(() => first.result.current.next());
    expect(first.result.current.flowState).toBe("BUSINESS_GOALS");
    first.unmount();

    const second = renderHook(() => useOpportunityMapFlow());
    // Lands on LANDING with a resume option, rather than auto-jumping.
    expect(second.result.current.flowState).toBe("LANDING");
    expect(second.result.current.hasSavedProgress).toBe(true);
    act(() => second.result.current.resume());
    expect(second.result.current.flowState).toBe("BUSINESS_GOALS");
  });

  it("starts over and resets to a fresh landing session", () => {
    const { result } = renderHook(() => useOpportunityMapFlow());
    act(() => result.current.start());
    act(() =>
      result.current.patch("company", { companyName: "Acme", industry: "tech" })
    );
    act(() => result.current.startOver());
    expect(result.current.flowState).toBe("LANDING");
    expect(result.current.completedSections).toBe(0);
    expect(result.current.answers.company.companyName).toBe("");
    // Saved progress is cleared.
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
