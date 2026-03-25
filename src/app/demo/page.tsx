"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

/* ──────────────────────────────────────────────
   i18n — default Spanish, English if browser says so
   ────────────────────────────────────────────── */

const copy = {
  es: {
    /* Hero */
    headline: "Inteligencia operacional para tu empresa petrolera",
    sub: "OpsAI captura el conocimiento de tus ingenieros y lo convierte en un sistema accesible para toda tu organización.",

    /* Q&A */
    qaTitle: "Preguntas que tu empresa deberia hacerse",
    q1: "¿Tu equipo aprovecha todo el conocimiento acumulado en cada proyecto?",
    a1: "OpsAI centraliza cada documento, reporte y conversación en un solo sistema buscable. Nada se pierde, todo se reutiliza.",
    q2: "¿Cuánto has pagado dos veces por el mismo análisis?",
    a2: "OpsAI detecta análisis previos y los conecta con proyectos nuevos. Cada análisis se hace una sola vez.",
    q3: "Cuando se va un buen ingeniero, ¿cómo retienes lo que sabe?",
    a3: "OpsAI captura el razonamiento experto antes de que se vaya. El conocimiento queda en la empresa, no en la persona.",
    q4: "¿Cuánto tiempo pierde un ingeniero nuevo buscando información que ya existe?",
    a4: "OpsAI da acceso al historial completo desde el día uno. Meses de aprendizaje comprimidos en segundos.",
    q5: "¿Tus lecciones aprendidas realmente llegan al siguiente pozo?",
    a5: "OpsAI conecta automáticamente incidentes y soluciones entre campos. Cada operación mejora la siguiente.",

    /* Form */
    formTitle: "Agenda una demo de 15 minutos",
    formSub: "Sin compromiso. Te mostramos cómo funciona con tus datos.",
    labelName: "Nombre",
    labelEmail: "Correo electrónico",
    labelPhone: "Teléfono",
    labelCompany: "Empresa",
    labelRole: "Rol",
    placeholderName: "Tu nombre completo",
    placeholderEmail: "tu@empresa.com",
    placeholderPhone: "+52 55 1234 5678",
    placeholderCompany: "Nombre de la empresa",
    roleDefault: "Selecciona tu rol",
    roleOperator: "Operador",
    roleEngineer: "Ingeniero",
    roleManager: "Gerente / Superintendente",
    roleExec: "Director / VP / C-Level",
    roleOther: "Otro",
    submit: "Agendar Demo",
    submitting: "Enviando...",
    successTitle: "Listo — te contactamos pronto",
    successMsg:
      "Nuestro equipo se comunicará contigo en menos de 24 horas para coordinar tu demo personalizada.",
    errorGeneric: "Algo salió mal. Intenta de nuevo.",
    errorNetwork: "Error de red. Intenta de nuevo.",
    disclaimer: "Sin compromiso. Respondemos en menos de 24 horas.",
  },
  en: {
    headline: "Operational intelligence for your petroleum company",
    sub: "OpsAI captures your engineers' knowledge and turns it into a system accessible to your entire organization.",

    qaTitle: "Questions your company should be asking",
    q1: "Is your team leveraging all accumulated knowledge on every project?",
    a1: "OpsAI centralizes every document, report, and conversation into one searchable system. Nothing is lost, everything is reused.",
    q2: "How much have you paid twice for the same analysis?",
    a2: "OpsAI detects prior analyses and connects them to new projects. Every analysis is done once.",
    q3: "When a great engineer leaves, how do you retain what they know?",
    a3: "OpsAI captures expert reasoning before they leave. Knowledge stays in the company, not the person.",
    q4: "How much time does a new engineer waste searching for information that already exists?",
    a4: "OpsAI gives access to the full history from day one. Months of learning compressed into seconds.",
    q5: "Do your lessons learned actually reach the next well?",
    a5: "OpsAI automatically connects incidents and solutions across fields. Every operation improves the next.",

    formTitle: "Book a 15-minute demo",
    formSub: "No commitment. We'll show you how it works with your data.",
    labelName: "Name",
    labelEmail: "Email",
    labelPhone: "Phone",
    labelCompany: "Company",
    labelRole: "Role",
    placeholderName: "Your full name",
    placeholderEmail: "you@company.com",
    placeholderPhone: "+1 555 123 4567",
    placeholderCompany: "Company name",
    roleDefault: "Select your role",
    roleOperator: "Operator",
    roleEngineer: "Engineer",
    roleManager: "Manager / Superintendent",
    roleExec: "Director / VP / C-Level",
    roleOther: "Other",
    submit: "Book Demo",
    submitting: "Sending...",
    successTitle: "Done — we'll be in touch",
    successMsg:
      "Our team will reach out within 24 hours to schedule your personalized demo.",
    errorGeneric: "Something went wrong. Please try again.",
    errorNetwork: "Network error. Please try again.",
    disclaimer: "No commitment. We respond within 24 hours.",
  },
} as const;

