import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CallToAction from "../CallToAction";

describe("CallToAction", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the section heading", () => {
    render(<CallToAction />);
    expect(screen.getByText(/Ready to build/i)).toBeTruthy();
    expect(screen.getByText(/serious AI systems/i)).toBeTruthy();
  });

  it("renders the form with all fields", () => {
    render(<CallToAction />);
    expect(screen.getByLabelText("Name")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByLabelText("Company")).toBeTruthy();
    expect(
      screen.getByLabelText("What are you looking to build?")
    ).toBeTruthy();
  });

  it("renders the submit button", () => {
    render(<CallToAction />);
    expect(
      screen.getByRole("button", { name: /book a discovery call/i })
    ).toBeTruthy();
  });

  it("renders benefit list items", () => {
    render(<CallToAction />);
    expect(
      screen.getByText("30-minute technical discovery session")
    ).toBeTruthy();
    expect(
      screen.getByText("Custom assessment of AI opportunities")
    ).toBeTruthy();
    expect(
      screen.getByText("No-commitment, no-fluff conversation")
    ).toBeTruthy();
  });

  it("updates form fields on input", () => {
    render(<CallToAction />);
    const nameInput = screen.getByLabelText("Name") as HTMLInputElement;
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });

    expect(nameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@example.com");
  });

  it("shows success message after successful submission", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    } as Response);

    render(<CallToAction />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@test.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /book a discovery call/i }));

    await waitFor(() => {
      expect(screen.getByText("We'll be in touch")).toBeTruthy();
    });
  });

  it("shows error message on failed submission", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false }),
    } as Response);

    render(<CallToAction />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@test.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /book a discovery call/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Something went wrong. Please try again.")
      ).toBeTruthy();
    });
  });

  it("shows network error on fetch failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("Network"));

    render(<CallToAction />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "jane@test.com" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /book a discovery call/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Network error. Please try again.")
      ).toBeTruthy();
    });
  });

  it("has the correct section id", () => {
    render(<CallToAction />);
    expect(document.getElementById("contact")).toBeTruthy();
  });
});
