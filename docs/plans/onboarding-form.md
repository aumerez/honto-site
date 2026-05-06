# Client Onboarding Form Plan

**Status:** Draft
**Created:** 2026-05-05
**Last reviewed:** 2026-05-05

## Goal

Add a structured client onboarding intake so prospects can self-report their **systems landscape**, **AI maturity**, and **scope expectations**. The output gives honto. two things:

1. An **AI Maturity Score** (0–100) with a short qualitative band (Foundational / Emerging / Operational / Advanced).
2. An **Implementation Sizing estimate** (T-shirt size → week range) based on system count, integration complexity, data readiness, and governance gaps.

Both are computed deterministically from the answers and shown to the prospect at the end, then emailed to honto. for follow-up.

## Recommendation Summary

- **Entry point:** Add a primary CTA pill in the top navigation labeled **"AI Readiness"**, sitting to the left of the existing contact pill. The homepage contact form stays as-is for general inquiries.
- **Page:** New route `src/app/[locale]/onboarding/page.tsx`. Locale-aware (en / es / pt) like the rest of the site.
- **Shape:** Multi-step wizard (5 steps + results), single-page client component, no full reloads between steps.
- **Persistence:** `localStorage` autosave per step so users don't lose progress on accidental reload.
- **Submission:** New `POST /api/onboarding` route that mirrors the existing `/api/contact` pattern (Resend, IP rate limit, sanitize + escape, server-side validation against a shared field descriptor).
- **Tone:** Match the site's existing aesthetic (dark theme, tight typographic scale established in v1). No new component library.

## Page & Entry Point

### Navigation

- File: `src/app/components/Navigation.tsx`
- Add a new pill before the contact pill, labeled **"AI Readiness"**. Use the same `pill` styling but with an outlined variant (so the contact CTA remains the dominant action).
- Add `nav.aiReadiness` key to `src/locales/{en,es,pt}.json`.
  - en: `"AI Readiness"`
  - es: `"Madurez en IA"` (working translation; confirm with native review before PR 3)
  - pt: `"Maturidade em IA"` (working translation; confirm with native review before PR 3)

### Route

- `src/app/[locale]/onboarding/page.tsx` — server component shell, imports the wizard client component.
- `src/app/components/Onboarding/` — folder for the wizard:
  - `OnboardingWizard.tsx` — top-level state machine, step routing, progress bar, autosave.
  - `steps/StepCompany.tsx`
  - `steps/StepSystems.tsx`
  - `steps/StepData.tsx`
  - `steps/StepAIMaturity.tsx`
  - `steps/StepGoals.tsx`
  - `steps/Results.tsx`
  - `scoring.ts` — pure functions that turn answers into the maturity score and sizing estimate.
  - `schema.ts` — Zod (or hand-rolled) types shared with the API route.

### Why a wizard, not a single long form

A 30+ field single page tanks completion rates. A wizard with a visible progress indicator (e.g., `Step 2 of 5`) and short, themed sections keeps perceived effort low, allows per-step validation, and lets us show the score immediately at the end as a reward for finishing.

## Step Breakdown

Each step targets ~60–90 seconds of effort. Required fields are marked **\***.

### Step 1 — Company Profile

Establishes who they are and how to reach them. This is also our minimum viable lead — if a user abandons after step 1, we still have a contactable record.

- Company name **\***
- Contact name **\***
- Work email **\*** (validated)
- Phone (optional, digits-only — reuse `/api/contact` validator)
- Industry (single select: Financial Services, Healthcare, Retail/eCommerce, Manufacturing, Logistics, Tech/SaaS, Public Sector, Other)
- Company size (single select: 1–10, 11–50, 51–200, 201–1,000, 1,000+)
- Country / region (single select)
- Role of respondent (single select: Founder/Exec, Engineering Lead, Ops/Product, Other)

### Step 2 — Current Systems & Tech Stack

The core inventory. Used for both maturity scoring (modern stack ≈ higher floor) and sizing (more systems = more integration surface).

Each category is a multi-select with an "Other (free text)" escape hatch. Storing the **count and categories** of selected systems is what feeds the sizing model.

