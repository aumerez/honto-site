"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";
import { locales, type Locale } from "@/lib/locales";

function swapLocale(pathname: string, target: Locale): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = target;
    return segments.join("/") || "/";
  }
  return `/${target}${pathname === "/" ? "" : pathname}`;
}

export default function LocaleSwitch() {
  const { locale, t } = useLocale();
  const pathname = usePathname() || "/";
  const labels = t.localeSwitch;

  const enActive = locale === "en";
  const esActive = locale === "es";

  return (
    <span className="locale-switch">
      {enActive ? (
        <span aria-current="true">EN</span>
      ) : (
        <Link
          href={swapLocale(pathname, "en")}
          aria-label={labels.switchToEnglish}
        >
          EN
        </Link>
      )}
      <span aria-hidden="true"> · </span>
      {esActive ? (
        <span aria-current="true">ES</span>
      ) : (
        <Link
          href={swapLocale(pathname, "es")}
          aria-label={labels.switchToSpanish}
        >
          ES
        </Link>
      )}
    </span>
  );
}