type Lang = keyof typeof copy;

function detectLang(): Lang {
  if (typeof navigator === "undefined") return "es";
  const langs = navigator.languages ?? [navigator.language];
  for (const l of langs) {
    if (l.startsWith("en")) return "en";
  }
  return "es";
}

/* ──────────────────────────────────────────────
   Landing Page
   ────────────────────────────────────────────── */

export default function DemoPage() {
  const [lang, setLang] = useState<Lang>("es");
  const t = useMemo(() => copy[lang], [lang]);

  useEffect(() => {
    setLang(detectLang());
  }, []);

  /* Form state */
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
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
          subject: `OpsAI Demo Request — ${form.name} (${form.company})`,
          from_name: "OpsAI Landing Page",
          name: form.name,
          email: form.email,
          phone: form.phone || "Not provided",
          company: form.company,
          role: form.role || "Not specified",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(t.errorGeneric);
      }
    } catch {
      setError(t.errorNetwork);
    } finally {
      setSubmitting(false);
    }
  };

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((s) => ({ ...s, [field]: e.target.value }));

  const questions = [
    { q: t.q1, a: t.a1 },
    { q: t.q2, a: t.a2 },
    { q: t.q3, a: t.a3 },
    { q: t.q4, a: t.a4 },
    { q: t.q5, a: t.a5 },
  ];

  const roles = [
    { value: "", label: t.roleDefault },
    { value: "operator", label: t.roleOperator },
    { value: "engineer", label: t.roleEngineer },
    { value: "manager", label: t.roleManager },
    { value: "executive", label: t.roleExec },
    { value: "other", label: t.roleOther },
  ];

  return (
    <div className="noise-overlay relative min-h-[100dvh] overflow-hidden">
      {/* Background */}
      <div className="grid-bg absolute inset-0 opacity-15" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full blur-[160px]"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* ── Header: Logo + lang toggle ── */}
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-5 pt-8 md:px-8">
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tight text-text-primary md:text-2xl"
          aria-label="Honto — Home"
        >
          honto<span style={{ color: "#f59e0b" }}>.</span>
        </Link>
        <button
          type="button"
          onClick={() => setLang((l) => (l === "es" ? "en" : "es"))}
          className="rounded-full border border-border px-3 py-1.5 font-mono text-xs font-medium text-text-muted transition-colors hover:border-amber-500/40 hover:text-amber-400"
          aria-label="Switch language"
        >
          {lang === "es" ? "EN" : "ES"}
        </button>
      </header>

      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-20 pt-16 md:px-8 md:pt-20">
        {/* ═══════════════════════════════════════════
            1. HERO — One headline, one sentence
        ═══════════════════════════════════════════ */}
        <section className="animate-fade-in-up mb-24 max-w-3xl md:mb-32">
          <div className="mb-5 flex items-center gap-3">
            <span
              className="h-px w-8"
              style={{ background: "#f59e0b" }}
              aria-hidden="true"
            />
            <span
              className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "#f59e0b" }}
            >
              OpsAI
            </span>
          </div>
          <h1 className="font-heading text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {t.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
            {t.sub}
          </p>
        </section>

        {/* ═══════════════════════════════════════════
            2. PAIN-POINT QUESTIONS
        ═══════════════════════════════════════════ */}
        <section className="mb-24 md:mb-32" aria-labelledby="qa-heading">
          <h2
            id="qa-heading"
            className="mb-12 font-heading text-2xl font-bold tracking-tight md:text-3xl"
          >
            {t.qaTitle}
          </h2>

          <div className="flex flex-col gap-6">
            {questions.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-bg-card p-6 transition-all duration-300 hover:border-amber-500/20 md:p-8"
              >
                <p className="font-heading text-base font-semibold leading-snug md:text-lg">
                  {item.q}
                </p>
                <div className="mt-4 flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "rgba(245,158,11,0.15)" }}
                    aria-hidden="true"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <p
                    className="text-sm leading-relaxed md:text-base"
                    style={{ color: "#fbbf24" }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            3. LEAD CAPTURE FORM
        ═══════════════════════════════════════════ */}
        <section className="mx-auto max-w-xl" aria-labelledby="form-heading">
          <div className="rounded-2xl border border-border bg-bg-card p-6 md:p-10">
            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: "rgba(245,158,11,0.12)" }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold">
                  {t.successTitle}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {t.successMsg}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <h2
                    id="form-heading"
                    className="font-heading text-2xl font-bold tracking-tight"
                  >
                    {t.formTitle}
                  </h2>
                  <p className="mt-2 text-sm text-text-secondary">
                    {t.formSub}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="demo-name"
                      className="mb-1.5 block text-sm font-medium text-text-secondary"
                    >
                      {t.labelName} *
                    </label>
                    <input
                      id="demo-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={set("name")}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                      placeholder={t.placeholderName}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="demo-email"
                      className="mb-1.5 block text-sm font-medium text-text-secondary"
                    >
                      {t.labelEmail} *
                    </label>
                    <input
                      id="demo-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={set("email")}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                      placeholder={t.placeholderEmail}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="demo-phone"
                      className="mb-1.5 block text-sm font-medium text-text-secondary"
                    >
                      {t.labelPhone}
                    </label>
                    <input
                      id="demo-phone"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                      placeholder={t.placeholderPhone}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label
                      htmlFor="demo-company"
                      className="mb-1.5 block text-sm font-medium text-text-secondary"
                    >
                      {t.labelCompany} *
                    </label>
                    <input
                      id="demo-company"
                      type="text"
                      required
                      value={form.company}
                      onChange={set("company")}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                      placeholder={t.placeholderCompany}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label
                      htmlFor="demo-role"
                      className="mb-1.5 block text-sm font-medium text-text-secondary"
                    >
                      {t.labelRole}
                    </label>
                    <select
                      id="demo-role"
                      value={form.role}
                      onChange={set("role")}
                      className="w-full appearance-none rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                    >
                      {roles.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p className="rounded-lg bg-danger/10 px-4 py-2.5 text-center text-sm text-danger">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full py-3.5 text-base font-semibold text-bg transition-all hover:brightness-110 disabled:opacity-60"
                    style={{
                      background: "#f59e0b",
                      boxShadow: "0 0 0 rgba(245,158,11,0)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 32px rgba(245,158,11,0.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.boxShadow =
                        "0 0 0 rgba(245,158,11,0)")
                    }
                  >
                    {submitting ? t.submitting : t.submit}
                  </button>

                  <p className="text-center text-xs text-text-muted">
                    {t.disclaimer}
                  </p>
                </form>
              </>
            )}
          </div>
        </section>

        {/* ── Minimal footer ── */}
        <footer className="mt-16 border-t border-border pt-8 text-center text-xs text-text-muted">
          &copy; {new Date().getFullYear()} Honto. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
