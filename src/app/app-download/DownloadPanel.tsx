"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  email: string;
}

export default function DownloadPanel({ email }: Props) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // silent: cookies still cleared by the server handler when reachable;
      // otherwise the next request will re-evaluate session state.
    } finally {
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-text-secondary">
        Signed in as <span className="text-text-primary">{email}</span>.
      </p>

      <p className="text-center text-sm leading-relaxed text-text-secondary">
        Select your operating system to start downloading the latest installer.
      </p>

      <div className="grid gap-3">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/downloads/win"
          className="flex items-center justify-center gap-3 rounded-full border border-border bg-surface py-3.5 text-base font-semibold text-text-primary transition-all hover:border-amber-500/40 hover:text-amber-300"
        >
          Download for Windows
        </a>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/downloads/mac"
          className="flex items-center justify-center gap-3 rounded-full border border-border bg-surface py-3.5 text-base font-semibold text-text-primary transition-all hover:border-amber-500/40 hover:text-amber-300"
        >
          Download for macOS
        </a>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="block w-full text-center text-xs text-text-muted underline-offset-2 transition-colors hover:text-text-secondary hover:underline disabled:opacity-60"
      >
        {loggingOut ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}
