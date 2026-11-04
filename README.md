# Kara Pardaz Avand (کارا پرداز اوند)

Official website — Next.js App Router, Tailwind CSS, next-intl (`fa` default, `en` secondary), MDX content.

Agent rules: [`AGENTS.md`](./AGENTS.md). Launch gate: [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md).

## Setup (< 5 minutes)

```bash
cd kara-web
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000/fa](http://localhost:3000/fa) (RTL) or [http://localhost:3000/en](http://localhost:3000/en) (LTR).

### Environment

| Variable | When | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Before `next build`** | Absolute URLs for canonical, hreflang, OG, sitemap |
| `NEXT_PUBLIC_PARENT_BRAND_URL` | Build | Code1Sprint / parent brand link + JSON-LD |
| `CONTACT_WEBHOOK_URL` | Runtime | POST target for `/api/contact`. Empty → 503 |
| `NEXT_PUBLIC_ANALYTICS_SCRIPT_URL` | Build (optional) | Cookie-free analytics script URL; empty = no tracking |
| `NEXT_PUBLIC_ANALYTICS_DOMAIN` | Build (optional) | Plausible-style `data-domain` |
| `NEXT_PUBLIC_ANALYTICS_WEBSITE_ID` | Build (optional) | Umami-style website id |

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run format` | Prettier |
| `npm run build` | Production build |
| `npm run start` | Serve production build |

## Ship a content change in under 10 minutes

1. Edit the right file under `src/content/` or `messages/{fa,en}.json` (tables below).
2. `npm run typecheck` (catches schema / i18n shape issues).
3. Spot-check in `npm run dev`, or `npm run build` before merge.
4. Commit and deploy (Vercel rebuild). No code change needed for new MDX posts/projects once frontmatter is valid.

Do **not** invent clients, stats, logos, or legal claims. Leave `TODO_REAL_DATA` or omit; list open Biz items in `LAUNCH_CHECKLIST.md`.

## Content editing guide

Marketing copy lives under **`src/content/`**. UI chrome (buttons, nav, empty states) lives in **`messages/fa.json`** and **`messages/en.json`**. Keep fa/en keys in sync.

### Site chrome & contact

- `src/content/site.ts` — nav paths, legal links, contact channels, parent URL helpers.
- To show a channel: set real `value` and `href` (must not be `TODO_REAL_DATA`). Unresolved channels stay hidden.
- Address: `contactAddress` in the same file.
- Hours / booking: `src/content/contact.ts`.

### Add a service (~5 min)

1. Create `src/content/services/<slug>.ts` following an existing service (e.g. `crm.ts`).
2. Register it in the `servicesRaw` array in `src/content/services/index.ts`.
3. Routes `/services/[slug]`, nav dropdown, sitemap, and home bento pick it up automatically.
4. Run `npm run typecheck`.

### Add a portfolio project (~5–8 min)

1. Add `src/content/projects/<slug>.mdx` with YAML frontmatter (`title`, `sector`, `services`, `problem`, `solution`, `results`, `stack`, `cover`, `featured`, `status`).
2. Put cover art under `public/` (path in `cover`).
3. `status: draft` — visible in **dev only**. `status: published` for production.
4. Each result needs a non-empty `source` or the metric stays hidden.
5. Do not invent clients, logos, or numbers.

### Add an insights post (~5 min)

1. Add `src/content/posts/<slug>.mdx` with `title`, `date`, `summary`, `tags`, `readingTime`.
2. Write the MDX body (GFM supported).
3. Index, detail, sitemap, and RSS (`/insights/rss.xml`) update from the loader.

### Add or edit FAQ (~3 min)

1. Edit `src/content/faq.ts` — topics in `faqTopicsRaw`, items in `faqItemsRaw`.
2. Keep `question` / `answer` localized (`fa` + `en`).
3. Leave `needs_business_confirmation: true` until Biz confirms; do not invent SLAs.
4. Home FAQ teaser + `/faq` + FAQPage JSON-LD read the same source.

### Legal text (~3 min once counsel-approved)

1. Edit `src/content/legal/privacy.mdx` and `terms.mdx`.
2. Frontmatter: `title`, optional `summary` / `updated`.
3. Served at `/privacy`, `/terms`, and `/legal/[slug]`.
4. Replace placeholder “pending counsel” prose with approved text — never ship invented legal claims.

### Other TS content

| File | Section |
| --- | --- |
| `systems.ts` | Hero / system map vignettes |
| `process.ts` | Process timeline + engagement models |
| `why.ts` | “Why us” statements |
| `stats.ts` | Trust metrics (hidden while `TODO_REAL_DATA`) |
| `cta.ts` | Final CTA band |
| `stack.ts` | Stack strip |
| `about.ts` | About page blocks |
| `contact.ts` | Contact options, response time, hours |

### After a content change

```bash
npm run typecheck
npm run lint   # if you touched TS/TSX
npm run build  # before release
```

## Release steps

1. Clear or accept Biz rows in [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md) (contact, legal, published projects) without inventing data.
2. Set Production env on Vercel: `NEXT_PUBLIC_SITE_URL`, parent URL, `CONTACT_WEBHOOK_URL` (+ optional analytics).
3. Project settings: **Root Directory** `kara-web`, Node **20+**, build `npm run build`.
4. Custom domain → HTTPS; rebuild after domain/URL change so canonicals match.
5. Host redirects only for old domains / apex↔www; locales are app-routed.
6. Smoke the checklist (§8): home, services, portfolio empty/success, contact, legal, sitemap, robots, RSS, OG, 404.
7. Optional post-launch: Sentry (error monitoring), enable analytics + update privacy MDX.

Deploy credentials were not present in Phase 13 — follow this section when ready; do not deploy blindly.

## Docs

- [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md) — env, routes, Biz markers, smoke
- [`docs/phase-13-qa.md`](./docs/phase-13-qa.md) — visual / RTL / cross-browser notes
- [`docs/phase-13-report.md`](./docs/phase-13-report.md) — Phase 13 acceptance report
- [`docs/phase-12-report.md`](./docs/phase-12-report.md) — SEO / Lighthouse / a11y
- [`docs/phase-11-qa.md`](./docs/phase-11-qa.md) — earlier visual pass
