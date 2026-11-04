# Launch checklist — Kara Pardaz Avand (`kara-web`)

Owner columns: **Dev** = engineering, **Biz** = business / legal owner.

Phase 13 pass date: 2026-11-03.

---

## 1. Before production build

| # | Item | Owner | Status |
|---|------|-------|--------|
| 1 | Set `NEXT_PUBLIC_SITE_URL` to the **final** public origin (e.g. `https://example.com`) **before** `next build`. Canonical, hreflang, OG, and sitemap absolute URLs are baked at build time. | Dev | Required |
| 2 | Confirm `NEXT_PUBLIC_PARENT_BRAND_URL` (default `https://code1sprint.com`). Used for About parent link + Organization JSON-LD. | Biz + Dev | Confirm |
| 3 | Set `CONTACT_WEBHOOK_URL` to a reachable HTTPS endpoint that accepts JSON `{ name, phone, email, contact, service, stage, message, consent, submittedAt, source }`. Empty → contact API returns **503** `misconfigured`. | Dev | Required for form |
| 4 | Copy `.env.example` → Vercel / host env; never commit secrets. | Dev | Required |
| 5 | Rebuild after any change to `NEXT_PUBLIC_*` (those are inlined at build). | Dev | Required |
| 5b | Optional analytics: `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` (+ domain / website id). Empty = zero tracking. Update privacy MDX when enabling. | Biz + Dev | Optional |

---

## 2. Deploy (Vercel)

| # | Item | Owner | Notes |
|---|------|-------|--------|
| 6 | Root directory: `kara-web` (monorepo) or deploy this folder alone. | Dev | Framework preset: Next.js |
| 7 | Build: `npm run build` · Output: Next default · Node: **20+** | Dev | |
| 8 | Custom domain + HTTPS | Dev | Point DNS; set `NEXT_PUBLIC_SITE_URL` to that domain and **rebuild** |
| 9 | Redirects | Dev | Locale routing is app-handled (`/fa`, `/en`). Add host-level 301s only if an old domain must move to the new one. Optional: apex ↔ `www`. |
| 10 | Preview vs Production env | Dev | Production site URL only on Production; Preview may use the preview URL |
| 11 | Fonts / network | Dev | Vazirmatn + JetBrains Mono via `next/font`. No third-party analytics unless env set |
| 12 | Privacy-friendly analytics (optional) | Biz + Dev | Stub wired — see row 5b |
| 13 | Error monitoring (optional) | Dev | **Not wired.** Add Sentry (or similar) post-launch if desired; capture `/api/contact` failures and `error.tsx` digests |
| 13b | Do **not** invent contact details, stats, client logos, or legal text to clear Biz rows | Biz | Ship with omissions / draft copy listed below |

**Deploy was not executed in Phase 13** (no production credentials in this environment). Prefer docs + checklist above.

---

## 3. Page map — route checklist

Locales: exercise **fa** (RTL) and **en** (LTR) unless noted. States: **empty** / **loading** / **error** / **success**.

