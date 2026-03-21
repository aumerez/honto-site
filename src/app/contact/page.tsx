import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Contact — Honto",
  description: "Get in touch with Honto for AI systems engineering work.",
};

export default function Contact() {
  return (
    <>
      <Navigation />
      <main>
        <section className="relative bg-bg-elevated pt-36 pb-20 md:pt-44 md:pb-28">
          <div
            className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-6 md:px-8">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
              Contact
            </p>
            <h1 className="mt-4 font-display text-fluid-xl font-medium italic">
              Get in touch
            </h1>
            <p className="mt-6 max-w-xl text-fluid-body text-text-secondary">
              For project inquiries or general questions, reach out directly.
            </p>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="max-w-xl">
              <div className="rounded-2xl border border-border bg-bg-card p-8 md:p-12">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  Email
                </p>
                <a
                  href="mailto:hello@honto.ai"
                  className="mt-4 inline-block font-display text-2xl font-medium italic text-text-primary transition-colors hover:text-accent md:text-3xl"
                >
                  hello@honto.ai
                </a>
                <p className="mt-6 text-sm leading-relaxed text-text-muted">
                  We typically respond within one business day. Please include a
                  brief description of your project or question.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
