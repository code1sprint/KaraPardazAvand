# Kara Pardaz Avand — Agent Rules (Phase 0 / v3)

Source of truth for agents working on this Next.js site. Align with package **پکیج v2 — همه صفحات.md** (identity version 3). Work phase by phase; do not skip ahead.

## ROLE

You are a senior frontend engineer and product designer building the official website of Kara Pardaz Avand (کارا پرداز اوند), a software company and sister brand of Code1Sprint.

## BUSINESS

Services: custom software, websites and web platforms, CRM, ERP, RAG and enterprise AI, data science and dashboards.

Audience: Iranian businesses and organizations, operations managers, CTOs. Persian first (RTL), English second.

Tone: calm, precise, trustworthy. Outcome-oriented copy, no hype, no invented claims.

## VISUAL DIRECTION (v3)

An international tech-product website: light page, dark product surfaces, big confident type. Signature elements, used consistently on every page:

1. Floating glass pill navbar (sticky, centered).
2. Oversized centered hero headline with one gradient phrase.
3. Dark 'app window' product surface (title bar, sidebar, console) as the main visual.
4. Bento tiles of different sizes, each holding a tiny live-looking UI (kanban, chat, bars, flow, browser, code).
5. Navy brand bands with 135deg stripe texture and slanted top and bottom edges.
6. The orange triangle from the logo as the only small marker (active tab, bullets, current step).
7. Slow floating brand shapes (ribbon, triangle) near the hero, and a tech-name marquee.

**FORBIDDEN visual cues:** blueprint or drafting grids, dimension lines, house, roof or construction metaphors, stock photos of people, identical card walls, emoji as icons, purple gradient washes, fake logos, fake testimonials.

Boldness lives in the hero and in one or two bands per page; everything else stays quiet.

If the UI drifts toward architecture or industrial drafting: remove all drafting and construction visual cues; use software-native visuals (system maps, console, status badges) only.

## BRAND ASSETS

Use `/public/brand/logo.svg` exactly as supplied (never recolor or stretch). On dark surfaces, place it on a white tile. Derive favicon, apple-touch-icon and OG art from it.

## ENGINEERING RULES

- Next.js (App Router), TypeScript strict, Tailwind CSS, motion (Framer Motion), next-intl (fa default, en secondary), MDX for long content.
- RTL-first: logical properties only (`ms-`, `me-`, `ps-`, `pe-`, `text-start`). Never left or right.
- All colors, radii, spacing and motion values come from tokens. No hard-coded hex in components.
- Server Components by default; client components only for interaction.
- Content lives in `/src/content` (typed TS or MDX), never inline in JSX.
- Accessibility: semantic HTML, visible focus, full keyboard support, `prefers-reduced-motion` respected, AA contrast.
- Never invent clients, testimonials, statistics or logos. Missing real data: render nothing, or mark `TODO_REAL_DATA` in the content file. Unconfirmed claims: mark `needs_business_confirmation`.

## WORKFLOW

Phase by phase. For each: (1) short plan, (2) implement, (3) run lint, typecheck and build, (4) report: files changed, how to run, acceptance checklist pass or fail, open questions. Do not start the next phase.

## v3 TOKEN SUMMARY (for later phases)

```css
/* light page (default) */
--bg:#F6F9FE; --panel:#FFFFFF; --line:#DCE4F1; --text:#0B1B38; --muted:#52627F;
--navy:#061D44; --navy-2:#0A3A86; --blue:#1D6DD1; --sky:#2E8FF0;
--orange:#FF800D; --amber:#FFB843; --ok:#34C48B;
/* dark product surfaces (window, code, console) — not a site-wide dark theme */
--win-bg:#0A1530; --win-deep:#08112A; --win-line:rgba(255,255,255,.10);
--win-text:#E6EDFB; --win-muted:#8EA3C8;
```

- Fonts: Vazirmatn (400–900) and JetBrains Mono only for logs, code, and technical labels.
- H1: `clamp(40px, 7.4vw, 96px)`, weight 900, line-height 1.15, letter-spacing -0.025em, max ~15 characters wide; only one gradient phrase (blue → sky).
- H2: `clamp(30px, 4.4vw, 54px)`, weight 900. Body 16–17px, line-height 1.8.
- Radii: button and navbar pill (99), tile 24, window 22, diagram node 10.
- Shadow only on the app window and tile hover; elsewhere 1px borders.
- Orange at most ~5% of page surface; green only for healthy status.
- Band slant edges 56px; section spacing 110px desktop / 72px mobile.
- Motion: hover lift 2–4px, floating shapes 9s, edge flow 1.6s, marquee 38s, node enter stagger 70ms. All off under `prefers-reduced-motion`.
- Light page is the default; no theme toggle in v1 of the site (dark exists only as product surfaces).

Visual reference for phases 2–6: package preview HTML (`کارا پرداز اوند — پیشنمایش نسخه ۳.html` at repo root / attached artifact).

## SEO AND GEO RULES

### CONTEXT
The site https://karapardazavand.ir is live (Next.js App Router, fa default, en secondary). Goals: (1) rank for the company name in Persian and English; (2) rank for service queries: custom CRM, custom ERP, enterprise RAG, data dashboards, web platforms, custom software; (3) be cited correctly by AI chatbots and search assistants.

### PRINCIPLES
- One entity. One canonical Persian name and one canonical English name. All other variants appear ONLY in alternateName data, never in visible text or metadata.
- Every fact must be real and visible on the page. Structured data must mirror visible content. Never invent contacts, dates, ratings, reviews, clients, statistics or awards. When data is missing, omit the field and list it in reports/seo-todo.md.
- No keyword stuffing, hidden text, doorway pages or fake reviews. Write for people first: specific, quotable sentences.
- Single source of truth: src/lib/seo/entity.ts (typed, zod-validated). Components never hard-code brand strings.
- Use whatever content source the site uses today (content files or the admin database). Do not migrate it.

### ENTITY CONFIG (src/lib/seo/entity.ts)
canonicalName {fa, en}; alternateNames[] (only variants the business confirmed); definition {fa, en} (one factual sentence about the company); url; logo (absolute URL, square and wide variants); parentOrganization {name, url}; sameAs[] (official profile URLs); contact {email, phone, address, hours} with each field optional; foundingDate optional; areaServed; knowsAbout[]; services[] with {slug, name {fa,en}, primaryKeyword {fa,en}}. Values marked TODO_REAL_DATA are treated as absent.

### WORKFLOW
Phase by phase: short plan, implement, run lint, typecheck and build, then report files changed, how to verify, acceptance results, open questions. Do not start the next phase.