| Route | Success | Empty | Loading | Error | Notes |
|-------|---------|-------|---------|-------|-------|
| `/[locale]` (home) | [ ] | — | [ ] Suspense / route fade | — | Hero, AppWindow, bento, FAQ teaser, CTA |
| `/[locale]/services` | [ ] | — | [ ] `services/loading` | — | Master-detail / accordion |
| `/[locale]/services/[slug]` ×6 | [ ] | — | [ ] | invalid slug → 404 | Slugs: `crm`, `erp`, `rag-ai`, `data-science`, `web-platforms`, `custom-software` |
| `/[locale]/portfolio` | [ ] | [ ] no published projects (prod today) | [ ] `portfolio/loading` | — | Drafts hidden when `NODE_ENV=production` |
| `/[locale]/portfolio/[slug]` | [ ] after publish | — | [ ] | draft/missing → 404 in prod | Dev can open drafts |
| `/[locale]/process` | [ ] | — | [ ] | — | Durations omitted while `TODO_REAL_DATA` |
| `/[locale]/about` | [ ] | story/photos omitted when unresolved | [ ] | — | |
| `/[locale]/insights` | [ ] | filter no-match empty | [ ] `insights/loading` | — | |
| `/[locale]/insights/[slug]` | [ ] | — | [ ] | missing → 404 | Posts: `crm-fit`, `rag-boundaries`, `staged-delivery` |
| `/[locale]/faq` | [ ] | search no-match empty | [ ] `faq/loading` | — | |
| `/[locale]/contact` | [ ] form | channels omitted | [ ] | API: 400/429/503 + UI messages | Success path needs webhook |
| `/[locale]/privacy` | [ ] | — | [ ] Suspense fallback | — | Alias of legal privacy |
| `/[locale]/terms` | [ ] | — | [ ] | — | Alias of legal terms |
| `/[locale]/legal/[slug]` | [ ] | — | [ ] | unknown slug → 404 | `privacy`, `terms` |
| 404 (`/[...rest]`, not-found) | [ ] | — | — | [ ] | CTAs to services / portfolio / contact |
| Runtime error | — | — | — | [ ] | QA: `/[locale]/system/force-error` (noindex) |
| `/sitemap.xml` | [ ] | — | — | — | Host must match production |
| `/robots.txt` | [ ] | — | — | — | |
| `/insights/rss.xml` | [ ] | — | — | — | |
| `/api/og?locale=fa&title=test` | [ ] | — | — | — | `image/png` |
| `/api/contact` | [ ] | — | — | [ ] 503 without webhook; 429 rate limit | POST JSON |

Dev-only: `/[locale]/design` (token gallery) — do not market; optional to block in prod later.

### Contact form states (detail)

| State | How to verify | Owner |
|-------|---------------|-------|
| Idle / validation | Required fields + consent | Dev |
| Success | Webhook 2xx → success message | Dev |
| Misconfigured | Empty `CONTACT_WEBHOOK_URL` → 503 + UI | Dev |
| Rate limit | >5 submits / 15 min → 429 | Dev |
| Network / 5xx | Webhook down → error message | Dev |

---

## 4. Visual QA (Phase 13)

Method: Chrome headless screenshots at **360 / 768 / 1024 / 1440** for fa + sample en; code audit for logical CSS; HTML scrape for marker leaks. Full notes: [`docs/phase-13-qa.md`](./docs/phase-13-qa.md).

| Viewport | fa | en | Result |
|----------|----|----|--------|
| 360 | home, portfolio empty, contact, 404 shell | home, contact | Pass — drawer trigger text OK; RTL logo/start correct |
| 768 | home, contact, privacy, faq | — | **Fixed:** horizontal nav overlapped language/CTA → desktop links now from **`lg` (1024)** |
| 1024 | home, services/crm, process, insights | — | Pass |
| 1440 | home, about | home | Pass — floating shapes + marquee |

RTL fixes applied this phase:

- Nav density: tablet uses mobile drawer until 1024px (no link/CTA collision).
- `AppWindow` title bar forced **LTR** so window dots stay on the physical left in fa.

Known intentional behaviors: marquee + console/code blocks use `[direction:ltr]`; tech acronyms mixed into Persian body.

---

## 5. Cross-browser

| Browser | Status | Risks to re-check on preview |
|---------|--------|------------------------------|
| Chrome (latest) | Headless + local screenshots this phase | Baseline |
| Firefox (latest) | **Not run here** | `backdrop-filter` on nav glass; `mask-image` marquee edges; Motion + `prefers-reduced-motion` |
| Safari / iOS | **Not run here** | Drawer `inert` + focus trap; `100dvh` / safe-area; sticky nav; `-webkit-backdrop-filter`; marquee mask; floating shape SVG animation jank |

Manual matrix owner: **Dev** on first Vercel preview before go-live.

---

## 6. Content markers (`TODO_REAL_DATA` / `needs_business_confirmation`)

**Policy:** do not invent business copy. Markers stay in source; public UI either **omits** the field or shows **cautious draft** prose **without** the literal marker strings. Visible `TODO_REAL_DATA` was removed from legal MDX in Phase 13.

