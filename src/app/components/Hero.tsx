export default function Hero() {
  return (
    <section
      className="noise-overlay relative overflow-hidden bg-bg-elevated"
      aria-label="Hero"
    >
      {/* Subtle warm radial glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-28 pt-40 md:px-8 md:pb-36 md:pt-48">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <p className="animate-fade-in font-mono text-xs font-medium uppercase tracking-[0.2em] text-teal">
            AI Systems Engineering
          </p>

          {/* Headline — serif display */}
          <h1 className="animate-fade-in-up mt-6 font-display text-fluid-xl font-medium italic">
            Your AI systems should work
            <br />
            as hard as <span className="text-accent">your engineers do</span>
          </h1>

          {/* Subheadline — sans-serif body */}
          <p
            className="animate-fade-in-up mt-8 max-w-xl text-fluid-body text-text-secondary"
            style={{ animationDelay: "0.15s" }}
          >
            Most AI initiatives stall between prototype and production. We build
            the infrastructure that gets them across that gap — and keeps them
            running.
          </p>

          {/* CTA */}
          <div
            className="animate-fade-in-up mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: "0.3s" }}
          >
            <a
              href="/contact"
              className="inline-flex items-center gap-3 font-mono text-sm font-medium uppercase tracking-wider text-accent transition-colors hover:text-accent-dim"
            >
              Start a conversation
              <span className="h-px w-8 bg-accent" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
