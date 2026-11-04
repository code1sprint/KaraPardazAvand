# Vertical Rhythm and Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify vertical rhythm and section spacing across all routes in `fa` and `en` into a single token-driven system with zero doubling, standard containers, single CTA per page, proper heading line-heights, and non-overlapping footer watermark.

**Architecture:** Adopt a single-owner spacing architecture where `<main>` defines a flex column with `row-gap: var(--gap-section)`. Sections have zero vertical margins and paddings, Bands negate section row-gap and provide their own padding (`--pad-band`) to achieve the exact target visual gap (`--gap-band-edge`), containers standardize on 1180px with 24px inline padding (760px only for prose), and duplicate page-level CTAs are eliminated.

**Tech Stack:** Next.js (App Router), TypeScript strict, Tailwind CSS, Playwright, next-intl.

**Spec:** User prompt: "TASK: FIX VERTICAL RHYTHM AND SPACING ACROSS THE WHOLE SITE".

## Global Constraints
- Spacing and layout only: no redesign, no copy changes, no color changes.
- RTL-first: logical properties only (`ms-`, `me-`, `ps-`, `pe-`, `text-start`). Never left or right.
- All spacing, radii, and motion values come from tokens in `tokens.css`.
- Target visual whitespace (content-to-content) at desktop (>=1024) / tablet (768) / mobile (390):
  - plain to plain: 96 / 72 / 56
  - plain to band edge and band edge to plain: 72 / 56 / 40
  - band edge to first content inside band, and last content to band edge: 120 / 96 / 72
  - page hero bottom to first section: same as plain to plain (96 / 72 / 56)
  - last section to footer CTA band: same as plain to plain (96 / 72 / 56)
- Container: standard `max-width: 1180px`, `padding-inline: 24px` (`px-6`). Only narrow variant is `prose` (760px centered).
- One CTA per page: remove page-level CTA cards when global closing CTA band is rendered. On `/contact`, render inline form instead of global band.
- Typography rhythm: H1 line-height fa 1.25 / en 1.08; H2 fa 1.35 / en 1.15; H3 fa 1.4 / en 1.25; `text-wrap: balance` on all headings. Closing CTA heading max-width 24ch (fa 20ch), 2 lines max on desktop. Inner-page H1 uses `clamp(32px, 4.6vw, 56px)`. Lead paragraphs max 60ch.
- Footer: top padding `var(--gap-section)`, bottom padding 24px, watermark behind content with low opacity clipped to bottom area without overlapping links.

## Review Focus
- Plain-to-plain spacing doubling when adjacent components each have padding or margin.
- Mobile viewport (390px) horizontal overflow or improper heading line-height breaking words.
- RTL vs LTR alignment shifts: heading start edges must align strictly across sections in both `fa` and `en`.
- `/contact` page mistakenly rendering both the contact form and the footer closing CTA band.
- Footer watermark text overlaying and intercepting pointer events or visually obscuring column links.

---

### Task 1: Audit Script and Baseline Report (Step 1)
**Files:**
- Create: `scripts/audit-spacing.ts`
- Create: `reports/spacing-before.md`

**Interfaces:**
- Consumes: Running Next.js server at `http://localhost:3000`
- Produces: `reports/spacing-before.md` containing gap measurements and container offset analysis for routes in `fa` and `en` at 1440, 1024, 768, 390.

- [ ] **Step 1: Write `scripts/audit-spacing.ts` with Playwright**
  Measure top-level sections in `<main>` and footer for all routes across 4 viewports (1440, 1024, 768, 390).
- [ ] **Step 2: Run audit script against baseline site**
  Run: `npx tsx scripts/audit-spacing.ts --output reports/spacing-before.md`
- [ ] **Step 3: Verify `reports/spacing-before.md` is populated and contains sorted gap tables and container deviations**
  Inspect file to confirm measurements and deviations are documented.

---

### Task 2: Token System Definition in `tokens.css` (Step 2)
**Files:**
- Modify: `src/styles/tokens.css`

**Interfaces:**
- Consumes: User specifications for tokens and targets
- Produces: CSS custom properties:
  - `--gap-section`
  - `--gap-band-edge`
  - `--pad-band`
  - `--gap-header`
  - `--gap-content`
  - `--hero-top`
  - Inner page H1 size and responsive line-heights for `fa` and `en`.

- [ ] **Step 1: Add new spacing and typography tokens to `src/styles/tokens.css`**
- [ ] **Step 2: Verify tokens are available and compile with Tailwind CSS**
  Run: `npm run typecheck`

---

