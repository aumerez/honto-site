"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.status === 429) {
        setError("Too many attempts. Please wait a minute and try again.");
        return;
      }
      if (!res.ok) {
        setError("Invalid email or password.");
        return;
      }
      router.refresh();
    } catch {
      setError("Could not reach the auth service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-sm font-medium text-text-secondary"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-1.5 block text-sm font-medium text-text-secondary"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder-text-muted outline-none transition-all focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
          placeholder="••••••••"
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
        className="w-full rounded-full py-3.5 text-base font-semibold text-bg transition-all hover:brightness-110 disabled:opacity-60"
        style={{ background: "#f59e0b" }}
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-xs text-text-muted">
        Need an account? Contact us to get access.
      </p>
    </form>
  );
}
