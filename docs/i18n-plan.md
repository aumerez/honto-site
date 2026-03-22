**Status:** Active
**Created:** 2026-03-22
**Last reviewed:** 2026-03-22

# i18n Plan — Spanish/English Language Support

## Goal

Serve the site in Spanish for users in Spanish-speaking countries (or with Spanish browser settings), and English for everyone else. Users can manually override via a language switcher.

## Detection Logic

1. **Primary:** Check `Accept-Language` header from the browser
2. **Secondary:** Use Vercel/Next.js `geo.country` from middleware (or similar geolocation)
3. **Fallback:** English (`en`)

### Spanish-speaking countries (auto-detect to `/es`)

Mexico, Spain, Argentina, Colombia, Peru, Venezuela, Chile, Ecuador, Guatemala, Cuba, Bolivia, Dominican Republic, Honduras, Paraguay, El Salvador, Nicaragua, Costa Rica, Panama, Uruguay, Puerto Rico, Equatorial Guinea

### All other countries → English (`/en`)

## Technical Approach

### 1. Route structure with `[locale]` param

Move all pages under a dynamic `[locale]` segment:

```
src/app/[locale]/page.tsx          # Home
src/app/[locale]/layout.tsx        # Root layout with locale context
src/app/[locale]/case-studies/     # Case studies
src/app/[locale]/case-studies/bulwark/
```

### 2. Middleware (`src/middleware.ts`)

- Runs on every request
- Reads `Accept-Language` header and `geo.country`
- If locale is Spanish-speaking → redirect to `/es/...`
- Otherwise → redirect to `/en/...`
- Skip redirect if URL already has a locale prefix
- Skip static assets, API routes, `_next/`

### 3. Translation files

```
src/locales/en.json
src/locales/es.json
```

Keyed by section/component:

```json
{
  "nav": { "services": "Services", "contact": "Contact", ... },
  "hero": { "title": "...", "subtitle": "..." },
  "services": { ... },
  "coreProduct": { ... },
  "howItWorks": { ... },
  "whyUs": { ... },
  "callToAction": { ... },
  "footer": { ... },
  "chat": { ... }
}
```

### 4. Translation utility

Simple helper to load and access translations:

```
src/lib/i18n.ts        # getTranslations(locale) function
src/lib/locales.ts     # supported locales, country lists, defaults
```

### 5. Language switcher component

- Placed in Navigation
- Toggles between EN / ES
- Navigates to the same page with the other locale prefix
- Shows current language (flag or label)

### 6. Component updates

All components updated to receive translations as props or via context instead of hardcoded English strings. No logic changes — only string replacement.

Components to update:

- [ ] Navigation
- [ ] Hero
- [ ] Services
- [ ] CoreProduct
- [ ] HowItWorks
- [ ] WhyUs
- [ ] CallToAction
- [ ] Footer
- [ ] ChatAssistant

### 7. HTML lang attribute

Set `<html lang="es">` or `<html lang="en">` dynamically in the root layout based on the locale param.

### 8. SEO

- Add `hreflang` alternate links in `<head>` for both locales
- Ensure metadata (title, description) is translated per locale

## Implementation Order

1. Create translation files (`en.json`, `es.json`) with all current strings
2. Create `src/lib/i18n.ts` and `src/lib/locales.ts`
3. Set up `[locale]` route structure (move existing pages)
4. Create middleware for locale detection and redirect
5. Update root layout for dynamic `lang` attribute
6. Add language switcher to Navigation
7. Update each component to use translated strings
8. Add `hreflang` meta tags
9. Update tests
10. Run full verification (`npm run verify`)

## Open Questions

- Do case study pages (Bulwark) need full translation or just UI chrome?
- Should the chat assistant respond in the detected language?
- Will deployment be on Vercel (for geo detection) or elsewhere?