- **CRM:** Salesforce, HubSpot, Pipedrive, Zoho, Microsoft Dynamics, None, Other
- **ERP / Finance:** SAP, Oracle NetSuite, Microsoft Dynamics, QuickBooks, Xero, None, Other
- **Data warehouse / lake:** Snowflake, BigQuery, Redshift, Databricks, Postgres-only, None, Other
- **Comms / collaboration:** Slack, Microsoft Teams, Google Workspace, Email-only, Other
- **Ticketing / support:** Zendesk, Intercom, Freshdesk, Jira Service Management, None, Other
- **Identity / SSO:** Okta, Azure AD/Entra, Google Workspace, Auth0, None, Other
- **Productivity / docs:** Notion, Confluence, SharePoint, Google Drive, Other
- **Custom internal apps:** Yes / No → if yes, "How many?" (single select: 1–3, 4–10, 11+)

### Step 3 — Data & Processes

Drives the **data readiness** dimension of the maturity score and is a major sizing multiplier.

- Where does most operational data live? (single select: Centralized warehouse, Spread across SaaS tools, Spreadsheets/files, Don't know)
- Estimated data volume per month (single select: <1 GB, 1–100 GB, 100 GB–1 TB, 1+ TB, Don't know)
- Are core processes documented? (single select: Yes, fully / Partially / No / Don't know)
- Are systems integrated today? (single select: Yes, most are / Some / No, mostly manual / Don't know)
- Top 3 manual or repetitive workflows you'd most like automated (free text, optional, 500 char max)

### Step 4 — AI Maturity

Drives the **AI usage** and **governance** dimensions.

- Current AI use in the org (single select: None / Experimentation by individuals / Pilots in production / Multiple production systems)
- Have you run prior AI projects? (single select: Never / Started, didn't finish / Shipped, mixed results / Shipped, in production)
- AI/ML talent on team (single select: None / 1 person / Small team (2–5) / Dedicated team (6+))
- AI governance & policy (single select: None / Informal guidelines / Written policy / Formal program with reviews)
- Data privacy constraints (multi-select: GDPR, HIPAA, SOC 2, PCI, Internal-only data, None)
- Familiarity with LLMs / agents (single select: Low / Medium / High)

### Step 5 — Goals & Constraints

Shapes the implementation conversation, not the score.

- What outcomes are you targeting? (multi-select: Cut operating cost, Speed up a process, Improve customer experience, Unlock new product capability, Compliance/risk reduction, Other)
- Top 1–3 priority initiatives (free text, 500 char max)
- Desired start date (single select: ASAP / 1–3 months / 3–6 months / 6+ months / Exploring)
- Budget range (single select: Not yet defined / <$25k / $25k–$100k / $100k–$500k / $500k+)
- Decision timeline (single select: Weeks / 1–2 months / 3+ months / Unclear)
- Anything else we should know? (free text, 1,000 char max)

### Results — Maturity Score + Implementation Sizing

Shown immediately on submit, on the same page (no redirect). Includes:

- **Maturity Score** (0–100) and band (Foundational / Emerging / Operational / Advanced).
- **Per-dimension breakdown:** Systems, Data Readiness, AI Usage, Governance, Talent.
- **Estimated implementation effort:** T-shirt size (S/M/L/XL) mapped to a week range (e.g., S = 4–6 weeks, M = 6–10, L = 10–16, XL = 16+).
- A short narrative paragraph that picks 1–2 strengths and 1–2 gaps from the answers (rule-based, not LLM — deterministic).
- **"Download your score"** button → triggers `window.print()` against a dedicated `@media print` stylesheet that hides the wizard chrome and renders a clean one-page report. The user's browser handles "Save as PDF" natively — no new dependency.
- **"Book a follow-up"** CTA → jumps to the homepage `#contact` anchor with prefilled name / email / company via query params.

#### Print stylesheet requirements

- Hide: navigation, footer, progress bar, action buttons, language switcher.
- Show: honto. wordmark, company name, score + band, per-dimension breakdown, sizing estimate, narrative paragraph, generated date.
- Force light background, dark text, B&W-friendly contrast (the dark-theme site colors look poor on paper).
- Page-break-inside: avoid on each results card.
- Future upgrade path (out of scope for v1): swap `window.print()` for `@react-pdf/renderer` if we need branded PDFs with custom typography.

## Scoring Model (deterministic)

Pure functions in `scoring.ts`. Each input maps to a small integer; weighted sum produces the score and sizing.

### Maturity Score (0–100)

Five dimensions, weighted:

| Dimension      | Weight | Inputs                                                                            |
| -------------- | ------ | --------------------------------------------------------------------------------- |
| Systems        | 20     | CRM/ERP/warehouse modernity, identity provider presence, integrated vs siloed     |
| Data Readiness | 25     | Data location, volume awareness, process documentation, integration state        |
| AI Usage       | 25     | Current AI use, prior project outcomes, LLM familiarity                          |
| Governance     | 15     | Written policy, privacy constraints awareness                                     |
| Talent         | 15     | AI/ML headcount tier                                                             |

Bands: 0–25 Foundational, 26–50 Emerging, 51–75 Operational, 76–100 Advanced.

### Implementation Sizing

Independent from the score — driven by complexity:

- Base: 4 weeks
- +1 week per selected system category beyond the first 3
- +2 weeks if "Custom internal apps" count is 11+
- +2 weeks if data is "Spread across SaaS tools" or "Spreadsheets/files"
- +2 weeks if processes are "No" or "Don't know" documented
- +2 weeks per high-stakes compliance constraint (HIPAA, PCI, SOC 2)
- +1 week if no AI/ML talent on team

T-shirt mapping: ≤6w = S, 7–10w = M, 11–16w = L, 17+w = XL.

These weights are starting points and should be tuned after the first 5–10 real submissions. Keep the constants at the top of `scoring.ts` so they are easy to adjust.

## API & Submission

### `POST /api/onboarding`

- New file: `src/app/api/onboarding/route.ts`
- Mirror `/api/contact` patterns: Resend send, per-IP rate limit, sanitize + HTML-escape, shared descriptor for max lengths.
- Rate limit: stricter than contact — `RATE_LIMIT_MAX = 1` per hour per IP (the form is heavier and we don't want spam scoring runs).
- Server **recomputes** the score from the raw answers — never trust the client's computed score for the email.
- Email subject: `New onboarding intake — {company} — {band} ({score}/100) — {sizing}`.
- Email body: structured sections matching the wizard steps + the computed result.
- Reuses `RESEND_API_KEY` / `CONTACT_FROM_EMAIL` / `CONTACT_TO_EMAIL` env vars (no new infra).

### Validation

- Shared schema between client and server (`schema.ts`).
- Server validates types, enum values, and string lengths. Anything unrecognized → 400.

## i18n

- Add a new top-level key `onboarding` to `src/locales/{en,es,pt}.json` with sub-keys per step, per field label, per option, and for the results page.
- Keep option **values** (the data sent to the server) in English / canonical form; only labels are translated.

## Accessibility & UX details

- Each step is a real `<form>` with proper `<label htmlFor>` pairing — no div-as-input.
- Progress bar is `<progress>` with `aria-valuenow`.
- "Back" never wipes state; "Next" runs per-step validation.
- Results page is keyboard reachable; the score has a text equivalent (not just a visual ring).
- All copy passes the 80-char Prettier width and avoids jargon.

## Implementation Phases

Ship in **3 PRs** so review stays small.

### PR 1 — Skeleton & navigation

- Add `/[locale]/onboarding` route with placeholder content.
- Add nav CTA + locale strings for the link only.
- No form yet; just the page exists and is reachable in all 3 locales.
- Unit test: route renders in en/es/pt.

### PR 2 — Wizard + scoring (client only)

- All 5 steps + results, full state machine, localStorage autosave.
- `scoring.ts` with unit tests covering each band boundary and each sizing tier.
- Print stylesheet + "Download your score" button wired to `window.print()`.
- Submit button is disabled until step 5 is valid; on submit, just `console.log` the payload (no API yet).
- Tests: scoring edge cases, step validation, autosave restore, print-only elements correctly hidden in screen rendering.

### PR 3 — API route + Resend wiring + i18n complete

- `POST /api/onboarding` with rate limit, validation, Resend send.
- Full translation of all option labels for es/pt.
- Replace `console.log` with real submission.
- Tests: API happy path, validation rejection, rate limit, server-side re-scoring.

## Decisions (locked 2026-05-05)

1. **CTA label:** "AI Readiness".
2. **Score visibility:** Shown on the results page after submit, with a "Download your score" button (browser print-to-PDF).
3. **Email collection:** Captured in step 1 (Company Profile), as currently planned.
4. **Resume:** localStorage only (per device). Server-side draft store is out of scope for v1.
5. **Homepage contact form:** Stays as-is. Onboarding serves a different intent.

## Out of Scope for v1

- Server-side draft persistence / resume-by-link.
- CRM integration (HubSpot/Salesforce push).
- PDF export of the results.
- Admin dashboard to view past submissions (email is the dashboard for now).
- LLM-generated narrative on the results page (deterministic rules only — keeps results consistent and avoids a model dependency at submit time).
