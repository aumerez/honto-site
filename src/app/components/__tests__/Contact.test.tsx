import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Contact from "../Contact";

describe("Contact", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        )
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the contact metadata rows", () => {
    render(<Contact />);
    const meta = document.querySelector(".contact-meta");
    expect(meta).toBeTruthy();
    expect(meta?.textContent).toContain("Email");
    expect(meta?.textContent).toContain("Response");
    expect(meta?.textContent).toContain("Routing");
    expect(meta?.textContent).toContain("NDA");
    expect(meta?.textContent).toContain("info@honto.ai");
  });

  it("renders the lead capture form fields", () => {
    render(<Contact />);
    expect(document.querySelector('input[name="name"]')).toBeTruthy();
    expect(document.querySelector('input[name="email"]')).toBeTruthy();
    expect(document.querySelector('input[name="company"]')).toBeTruthy();
    expect(document.querySelector('textarea[name="message"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: /send message/i })).toBeTruthy();
  });

  it("submits the form to /api/contact and shows a success state", async () => {
    render(<Contact />);

    const nameInput = document.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement;
    const emailInput = document.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    const companyInput = document.querySelector(
      'input[name="company"]'
    ) as HTMLInputElement;
    const messageInput = document.querySelector(
      'textarea[name="message"]'
    ) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "Ada Lovelace" } });
    fireEvent.change(emailInput, { target: { value: "ada@example.com" } });
    fireEvent.change(companyInput, { target: { value: "Analytical Engine" } });
    fireEvent.change(messageInput, { target: { value: "Need help shipping." } });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/your message is in/i)).toBeTruthy();
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" })
    );
    const call = (fetch as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0];
    const init = call[1] as RequestInit;
    expect(JSON.parse(init.body as string)).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      company: "Analytical Engine",
      message: "Need help shipping.",
    });
  });

  it("shows an error message when the API responds with an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ error: "Email service is not configured." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          })
        )
      )
    );

    render(<Contact />);
    const emailInput = document.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    const nameInput = document.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement;
    const messageInput = document.querySelector(
      'textarea[name="message"]'
    ) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "Grace" } });
    fireEvent.change(emailInput, { target: { value: "grace@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hello." } });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });

    expect(screen.getByRole("alert").textContent).toContain(
      "Email service is not configured."
    );
  });
});
