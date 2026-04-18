import type { ReactElement } from "react";
import { render, type RenderResult } from "@testing-library/react";
import { LocaleProvider } from "@/context/LocaleContext";
import type { Locale } from "@/lib/locales";
import en from "@/locales/en.json";
import es from "@/locales/es.json";

const dictionaries = { en, es } as const;

export function renderWithLocale(
  ui: ReactElement,
  locale: Locale = "en"
): RenderResult {
  return render(
    <LocaleProvider locale={locale} dictionary={dictionaries[locale]}>
      {ui}
    </LocaleProvider>
  );
}
