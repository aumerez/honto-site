"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import type { Locale } from "@/lib/locales";

const labels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

export default function LanguageSwitcher() {
  const { locale } = useLocale();
  const pathname = usePathname();

  const otherLocale: Locale = locale === "en" ? "es" : "en";

  // Replace /en/ or /es/ prefix with the other locale
  const switchedPath = pathname.replace(
    new RegExp(`^/${locale}(/|$)`),
    `/${otherLocale}$1`
  );

  return (
    <a
      href={switchedPath}
      className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs font-medium text-text-secondary transition-all hover:border-accent/40 hover:text-accent"
      aria-label={`Switch to ${otherLocale === "es" ? "Spanish" : "English"}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span>{labels[locale]}</span>
      <span className="text-text-muted">/</span>
      <span className="text-accent">{labels[otherLocale]}</span>
    </a>
  );
}
