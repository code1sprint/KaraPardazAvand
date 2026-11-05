# SEO & GEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the full 10-phase SEO and GEO roadmap from `پرامپت سئو و GEO.md` to establish first-class search visibility (Google, Bing) and AI search assistant citation (ChatGPT, Claude, Perplexity, Gemini) for Kara Pardaz Avand in Persian and English.

**Architecture:** A single source of brand truth (`src/lib/seo/entity.ts`) validated by Zod drives a centralized metadata engine (`src/lib/seo/metadata.ts`), server-rendered JSON-LD schemas (`src/lib/seo/jsonld.ts`), an AI-aware crawler strategy in `robots.ts` and `sitemap.ts`, an Answer Engine Optimization component system (`AnswerBlock`, definition sentences, Breadcrumbs), and automated audit/regression tooling.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Zod, next-intl, schema-dts, Playwright, React 19.

**Spec:** `پرامپت سئو و GEO.md`

## Global Constraints

- One entity: Canonical Persian name "کارا پرداز اوند", Canonical English name "Kara Pardaz Avand". Other variations appear only in `alternateName`.
- Never invent contacts, dates, ratings, reviews, clients, statistics or awards. Missing data is omitted and listed in `reports/seo-todo.md` with `TODO_REAL_DATA`.
- Single source of truth: `src/lib/seo/entity.ts` (typed, Zod-validated). Components and routes never hard-code brand strings.
- All JSON-LD rendered exclusively on server via `<JsonLd>` with secure escaping and stable `@id` URIs.
- RTL-first: Persian default (`/fa`), English secondary (`/en`), with reciprocal hreflang and `x-default`.
- Respect `AGENTS.md` and phase-by-phase execution: lint, typecheck, and build must pass on each phase before progressing.

## Review Focus

- Canonical and alternate URL mismatch: Ensure all canonicals are absolute self-referencing and hreflang links correctly cross-reference between `/fa` and `/en` without loops or broken URLs.
- AI Bot crawler differences: Ensure `robots.ts` handles GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot, CCBot according to `AI_CRAWLERS` configuration without returning different status or content size compared to Googlebot.
- JSON-LD `@id` collision or circular references: Ensure Organization (`https://karapardazavand.ir/#organization`) and WebSite (`https://karapardazavand.ir/#website`) have exactly one definition and are referenced cleanly in WebPage and Service nodes.
- Missing contact data handling: Ensure omitting optional fields (phone, email, address) does not emit empty strings or invalid schema objects.
- Title and description length limits: Ensure titles stay ≤ 60 characters and descriptions stay between 140–160 characters in both Persian and English.

---

### Task 0: Phase S0 — Brand Rules & Single Source of Entity Truth

**Files:**
- Modify: `AGENTS.md`
- Create: `src/lib/seo/entity.ts`
- Test: `tests/seo-entity.test.ts`

**Interfaces:**
- Produces: `entityConfig` exported from `src/lib/seo/entity.ts`, conforming to `EntitySchema` (Zod).

- [ ] **Step 1: Write unit test verifying entity schema validation**
Verify `src/lib/seo/entity.ts` parses valid entity config and rejects invalid URLs or missing required fields.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx tsx tests/seo-entity.test.ts`
Expected: FAIL (module not found)

- [ ] **Step 3: Append Phase S0 rules to `AGENTS.md` and implement `src/lib/seo/entity.ts`**
Append S0 rules to `AGENTS.md`. Define Zod schema and export validated `entityConfig` with Persian/English canonical names, definition sentences, verified services, and TODO_REAL_DATA placeholders.

- [ ] **Step 4: Run test and typecheck**
Run: `npx tsx tests/seo-entity.test.ts && npm run typecheck`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add AGENTS.md src/lib/seo/entity.ts tests/seo-entity.test.ts
git commit -m "feat(seo): add phase S0 entity configuration and agent rules"
```

---

### Task 1: Phase S1 — Comprehensive Pre-Change SEO Audit

**Files:**
- Create: `scripts/seo-audit.ts`
- Output: `reports/seo-before.md`, `reports/seo-todo.md`

**Interfaces:**
- Consumes: `entityConfig` from `src/lib/seo/entity.ts`, static routes, and sitemap.
- Produces: `reports/seo-before.md` (prioritized issue list) and `reports/seo-todo.md` (missing business facts).

- [ ] **Step 1: Write `scripts/seo-audit.ts`**
Script checks HTTP status, redirects, title/desc lengths, canonical/hreflang, heading outlines, JSON-LD, OG tags, bot user-agent responses (Googlebot, bingbot, GPTBot, ClaudeBot, PerplexityBot), and brand spelling.

- [ ] **Step 2: Run audit script against local build or preview**
Run: `npx tsx scripts/seo-audit.ts`
Expected: Successfully crawls routes and produces reports.

- [ ] **Step 3: Review reports and verify audit findings**
Check `reports/seo-before.md` and `reports/seo-todo.md` to ensure all critical/important/minor issues and missing data items are documented.

