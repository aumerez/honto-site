import { render } from "@testing-library/react";
import { LocaleProvider } from "@/context/LocaleContext";
import type { Locale } from "@/lib/locales";
import en from "@/locales/en.json";
import es from "@/locales/es.json";

const dictionaries = { en, es };

export function renderWithLocale(
  ui: React.ReactElement,
  locale: Locale = "en"
) {
  return render(
    <LocaleProvider locale={locale} dictionary={dictionaries[locale]}>
      {ui}
    </LocaleProvider>
  );
}