### Task 3: Refactor Core Primitives (Section, Band, Container, Heading, PageHero, FooterCta)
**Files:**
- Modify: `src/components/layout/Section.tsx`
- Modify: `src/components/layout/Band.tsx`
- Modify: `src/components/layout/Container.tsx`
- Modify: `src/components/ui/Heading.tsx`
- Create: `src/components/layout/PageHero.tsx`
- Modify: `src/components/layout/SiteFooter.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: Tokens from `src/styles/tokens.css`
- Produces: Primitives that guarantee single-owner spacing and uniform container alignment.

- [ ] **Step 1: Update `<main>` in `src/app/[locale]/layout.tsx` to flex column with `gap-[length:var(--gap-section)]`**
- [ ] **Step 2: Update `Section.tsx` to strip vertical padding/margin so `<main>` owns spacing**
- [ ] **Step 3: Update `Band.tsx` with negative margin-block (`calc(var(--gap-band-edge) - var(--gap-section))`) and `py-[length:var(--pad-band)]`**
- [ ] **Step 4: Standardize `Container.tsx` (max-width: 1180px, px-6; prose: 760px centered)**
- [ ] **Step 5: Create `PageHero.tsx` for inner page hero sections with `pt-[length:var(--hero-top)]` and inner-page H1 clamp**
- [ ] **Step 6: Update `Heading.tsx` with locale-aware line-heights and `text-wrap: balance`**
- [ ] **Step 7: Update `SiteFooter.tsx` (top padding `var(--gap-section)`, bottom 24px, watermark clipped and behind content, CTA omitted on `/contact`)**

---

### Task 4: Fix Routes and Remove Duplicate CTAs (Home, About, Services, Portfolio, Process, FAQ, Contact, Insights, Legal)
**Files:**
- Modify: `src/app/[locale]/page.tsx` (and home sections: FAQ indent, console/step min-heights)
- Modify: `src/app/[locale]/about/page.tsx` (remove duplicate PageSoftCta, adopt PageHero)
- Modify: `src/app/[locale]/services/page.tsx` & `src/app/[locale]/services/[slug]/page.tsx` (remove duplicate ServiceClosingCta, adopt PageHero)
- Modify: `src/app/[locale]/portfolio/page.tsx` & `src/app/[locale]/portfolio/[slug]/page.tsx` (remove duplicate CTA card, adopt PageHero)
- Modify: `src/app/[locale]/process/page.tsx` (remove duplicate PageSoftCta, remove reserved min-heights)
- Modify: `src/app/[locale]/faq/page.tsx` (remove duplicate PageSoftCta, align container to standard)
- Modify: `src/app/[locale]/contact/page.tsx` (ensure footer CTA is hidden, adopt PageHero)
- Modify: `src/app/[locale]/insights/page.tsx` & `src/app/[locale]/insights/[slug]/page.tsx` (remove duplicate PageSoftCta)
- Modify: `src/app/[locale]/terms/page.tsx` & `src/app/[locale]/privacy/page.tsx`

**Interfaces:**
- Consumes: Primitives from Task 3
- Produces: Clean routes adhering strictly to standard container and vertical rhythm.

- [ ] **Step 1: Fix `/` (Home) sections and FAQ container indentation**
- [ ] **Step 2: Fix `/about` (adopt PageHero, eliminate duplicate CTA)**
- [ ] **Step 3: Fix `/services` & `/services/[slug]` (adopt PageHero, eliminate duplicate CTA, content-based sizing)**
- [ ] **Step 4: Fix `/process` (adopt PageHero, eliminate duplicate CTA, replace fixed/min heights)**
- [ ] **Step 5: Fix `/portfolio` & `/portfolio/[slug]` (adopt PageHero, eliminate duplicate CTA)**
- [ ] **Step 6: Fix `/faq` (adopt PageHero, remove duplicate CTA, ensure standard container width)**
- [ ] **Step 7: Fix `/contact` (adopt PageHero, ensure footer CTA band is omitted)**
- [ ] **Step 8: Fix `/insights`, `/insights/[slug]`, `/terms`, `/privacy`**

---

### Task 5: Verification, Playwright Spec, Screenshots, and Final Report (Step 4)
**Files:**
- Create: `tests/spacing.spec.ts`
- Create: `reports/spacing-after.md`
- Screenshots in `reports/screenshots/`

**Interfaces:**
- Consumes: Running site with refactored spacing
- Produces: Automated test suite, after report, before/after screenshots, and final delivery report.

- [ ] **Step 1: Write `tests/spacing.spec.ts` testing gap tolerances (within 4px) and single CTA assertion across routes and viewports**
- [ ] **Step 2: Run `audit-spacing.ts` to generate `reports/spacing-after.md`**
- [ ] **Step 3: Take before/after screenshots at 1440 and 390 for home, about, services, service page, portfolio, process, faq, contact**
- [ ] **Step 4: Run typecheck, lint, and Playwright tests**
  Run: `npm run typecheck && npm run lint && npx playwright test tests/spacing.spec.ts`
- [ ] **Step 5: Produce final report with changed files, added tokens, and acceptance checklist**
