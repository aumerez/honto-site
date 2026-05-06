"use client";

import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import OnboardingWizard from "../../components/Onboarding/OnboardingWizard";
import { useLocale } from "@/context/LocaleContext";

type OnboardingCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export default function Onboarding() {
  const { t } = useLocale();
  const o = t.onboarding as OnboardingCopy;

  return (
    <>
      <Navigation />
      <main>
        <section className="ob-hero">
          <div className="ob-hero-inner">
            <span className="ob-hero-eyebrow">{o.eyebrow}</span>
            <h1 className="ob-hero-title">{o.title}</h1>
            <p className="ob-hero-subtitle">{o.subtitle}</p>
          </div>
        </section>
        <section className="ob-wizard-section">
          <div className="ob-wizard-inner">
            <OnboardingWizard />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
