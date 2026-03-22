"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLocale } from "@/context/LocaleContext";

export default function CallToAction() {
  const { t } = useLocale();
  const c = t.callToAction;
  const sectionRef = useScrollReveal<HTMLElement>();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: `New discovery call request from ${formState.name}`,
          from_name: "Honto Website",
          name: formState.name,
          email: formState.email,
          company: formState.company || "Not provided",
          message: formState.message || "No details provided",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(c.errorGeneric);
      }
    } catch {
      setError(c.errorNetwork);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="reveal relative overflow-hidden py-24 md:py-32"
      aria-labelledby="contact-heading"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-bg via-bg-elevated to-bg"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/3 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Copy */}
          <div>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {c.eyebrow}
            </span>
            <h2
              id="contact-heading"
              className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
            >
              {c.headingLine1}
              <br />
              <span className="gradient-text">{c.headingLine2}</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-text-secondary">
              {c.description}
            </p>

            <div className="mt-10 space-y-5">
              {[c.bullet1, c.bullet2, c.bullet3].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-accent"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="rounded-2xl border border-border bg-bg-card p-6 md:p-8">
            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold">
                  {c.successTitle}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {c.successMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-text-secondary"
                  >
                    {c.labelName}
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
                    placeholder={c.placeholderName}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-text-secondary"
                  >
                    {c.labelEmail}
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, email: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
                    placeholder={c.placeholderEmail}
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="mb-1.5 block text-sm font-medium text-text-secondary"
                  >
                    {c.labelCompany}
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formState.company}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, company: e.target.value }))
                    }
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
                    placeholder={c.placeholderCompany}
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium text-text-secondary"
                  >
                    {c.labelMessage}
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formState.message}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, message: e.target.value }))
                    }
                    className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
                    placeholder={c.placeholderMessage}
                  />
                </div>
                {error && (
                  <p className="rounded-lg bg-danger/10 px-4 py-2.5 text-center text-sm text-danger">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-accent py-3.5 text-base font-semibold text-bg transition-all hover:shadow-[0_0_32px_var(--color-accent-glow)] hover:brightness-110 disabled:opacity-60"
                >
                  {submitting ? c.submitting : c.submitButton}
                </button>
                <p className="text-center text-xs text-text-muted">
                  {c.disclaimer}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