- [ ] **Step 4: Commit**
```bash
git add scripts/seo-audit.ts reports/seo-before.md reports/seo-todo.md
git commit -m "feat(seo): add phase S1 audit script and initial baseline reports"
```

---

### Task 2: Phase S2 — Unified Metadata Factory & Verification

**Files:**
- Create: `src/lib/seo/metadata.ts`
- Modify: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/services/page.tsx`, `src/app/[locale]/services/[slug]/page.tsx`, `src/app/[locale]/insights/page.tsx`, `src/app/[locale]/insights/[slug]/page.tsx`, `src/app/[locale]/portfolio/page.tsx`, `src/app/[locale]/portfolio/[slug]/page.tsx`
- Test: `tests/seo-metadata.test.ts`

**Interfaces:**
- Consumes: `entityConfig` from `src/lib/seo/entity.ts`
- Produces: `createPageMetadata()` helper adhering to title/description character constraints, canonical normalization, Open Graph, Twitter cards, and verification codes from env.

- [ ] **Step 1: Write test for metadata factory**
Verify title length ≤ 60 chars, description 140–160 chars, absolute canonical URLs, reciprocal hreflang, and verification tags.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx tsx tests/seo-metadata.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/lib/seo/metadata.ts` and update route metadata generators**
Use defined titles and descriptions from `entityConfig` and spec (e.g. Home, Services `<primary keyword> | <brand>`).

- [ ] **Step 4: Run tests and Next.js build verification**
Run: `npx tsx tests/seo-metadata.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/lib/seo/metadata.ts src/app/ tests/seo-metadata.test.ts
git commit -m "feat(seo): implement phase S2 metadata factory and route metadata"
```

---

### Task 3: Phase S3 — Structured Data (JSON-LD) Engine

**Files:**
- Create: `src/lib/seo/jsonld.ts`
- Create: `src/components/seo/JsonLd.tsx`
- Modify: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/services/[slug]/page.tsx`, `src/app/[locale]/insights/[slug]/page.tsx`, `src/app/[locale]/portfolio/[slug]/page.tsx`, `src/app/[locale]/faq/page.tsx`
- Test: `tests/seo-jsonld.test.ts`

**Interfaces:**
- Produces: Type-safe JSON-LD generator functions: `buildOrganizationJsonLd`, `buildWebSiteJsonLd`, `buildWebPageJsonLd`, `buildServiceJsonLd`, `buildArticleJsonLd`, `buildBreadcrumbJsonLd`, `buildFaqJsonLd`.
- Produces: `<JsonLd schema={...} />` component rendering clean script tag with `application/ld+json`.

- [ ] **Step 1: Write tests for JSON-LD generation**
Verify node schema validity, stable `@id` references (`#organization`, `#website`), and omission of unconfirmed fields.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx tsx tests/seo-jsonld.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement `src/lib/seo/jsonld.ts` and `<JsonLd>` component**
Inject schemas into layout (Organization + WebSite) and inner pages (WebPage, BreadcrumbList, Service, Article, FAQPage).

- [ ] **Step 4: Run test and build**
Run: `npx tsx tests/seo-jsonld.test.ts && npm run build`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/lib/seo/jsonld.ts src/components/seo/JsonLd.tsx src/app/ tests/seo-jsonld.test.ts
git commit -m "feat(seo): implement phase S3 JSON-LD structured data engine"
```

---

### Task 4: Phase S4 — Crawling, Sitemap, AI Robots & IndexNow

**Files:**
- Modify: `src/app/robots.ts`
- Modify: `src/app/sitemap.ts`
- Create: `src/app/api/indexnow/route.ts`
- Create: `scripts/ping-indexnow.ts`
- Create: `src/app/insights/rss.xml/route.ts` (or `[locale]/insights/rss.xml/route.ts`)

**Interfaces:**
- Produces: Valid `robots.txt` supporting `AI_CRAWLERS` env flag (GPTBot, ClaudeBot, PerplexityBot, etc.).
- Produces: `sitemap.xml` with hreflang alternates and real `lastModified`.
- Produces: Protected `/api/indexnow` endpoint and ping script.
- Produces: RSS feed for insights.

- [ ] **Step 1: Write test for robots and sitemap logic**
Test that `robots.ts` disallows `/admin`, `/api` and handles AI bots, and `sitemap.ts` covers 100% indexable routes without drafts.

- [ ] **Step 2: Update `robots.ts`, `sitemap.ts`, add IndexNow and RSS**
Implement AI crawler directives, IndexNow key verification, and XML RSS feed.

- [ ] **Step 3: Run tests and verify outputs**
Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**
```bash
git add src/app/robots.ts src/app/sitemap.ts src/app/api/indexnow/ scripts/ping-indexnow.ts src/app/
git commit -m "feat(seo): implement phase S4 crawling, sitemap, AI bots and IndexNow"
```

---

### Task 5: Phase S5 — GEO Content Structure & Answer Engine Optimization

**Files:**
- Create: `src/components/seo/AnswerBlock.tsx`
- Create: `src/components/navigation/Breadcrumbs.tsx`
- Modify: `src/content/services/`, `src/app/[locale]/services/[slug]/page.tsx`, `src/app/[locale]/about/page.tsx`, `src/app/[locale]/insights/[slug]/page.tsx`

**Interfaces:**
- Produces: `<AnswerBlock>` (40-60 words concise definition matching schema).
- Produces: `<Breadcrumbs>` with microdata and visual hierarchy.
- Injects: Company definition sentence on Home & About; TL;DR blocks on Posts; Fact blocks on About.

- [ ] **Step 1: Implement `<AnswerBlock>` and `<Breadcrumbs>` components**
- [ ] **Step 2: Integrate AnswerBlock and heading outline into service pages**
- [ ] **Step 3: Add TL;DR boxes and bylines to insights posts**
- [ ] **Step 4: Verify build and component rendering**
Run: `npm run build && npm run lint`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/components/seo/AnswerBlock.tsx src/components/navigation/Breadcrumbs.tsx src/app/ src/content/
git commit -m "feat(geo): implement phase S5 answer blocks, breadcrumbs, and GEO content structures"
```