| ID | Marker | Location | Public behavior | Owner |
|----|--------|----------|-----------------|-------|
| B1 | `TODO_REAL_DATA` | `src/content/site.ts` — email, phone, telegram, whatsapp, instagram, github, linkedin | Omitted | Biz |
| B2 | `TODO_REAL_DATA` | `src/content/site.ts` — `contactAddress` | Omitted | Biz |
| B3 | `TODO_REAL_DATA` | `src/content/contact.ts` — working hours, booking href | Omitted | Biz |
| B4 | `TODO_REAL_DATA` | `src/content/stats.ts` — trust metrics | Trust strip not rendered | Biz |
| B5 | `TODO_REAL_DATA` | `src/content/cta.ts` — CTA assurances | Assurances not rendered | Biz |
| B6 | `TODO_REAL_DATA` | `src/content/process.ts` — all step `duration`s + one communication row | Durations / row omitted | Biz |
| B7 | `TODO_REAL_DATA` | `src/content/about.ts` — story body, team photos | Story/photos omitted | Biz |
| B8 | Legal placeholders | `src/content/legal/privacy.mdx`, `terms.mdx` | Honest “pending counsel” Persian framework (no marker tokens) | Biz + Legal |
| B9 | `needs_business_confirmation` | `src/content/faq.ts` — all FAQ answers | Draft answers visible; flag not shown as text | Biz |
| B10 | `needs_business_confirmation` | `src/content/why.ts` | Draft claims visible | Biz |
| B11 | `needs_business_confirmation` | `src/content/process.ts` — engagement models + communication rows | Draft copy visible | Biz |
| B12 | `needs_business_confirmation` | `src/content/about.ts` — values / team bios | Draft copy visible | Biz |
| B13 | `needs_business_confirmation` | `src/content/contact.ts` — response-time copy | Draft visible | Biz |
| B14 | `needs_business_confirmation` | `src/content/services/*.ts` — selected outcomes / FAQ / claims | Draft on service pages | Biz |
| B15 | `needs_business_confirmation` | `src/content/projects/*.mdx` | Drafts; **hidden in production** until `status: published` | Biz |
| B16 | EN polish | FAQ / some service EN still Persian-first | Optional native EN pass | Biz |

---

## 7. Content & portfolio behavior

| # | Item | Owner | Status |
|---|------|-------|--------|
| 14 | Portfolio MDX with `status: draft` hidden in production | Dev | Working |
| 15 | Sample projects currently **draft** → prod `/portfolio` empty state | Biz | Expected |
| 16 | Project `results` require non-empty `source` | Biz | Enforced |
| 17–23 | See marker table (§6) | Biz | Open |

---

## 8. Post-deploy smoke

- [ ] `GET /fa`, `/en` → 200
- [ ] `/fa/services`, `/fa/services/crm`, `/fa/portfolio`, `/fa/process`, `/fa/about`, `/fa/insights`, `/fa/insights/crm-fit`, `/fa/faq`, `/fa/contact`, `/fa/privacy`, `/fa/terms` → 200
- [ ] Unknown path → localized 404
- [ ] `/sitemap.xml`, `/robots.txt`, `/insights/rss.xml` → 200; sitemap host = production
- [ ] `/api/og?locale=fa&title=test` → 200 `image/png`
- [ ] Contact: webhook success; 429 after 5 / 15 min; 503 if misconfigured
- [ ] Language switch fa ↔ en preserves path
- [ ] Portfolio empty state acceptable until first published case study
- [ ] No literal `TODO_REAL_DATA` / `needs_business_confirmation` in page body text

---

## 9. Ship gate

| Gate | Owner | Criterion |
|------|-------|-----------|
| Engineering | Dev | `npm run lint` + `typecheck` + `build` pass; env 1–4 set; rows 14–16 understood |
| Content soft-launch | Biz | Accept draft FAQ/why/services copy **or** confirm/soften B9–B14 |
| Marketing hard-launch | Biz | Fill B1–B5 (+ B6–B7 as needed); publish ≥1 project; counsel-approved legal (B8) |
| Monitoring | Dev | Optional Sentry + analytics after privacy update |

**Do not invent** contact details, stats, client logos, or legal text to clear Biz rows.
