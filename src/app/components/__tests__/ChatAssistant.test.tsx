import { screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithLocale } from "@/test-utils/renderWithLocale";
import ChatAssistant from "../ChatAssistant";

describe("ChatAssistant", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the toggle button", () => {
    renderWithLocale(<ChatAssistant />);
    expect(screen.getByLabelText("Open chat assistant")).toBeTruthy();
  });

  it("opens the chat panel when toggle is clicked", () => {
    renderWithLocale(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText("Open chat assistant"));

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Honto AI")).toBeTruthy();
  });

  it("shows welcome message when opened", () => {
    renderWithLocale(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText("Open chat assistant"));

    expect(screen.getByText(/Honto's AI assistant/i)).toBeTruthy();
  });

  it("shows quick action buttons initially", () => {
    renderWithLocale(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText("Open chat assistant"));

    expect(screen.getByText("What services do you offer?")).toBeTruthy();
    expect(screen.getByText("Can I book a demo?")).toBeTruthy();
    expect(screen.getByText("How do you implement AI?")).toBeTruthy();
  });

  it("sends a user message via input", () => {
    renderWithLocale(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText("Open chat assistant"));

    const input = screen.getByLabelText("Ask anything...");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.submit(input.closest("form")!);

    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("shows typing indicator after sending a message", () => {
    renderWithLocale(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText("Open chat assistant"));

    const input = screen.getByLabelText("Ask anything...");
    fireEvent.change(input, {
      target: { value: "What services do you offer?" },
    });
    fireEvent.submit(input.closest("form")!);

    expect(document.querySelector(".animate-typing")).toBeTruthy();
  });

  it("receives a response about services", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    renderWithLocale(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText("Open chat assistant"));

    const input = screen.getByLabelText("Ask anything...");
    fireEvent.change(input, {
      target: { value: "What services do you offer?" },
    });
    fireEvent.submit(input.closest("form")!);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/five core services/i)).toBeTruthy();
  });

  it("receives a response about booking", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    renderWithLocale(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText("Open chat assistant"));

    const input = screen.getByLabelText("Ask anything...");
    fireEvent.change(input, {
      target: { value: "Can I book a demo?" },
    });
    fireEvent.submit(input.closest("form")!);

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/happy to help you book/i)).toBeTruthy();
  });

  it("hides quick actions after first user message", () => {
    renderWithLocale(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText("Open chat assistant"));

    expect(screen.getByText("What services do you offer?")).toBeTruthy();

    const input = screen.getByLabelText("Ask anything...");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.submit(input.closest("form")!);

    expect(
      screen.queryByRole("button", { name: "What services do you offer?" })
    ).toBeNull();
  });

  it("closes the chat panel", () => {
    renderWithLocale(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText("Open chat assistant"));
    expect(screen.getByLabelText("Close chat")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Close chat"));
    expect(screen.getByLabelText("Open chat assistant")).toBeTruthy();
  });

  it("disables input while typing indicator is active", () => {
    renderWithLocale(<ChatAssistant />);
    fireEvent.click(screen.getByLabelText("Open chat assistant"));

    const input = screen.getByLabelText("Ask anything...") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.submit(input.closest("form")!);

    expect(input.disabled).toBe(true);
  });
});
