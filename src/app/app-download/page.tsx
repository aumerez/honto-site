import { headers } from "next/headers";
import { validateSessionAgainstBackend } from "@/lib/auth/session";
import LoginPanel from "./LoginPanel";
import DownloadPanel from "./DownloadPanel";

export const dynamic = "force-dynamic";

export default async function AppDownloadPage() {
  const requestHeaders = await headers();
  const request = new Request("http://internal/", { headers: requestHeaders });
  const session = await validateSessionAgainstBackend(request);

  return (
    <div className="noise-overlay relative min-h-[100dvh] overflow-hidden">
      <div className="grid-bg absolute inset-0 opacity-15" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full blur-[160px]"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-xl flex-col items-center justify-center px-5 py-16 md:px-8">
        <div className="mb-10 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              className="h-px w-8"
              style={{ background: "#f59e0b" }}
              aria-hidden="true"
            />
            <span
              className="font-mono text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "#f59e0b" }}
            >
              honto.ops
            </span>
            <span
              className="h-px w-8"
              style={{ background: "#f59e0b" }}
              aria-hidden="true"
            />
          </div>
          <h1 className="font-heading text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl">
            {session ? "Download the desktop app" : "Sign in to download"}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary md:text-base">
            {session
              ? "Your honto.ops account is signed in. Choose your platform below."
              : "Desktop installers are gated to honto.ops accounts. Sign in with the same credentials you use in the app."}
          </p>
        </div>

        <div className="w-full rounded-2xl border border-border bg-bg-card p-6 md:p-8">
          {session ? (
            <DownloadPanel email={session.user.email} />
          ) : (
            <LoginPanel />
          )}
        </div>
      </div>
    </div>
  );
}