---

### Task 6: Phase S6 — Contact Data Consistency & Trust Signals

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/sections/ContactSection.tsx`
- Modify: `src/app/[locale]/contact/page.tsx`
- Modify: `src/app/[locale]/about/page.tsx`

**Interfaces:**
- Consumes: Contact info from `entityConfig` / settings source.
- Removes: All "contact channels will be published soon" placeholders. Hides empty fields cleanly.

- [ ] **Step 1: Refactor contact displays to use entity config / site settings**
- [ ] **Step 2: Add `rel="me"` to verified social profile links**
- [ ] **Step 3: Run lint and typecheck**
Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**
```bash
git add src/components/layout/Footer.tsx src/components/sections/ContactSection.tsx src/app/
git commit -m "feat(seo): implement phase S6 contact consistency and trust indicators"
```

---

### Task 7: Phase S7 — Technical Quality & Performance Polish

**Files:**
- Modify: `src/app/[locale]/layout.tsx` (font preloading)
- Modify: `next.config.ts` (caching headers, compression)
- Modify: Key image components (explicit sizes, priority on hero, lazy loading elsewhere)

**Interfaces:**
- Ensures: Core Web Vitals readiness (LCP < 2.5s, CLS < 0.1), SSR content readability with JS disabled.

- [ ] **Step 1: Audit and optimize image `sizes` attributes and loading flags**
- [ ] **Step 2: Configure cache headers in `next.config.ts`**
- [ ] **Step 3: Test SSR with JavaScript disabled**
- [ ] **Step 4: Verify build passes cleanly**
Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add next.config.ts src/app/ src/components/
git commit -m "perf(seo): implement phase S7 technical performance and asset caching optimizations"
```

---

### Task 8: Phase S8 — Measurement, AI Referral Analytics & llms.txt

**Files:**
- Modify: `src/lib/analytics.ts`
- Create: `docs/ai-visibility-check.md`
- Create: `src/app/llms.txt/route.ts`

**Interfaces:**
- Produces: Referral classifier recognizing AI assistants (`chatgpt.com`, `perplexity.ai`, `gemini.google.com`, `claude.ai`, `copilot.microsoft.com`).
- Produces: `docs/ai-visibility-check.md` with 20 bilingual test prompts and tracking table.
- Produces: `/llms.txt` route summarizing company and services for LLMs.

- [ ] **Step 1: Implement AI assistant referrer classification in `analytics.ts`**
- [ ] **Step 2: Create `docs/ai-visibility-check.md` and `/llms.txt` endpoint**
- [ ] **Step 3: Verify build and response of `/llms.txt`**
Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**
```bash
git add src/lib/analytics.ts docs/ai-visibility-check.md src/app/llms.txt/route.ts
git commit -m "feat(seo): implement phase S8 AI referrer tracking, visibility doc and llms.txt"
```

---

### Task 9: Phase S9 — Regression Test Suite & Final Audit Report

**Files:**
- Create: `tests/seo-regression.spec.ts`
- Output: `reports/seo-after.md`

**Interfaces:**
- Checks: Title/desc lengths, single H1, canonical & hreflang reciprocity, JSON-LD schema validity, robots & sitemap coverage, AI bot status comparison, brand spelling consistency.
- Produces: `reports/seo-after.md` comparing before vs after metrics.

- [ ] **Step 1: Write Playwright/Vitest SEO regression suite**
- [ ] **Step 2: Run full test suite and update audit script**
Run: `npx playwright test tests/seo-regression.spec.ts` (or tsx runner)
- [ ] **Step 3: Generate `reports/seo-after.md`**
- [ ] **Step 4: Commit**
```bash
git add tests/seo-regression.spec.ts reports/seo-after.md
git commit -m "test(seo): implement phase S9 regression suite and final after-report"
```
