# Site Redesign Plan

**Status:** Active
**Created:** 2026-03-21
**Last reviewed:** 2026-03-21

---

## Problem

The current site is too pushy and too retaily. It follows a SaaS/startup landing page pattern — hero → pain points → "schedule a call" CTA → testimonials → another CTA. This does not fit the narrative of a serious tech consultancy. Components like `CallToAction`, `ChatAssistant`, `HowItWorks`, and `WhyUs` reinforce a sales-funnel aesthetic that signals the opposite of credibility for a consultancy shop.

## Reference

Best practices extracted from [freelancecake.com consultant website examples](https://www.freelancecake.com/blog/consultant-website-examples), focusing on tech-oriented consultancies:

### Strongest tech consultant examples

1. **Vangos Pterneas** — Leads with technical depth (blog, open-source work), not sales funnels. Authority is earned through substance.
2. **Jane Portman (UI Breakfast)** — Clean single-column layout, resource library. Lets the work speak.
3. **Jeff Gothelf** — Minimalist copy, outcome-focused sections. No hard sell.
4. **Punctuation (M&A advisory)** — Bold niche claim, comparison tables. Confidence without pushiness.

### General best practices from the article

- Put a clear, concise value proposition where visitors can't miss it.
- Define niche and specialization explicitly.
- Explaining your process makes it clear that you have one.
- Use conversational tone over industry jargon.
- Include case studies with specific numerical results.
- Create "ownable language" and terminology unique to your approach.
- Use custom imagery over generic stock photos.
- Maintain consistent color palette throughout.
- Simplify navigation (3-4 items max).
- Multiple contact method options, simple forms, no aggressive CTAs.

## Proposed Aesthetic Direction

**Tone:** Editorial / restrained authority. Think law firm meets technical journal — not startup landing page.

### Key Principles

- **No "schedule a call" as primary CTA.** Replace with a simple contact section — email or a brief form. Serious clients know how to reach out; they don't need to be funneled.
- **Lead with what you do and who you've done it for.** Not with pain points or urgency.
- **Show depth, not breadth.** Case studies or writing over feature lists.
- **Minimal navigation.** 3-4 items max: Work, About, Writing/Insights, Contact.
- **No testimonial carousels, no client logo walls.** If you reference clients, do it contextually within case studies.

## Proposed Site Structure

```
/                   → Home: one-liner positioning + selected work + brief about + contact
/work               → Case studies (when ready)
/about              → Team/background, methodology, values
/insights           → Writing, technical posts (when ready)
/contact            → Simple form or email, no calendly embed
```

## Home Page Sections (in order)

1. **Positioning statement** — One sentence. What honto does, for whom. No subheadline fluff.
2. **Selected work** — 2-3 case studies or project descriptions. Brief, outcome-focused.
3. **About (compressed)** — 2-3 sentences + link to full about page.
4. **Contact** — Email address or minimal form. No "book a free consultation" language.

## What to Remove or Replace

### Remove entirely

- `CallToAction.tsx` — "schedule a call" pattern is too retaily
- `ChatAssistant.tsx` — chat widget feels like a support bot, not a consultancy
- `WhyUs.tsx` — "why us" sections are a startup landing page staple, not consultancy
- `HowItWorks.tsx` — step-by-step process sections feel like product onboarding

### Rework significantly

- `Hero.tsx` — replace with a restrained positioning statement, no stock imagery or animated backgrounds
- `Services.tsx` — reframe as capabilities or areas of practice, not a service menu
- `Navigation.tsx` — simplify to 3-4 items
- `Footer.tsx` — minimal, no redundant CTA

### Keep and refine

- `case-studies/` — this is the right pattern; refine presentation
- `globals.css` — rework to match new aesthetic direction
- Scroll reveal hooks — keep but use sparingly

## What to Avoid

- Hero images with stock photos of handshakes or laptops
- "We help X do Y so they can Z" formula headlines
- Pricing tiers on the homepage
- Animated counters ("500+ projects delivered")
- Calendly/schedule-a-call widgets
- Testimonial sliders
- Purple gradients
- Generic SaaS/AI layouts
- Default component-library aesthetics
- Overused gradient-heavy styles without purpose
