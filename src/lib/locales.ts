export const defaultLocale = "en" as const;
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

/** ISO 3166-1 alpha-2 country codes for Spanish-speaking countries. */
export const spanishCountries = new Set([
  "MX", // Mexico
  "ES", // Spain
  "AR", // Argentina
  "CO", // Colombia
  "PE", // Peru
  "VE", // Venezuela
  "CL", // Chile
  "EC", // Ecuador
  "GT", // Guatemala
  "CU", // Cuba
  "BO", // Bolivia
  "DO", // Dominican Republic
  "HN", // Honduras
  "PY", // Paraguay
  "SV", // El Salvador
  "NI", // Nicaragua
  "CR", // Costa Rica
  "PA", // Panama
  "UY", // Uruguay
  "PR", // Puerto Rico
  "GQ", // Equatorial Guinea
]);

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
