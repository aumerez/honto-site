import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocaleProvider } from "@/context/LocaleContext";
import enDict from "@/locales/en.json";
import OnboardingWizard from "../OnboardingWizard";
import { EMPTY_ANSWERS } from "../schema";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/onboarding",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

const STORAGE_KEY = "honto-onboarding-v1";

function renderWizard() {
  return render(
    <LocaleProvider locale="en" dictionary={enDict}>
      <OnboardingWizard />
    </LocaleProvider>
  );
}

describe("OnboardingWizard", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders step 1 initially with the company profile fields", () => {
    renderWizard();
    expect(
      screen.getByRole("heading", { level: 2, name: /company profile/i })
    ).toBeTruthy();
    expect(screen.getByLabelText(/company name/i)).toBeTruthy();
    expect(screen.getByLabelText(/work email/i)).toBeTruthy();
  });

  it("blocks advancing and shows required errors when step 1 is empty", () => {
    renderWizard();
    const nextButton = screen.getByRole("button", { name: /^next$/i });
    fireEvent.click(nextButton);
    // Still on step 1
    expect(
      screen.getByRole("heading", { level: 2, name: /company profile/i })
    ).toBeTruthy();
    // Required errors are visible
    expect(
      screen.getAllByText(/this field is required/i).length
    ).toBeGreaterThan(0);
  });

  it("advances to step 2 after step 1 is filled with valid values", () => {
    renderWizard();

    fireEvent.change(screen.getByLabelText(/company name/i), {
      target: { value: "Honto Test Co" },
    });
    fireEvent.change(screen.getByLabelText(/contact name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/work email/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^industry/i), {
      target: { value: "tech" },
    });
    fireEvent.change(screen.getByLabelText(/company size/i), {
      target: { value: "51-200" },
    });

    const nextButton = screen.getByRole("button", { name: /^next$/i });
    fireEvent.click(nextButton);

    expect(
      screen.getByRole("heading", { level: 2, name: /current systems/i })
    ).toBeTruthy();
  });

  it("rejects an invalid email", () => {
    renderWizard();

    fireEvent.change(screen.getByLabelText(/company name/i), {
      target: { value: "Honto Test Co" },
    });
    fireEvent.change(screen.getByLabelText(/contact name/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText(/work email/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByLabelText(/^industry/i), {
      target: { value: "tech" },
    });
    fireEvent.change(screen.getByLabelText(/company size/i), {
      target: { value: "51-200" },
    });

    const nextButton = screen.getByRole("button", { name: /^next$/i });
    fireEvent.click(nextButton);

    // Email format error is shown; we did not advance
    expect(
      screen.getByRole("heading", { level: 2, name: /company profile/i })
    ).toBeTruthy();
    expect(
      screen.getByText(/please enter a valid email address/i)
    ).toBeTruthy();
  });

  it("restores answers and step from localStorage", () => {
    const persisted = {
      answers: {
        ...EMPTY_ANSWERS,
        step1: {
          ...EMPTY_ANSWERS.step1,
          companyName: "Persisted Co",
          contactName: "Restored User",
          email: "restored@example.com",
          industry: "tech",
          companySize: "51-200",
        },
      },
      step: 2,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

    renderWizard();

    expect(
      screen.getByRole("heading", { level: 2, name: /current systems/i })
    ).toBeTruthy();
  });

  it("shows the score when submitted from step 5", () => {
    const persisted = {
      answers: {
        ...EMPTY_ANSWERS,
        step1: {
          ...EMPTY_ANSWERS.step1,
          companyName: "Honto Demo",
          contactName: "Demo User",
          email: "demo@example.com",
          industry: "tech",
          companySize: "51-200",
        },
      },
      step: 5,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

    renderWizard();

    const submit = screen.getByRole("button", { name: /see your results/i });
    fireEvent.click(submit);

    expect(screen.getByText(/your ai readiness score/i)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /download your score/i })
    ).toBeTruthy();
  });

  it("clears persisted state when starting over", () => {
    const persisted = {
      answers: {
        ...EMPTY_ANSWERS,
        step1: {
          ...EMPTY_ANSWERS.step1,
          companyName: "Demo",
          contactName: "User",
          email: "u@example.com",
          industry: "tech",
          companySize: "51-200",
        },
      },
      step: 5,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

    renderWizard();
    fireEvent.click(screen.getByRole("button", { name: /see your results/i }));
    fireEvent.click(screen.getByRole("button", { name: /start over/i }));

    expect(
      screen.getByRole("heading", { level: 2, name: /company profile/i })
    ).toBeTruthy();
    expect(
      (screen.getByLabelText(/company name/i) as HTMLInputElement).value
    ).toBe("");
  });
});
