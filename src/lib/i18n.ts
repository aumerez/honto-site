import type { Locale } from "./locales";

export type Dictionary = Record<string, unknown>;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("@/locales/en.json").then((m) => m.default),
  es: () => import("@/locales/es.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
