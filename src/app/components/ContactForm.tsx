"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "@/context/LocaleContext";

type Status = "idle" | "submitting" | "success" | "error";

type ContactFormCopy = {
  nameLabel: string;
  emailLabel: string;
  companyLabel: string;
  phoneLabel: string;
  requestLabel: string;
  submit: string;
  submitting: string;
  successEyebrow: string;
  successBody: string;
  sendAnother: string;
  errorFallback: string;
};

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocale();
  const copy = (t.landing as { contactForm: ContactFormCopy }).contactForm;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      phone: String(data.get("phone") ?? ""),
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
        throw new Error(body?.error ?? copy.errorFallback);
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : copy.errorFallback);
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form-success" role="status" aria-live="polite">
        <div className="eyebrow" style={{ marginBottom: 16 }}>
          {copy.successEyebrow}
        </div>
        <p>{copy.successBody}</p>
        <button
          type="button"
          className="btn"
          style={{ marginTop: 24 }}
          onClick={() => setStatus("idle")}
        >
          {copy.sendAnother}
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <label className="contact-field">
        <span className="contact-field-label">{copy.nameLabel}</span>
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
        <span className="contact-field-label">{copy.emailLabel}</span>
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
        <span className="contact-field-label">{copy.companyLabel}</span>
        <input
          name="company"
          type="text"
          maxLength={160}
          autoComplete="organization"
          disabled={submitting}
        />
      </label>

      <label className="contact-field">
        <span className="contact-field-label">{copy.phoneLabel}</span>
        <input
          name="phone"
          type="tel"
          inputMode="numeric"
          pattern="\d{7,15}"
          maxLength={15}
          autoComplete="tel"
          disabled={submitting}
        />
      </label>

      <label className="contact-field">
        <span className="contact-field-label">{copy.requestLabel}</span>
        <textarea
          name="message"
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
        {submitting ? copy.submitting : copy.submit}
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
