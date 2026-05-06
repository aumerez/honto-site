"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { locales, type Locale } from "@/lib/locales";

type SwitcherCopy = {
  languageLabel: string;
  languageOptionEn: string;
  languageOptionEs: string;
  languageOptionPt: string;
};

const FLAGS: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  pt: "🇧🇷",
};

function swapLocaleInPath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = nextLocale;
    return segments.join("/") || "/";
  }
  return `/${nextLocale}${pathname}`;
}

function persistLocaleCookie(next: Locale) {
  document.cookie = `NEXT_LOCALE=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export default function LanguageSwitcher() {
  const { locale, t } = useLocale();
  const router = useRouter();
  const pathname = usePathname() ?? `/${locale}`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const copy = (t.landing as { nav: SwitcherCopy }).nav;

  const options: Array<{ value: Locale; label: string }> = [
    { value: "en", label: copy.languageOptionEn },
    { value: "es", label: copy.languageOptionEs },
    { value: "pt", label: copy.languageOptionPt },
  ];

  function choose(next: Locale) {
    setOpen(false);
    if (next === locale) return;
    persistLocaleCookie(next);
    const target = swapLocaleInPath(pathname, next);
    router.push(target);
    router.refresh();
  }

  return (
    <div className="lang-switcher" ref={rootRef}>
      <button
        type="button"
        className="lang-switcher-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={copy.languageLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
        <span className="lang-switcher-current">{locale.toUpperCase()}</span>
      </button>
      {open ? (
        <ul className="lang-switcher-menu" role="listbox">
          {options.map((opt) => (
            <li key={opt.value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={opt.value === locale}
                className={`lang-switcher-option${opt.value === locale ? " active" : ""}`}
                onClick={() => choose(opt.value)}
              >
                <span className="lang-switcher-flag" aria-hidden="true">
                  {FLAGS[opt.value]}
                </span>
                <span>{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
