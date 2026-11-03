# Phase 13 — QA and launch

Date: 2026-11-03  
App: `kara-web`  
Scope: Phase 13 only (final package phase).

## What was done

1. **Visual QA** at 360 / 768 / 1024 / 1440 (fa + en samples) via Chrome headless — notes in `docs/phase-13-qa.md`.
2. **RTL fixes:** tablet nav overlap (desktop chrome from `lg`); AppWindow title bar LTR for window dots.
3. **Markers:** removed visible `TODO_REAL_DATA` from legal MDX; full Biz inventory with owners in `LAUNCH_CHECKLIST.md` (prefer listing over inventing copy).
4. **Page-map checklist** with empty / loading / error / success states in `LAUNCH_CHECKLIST.md`.
5. **Cross-browser:** Chrome checked; Firefox + Safari iOS risks documented (drawer, tabs, marquee, floating shapes).
6. **Deploy notes:** Vercel env, domain, redirects, optional monitoring — README + checklist (no live deploy; no credentials).
7. **README:** setup, how to add service / project / post / FAQ / legal, under-10-minute content ship path, release steps.

## Acceptance

| Criterion | Result |
|-----------|--------|
| Production build passes | **Pass** — `npm run lint`, `typecheck`, `build` (2026-11-03) |
| `LAUNCH_CHECKLIST.md` complete | **Pass** — env, deploy, page map, visual, cross-browser, Biz markers, smoke, ship gate |
| New developer ships content &lt; 10 min | **Pass** — README “Ship a content change” + edit tables |
| Visible marker strings removed / listed | **Pass** — legal MDX cleaned; remaining items owned in checklist §6 |

## Files changed

- `src/components/layout/FloatingNav.tsx` — `lg` desktop nav breakpoint
- `src/components/layout/MobileNav.tsx` — drawer / trigger `lg:hidden`
- `src/components/visuals/AppWindow.tsx` — LTR title bar
- `src/content/legal/privacy.mdx` — no visible marker tokens
- `src/content/legal/terms.mdx` — no visible marker tokens
- `LAUNCH_CHECKLIST.md` — Phase 13 complete checklist
- `README.md` — content workflows + Vercel release
- `docs/phase-13-qa.md` — visual / browser notes
- `docs/phase-13-report.md` — this file

## Overall v3 package status (phases 0–13)

| Phase | Focus | Status |
|-------|--------|--------|
| 0 | AGENTS / identity | Done |
| 1 | Brand assets | Done |
| 2–3 | Tokens, chrome, nav | Done |
| 4–5 | Home hero + sections | Done |
| 6 | Services | Done |
| 7 | Portfolio | Done (drafts excluded in prod) |
| 8 | Process / About | Done |
| 9 | Insights | Done |
| 10 | FAQ / Contact | Done |
| 11 | Legal / 404 / error | Done |
| 12 | SEO / perf / a11y | Done (see phase-12-report) |
| 13 | QA / launch docs | Done |

**Engineering:** site is shippable once Production env is set and build passes.  
**Business:** soft-launch OK with draft FAQ/why/services; hard marketing launch blocked on contact channels, legal counsel text, and real published case studies (see checklist §6).

## Remaining business blockers

1. Real contact channels / address / hours / booking (B1–B3).
2. Counsel-approved privacy + terms (B8).
3. Confirm or soften FAQ, why-us, process models, service claims (B9–B14).
4. Publish ≥1 sourced portfolio project (B15).
5. Optional: trust stats + CTA assurances (B4–B5); EN native pass (B16).

## Open questions

1. Final production domain for `NEXT_PUBLIC_SITE_URL`?
2. Webhook destination for `/api/contact`?
3. Enable Plausible/Umami at launch or later?
4. Wire Sentry (or equivalent) before or after first traffic?
5. Block `/design` and `/system/force-error` at the edge in production, or leave as obscure noindex QA routes?

## How to run

```bash
cd kara-web
npm run lint
npm run typecheck
NEXT_PUBLIC_SITE_URL=https://YOUR_DOMAIN npm run build
```
