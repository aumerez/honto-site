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
    expect(document.querySelector('input[name="phone"]')).toBeTruthy();
    expect(document.querySelector('textarea[name="message"]')).toBeTruthy();
    expect(
      document
        .querySelector('textarea[name="message"]')
        ?.hasAttribute("required")
    ).toBe(false);
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
    const phoneInput = document.querySelector(
      'input[name="phone"]'
    ) as HTMLInputElement;
    const messageInput = document.querySelector(
      'textarea[name="message"]'
    ) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "Ada Lovelace" } });
    fireEvent.change(emailInput, { target: { value: "ada@example.com" } });
    fireEvent.change(companyInput, { target: { value: "Analytical Engine" } });
    fireEvent.change(phoneInput, { target: { value: "+1 555 123 4567" } });
    fireEvent.change(messageInput, {
      target: { value: "Need help shipping." },
    });

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
      phone: "+1 555 123 4567",
      message: "Need help shipping.",
    });
  });

  it("shows an error message when the API responds with an error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({ error: "Email service is not configured." }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          )
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
    fireEvent.change(nameInput, { target: { value: "Grace" } });
    fireEvent.change(emailInput, { target: { value: "grace@example.com" } });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });

    expect(screen.getByRole("alert").textContent).toContain(
      "Email service is not configured."
    );
  });

  it("submits successfully with only name + email (all optional fields blank)", async () => {
    render(<Contact />);

    fireEvent.change(document.querySelector('input[name="name"]')!, {
      target: { value: "Solo" },
    });
    fireEvent.change(document.querySelector('input[name="email"]')!, {
      target: { value: "solo@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/your message is in/i)).toBeTruthy();
    });

    const init = (fetch as unknown as { mock: { calls: unknown[][] } }).mock
      .calls[0][1] as RequestInit;
    expect(JSON.parse(init.body as string)).toEqual({
      name: "Solo",
      email: "solo@example.com",
      company: "",
      phone: "",
      message: "",
    });
  });

  it('disables the submit button and shows "Sending…" while the request is in flight', async () => {
    let resolve: (value: Response) => void = () => {};
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((r) => {
            resolve = r;
          })
      )
    );

    render(<Contact />);
    fireEvent.change(document.querySelector('input[name="name"]')!, {
      target: { value: "Grace" },
    });
    fireEvent.change(document.querySelector('input[name="email"]')!, {
      target: { value: "grace@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    const submitting = await screen.findByRole("button", { name: /sending/i });
    expect(submitting).toHaveProperty("disabled", true);
    expect(document.querySelector('input[name="name"]')).toHaveProperty(
      "disabled",
      true
    );

    resolve(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    await waitFor(() => {
      expect(screen.getByText(/your message is in/i)).toBeTruthy();
    });
  });

  it("resets to the idle form when 'Send another' is clicked after success", async () => {
    render(<Contact />);
    fireEvent.change(document.querySelector('input[name="name"]')!, {
      target: { value: "Ada" },
    });
    fireEvent.change(document.querySelector('input[name="email"]')!, {
      target: { value: "ada@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/your message is in/i)).toBeTruthy();
    });

    fireEvent.click(screen.getByRole("button", { name: /send another/i }));

    expect(screen.getByRole("button", { name: /send message/i })).toBeTruthy();
    expect(document.querySelector('input[name="name"]')).toBeTruthy();
  });

  it("surfaces an error when fetch itself rejects (network failure)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network request failed")))
    );

    render(<Contact />);
    fireEvent.change(document.querySelector('input[name="name"]')!, {
      target: { value: "Ada" },
    });
    fireEvent.change(document.querySelector('input[name="email"]')!, {
      target: { value: "ada@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
    expect(screen.getByRole("alert").textContent).toContain(
      "Network request failed"
    );
  });
});
