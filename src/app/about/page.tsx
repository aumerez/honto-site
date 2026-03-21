import type { Metadata } from "next";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "About — Honto",
  description:
    "How we work. Honto is an engineering consultancy focused on production-grade AI systems.",
};

export default function About() {
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
              About
            </p>
            <h1 className="mt-4 font-display text-fluid-xl font-medium italic">
              About
            </h1>
            <p className="mt-6 max-w-xl text-fluid-body text-text-secondary">
              Honto is an engineering consultancy that designs, builds, and
              operates AI systems. We work with organizations that need
              production-grade infrastructure — not prototypes.
            </p>
          </div>
        </section>

        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6 md:px-8">
            <div className="grid gap-20 lg:grid-cols-2 lg:gap-24">
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
                  Process
                </p>
                <h2 className="mt-4 font-display text-fluid-md font-medium italic">
                  How we work
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-text-secondary">
                  <p>
                    Every engagement starts with understanding. We study your
                    systems, constraints, and goals before writing a line of
                    code. The output is architecture that holds up under
                    production load, not slide decks.
                  </p>
                  <p>
                    We favor small teams with deep expertise over large staffing
                    engagements. Our work ships with tests, documentation, and
                    operational runbooks — because building it is only half the
                    job.
                  </p>
                </div>
              </div>
              <div>
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
                  Principles
                </p>
                <h2 className="mt-4 font-display text-fluid-md font-medium italic">
                  What we value
                </h2>
                <div className="mt-8 space-y-8">
                  {[
                    {
                      title: "Engineering discipline",
                      description:
                        "AI systems deserve the same rigor as any critical infrastructure. We test, audit, and monitor everything we ship.",
                    },
                    {
                      title: "Honest assessment",
                      description:
                        "Not every problem needs AI. We'll tell you when a simpler solution is the right one.",
                    },
                    {
                      title: "Operational ownership",
                      description:
                        "We build systems that run reliably without us. If it can't be maintained by your team, we haven't finished the job.",
                    },
                  ].map((value) => (
                    <div
                      key={value.title}
                      className="border-l-2 border-border pl-6"
                    >
                      <h3 className="font-body text-base font-semibold">
                        {value.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                        {value.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
