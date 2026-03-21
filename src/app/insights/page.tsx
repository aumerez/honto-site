import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Insights — Honto",
  description:
    "Technical writing on AI systems engineering, infrastructure, and operational patterns.",
};

export default function Insights() {
  return (
    <>
      <Navigation />
      <main>
        <section className="relative bg-bg-elevated pt-36 pb-20 md:pt-44 md:pb-28">
          <div
            className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-teal/20 to-transparent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-6 md:px-8">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
              Writing
            </p>
            <h1 className="mt-4 font-display text-fluid-xl font-medium italic">
              Insights
            </h1>
            <p className="mt-6 max-w-xl text-fluid-body text-text-secondary">
              Technical writing on AI systems engineering, infrastructure
              patterns, and lessons from production.
            </p>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="rounded-2xl border border-border bg-bg-card p-8 md:p-12">
              <p className="font-display text-xl font-medium italic text-text-secondary">
                Coming soon
              </p>
              <p className="mt-3 text-base leading-relaxed text-text-muted">
                We are preparing our first publications on agent governance, AI
                infrastructure patterns, and engineering practices for
                production AI systems.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
