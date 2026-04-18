"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-success" role="status" aria-live="polite">
        <div className="eyebrow" style={{ marginBottom: 16 }}>
          [Received]
        </div>
        <p>
          Thanks — your message is in. Someone from engineering will be in touch
          within 24 hours.
        </p>
        <button
          type="button"
          className="btn"
          style={{ marginTop: 24 }}
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <label className="contact-field">
        <span className="contact-field-label">Name</span>
        <input
          name="name"
          type="text"
          required
          maxLength={120}
          autoComplete="name"
          disabled={submitting}
        />
      </label>

      <label className="contact-field">
        <span className="contact-field-label">Email</span>
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          disabled={submitting}
        />
      </label>

      <label className="contact-field">
        <span className="contact-field-label">Company</span>
        <input
          name="company"
          type="text"
          maxLength={160}
          autoComplete="organization"
          disabled={submitting}
        />
      </label>

      <label className="contact-field">
        <span className="contact-field-label">Problem</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={5000}
          disabled={submitting}
        />
      </label>

      {status === "error" && error ? (
        <p className="contact-form-error" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="btn primary"
        style={{ alignSelf: "flex-start", marginTop: 8 }}
        disabled={submitting}
      >
        {submitting ? "Sending…" : "Send message"}
        <svg
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1 5h12m0 0L9 1m4 4L9 9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </form>
  );
}
