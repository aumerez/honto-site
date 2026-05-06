"use client";

import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { useLocale } from "@/context/LocaleContext";

type OnboardingCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  comingSoon: string;
};

export default function Onboarding() {
  const { t } = useLocale();
  const o = t.onboarding as OnboardingCopy;

  return (
    <>
      <Navigation />
      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
          <div
            className="absolute inset-0 bg-bg-elevated opacity-50"
            aria-hidden="true"
          />
          <div
            className="absolute left-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-4xl px-5 md:px-8">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {o.eyebrow}
            </span>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {o.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">
              {o.subtitle}
            </p>
            <p className="mt-10 inline-block rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              {o.comingSoon}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
