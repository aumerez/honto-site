import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { LocaleProvider } from "@/context/LocaleContext";
import enDict from "@/locales/en.json";
import esDict from "@/locales/es.json";
import type { Locale } from "@/lib/locales";

export function renderWithLocale(
  ui: ReactElement,
  options?: RenderOptions & { locale?: Locale }
) {
  const locale: Locale = options?.locale ?? "en";
  const dictionary = locale === "es" ? esDict : enDict;
  return render(
    <LocaleProvider locale={locale} dictionary={dictionary}>
      {ui}
    </LocaleProvider>,
    options
  );
}
