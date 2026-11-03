# Phase 13 — Visual / cross-browser QA

Date: 2026-11-03  
App: `kara-web`  
Method: Chrome headless screenshots (360 / 768 / 1024 / 1440), HTML scrape for marker leaks, source audit for physical `left`/`right` utilities. Firefox and Safari/iOS **not** available in this environment.

## Viewports checked

| Viewport | Locale / routes | Outcome |
|----------|-----------------|---------|
| 360 | fa home, portfolio (empty), services, contact; en home, contact | Pass — RTL logo/start, drawer label, mixed CRM/ERP/AI copy OK |
| 768 | fa home, contact, privacy, faq | **Bug found:** horizontal nav collided with language switcher / CTA. **Fixed** by showing desktop links from `lg` (1024) and keeping drawer through tablet |
| 1024 | fa home, services/crm, process, insights | Pass |
| 1440 | fa home, about; en home | Pass — floating ribbon/triangle + LTR marquee |

Screenshots captured under `docs/phase-13-qa/*.png` (local evidence; may be gitignored).

## RTL / mixed script

| Check | Result |
|-------|--------|
| Logical Tailwind (`ms`/`me`/`ps`/`pe`/`text-start`/`start`/`end`) | Pass — no `ml-`/`mr-`/`text-left` in UI components |
| AppWindow traffic lights in fa | Were on logical start (physical right). **Fixed:** title bar `[direction:ltr]` |
| Console / code / marquee | Intentional `[direction:ltr]` |
| Select chevron | `end-4` — correct |
| Punctuation in Persian empty states / heroes | OK in screenshots |
| Literal `TODO_REAL_DATA` in body | Legal MDX had visible tokens — **removed** (honest placeholder prose kept) |
| Literal `needs_business_confirmation` in body | Not shown (RSC payload only); listed for Biz in `LAUNCH_CHECKLIST.md` |

## Cross-browser risks (untested)

| Surface | Chrome | Firefox risk | Safari iOS risk |
|---------|--------|--------------|-----------------|
| Floating glass nav | OK | `backdrop-filter` fallback | `-webkit-backdrop-filter`, safe-area |
| Mobile drawer | OK (code review) | `inert` support | Focus trap + overflow lock |
| Tabs / vertical tabs | Keyboard RTL mapped | — | Touch scroll |
| Marquee mask | OK | `mask-image` gaps | Same |
| Floating shapes | OK | SVG + CSS animation | Reduced-motion + battery |
| AppWindow / Motion | OK | — | Large client islands |

## States smoke (engineering)

| State | Evidence |
|-------|----------|
| Portfolio empty | Screenshot `/fa/portfolio` — empty copy + band CTA |
| Loading | Route `loading.tsx` skeletons exist for home/services/portfolio/insights/faq |
| Error | `error.tsx` + `/system/force-error` QA trigger |
| 404 | `not-found.tsx` + catch-all |
| Contact success/error | Requires webhook; documented in checklist |

## Fixes applied this phase

1. `FloatingNav` / `MobileNav` — desktop chrome from **`lg`**, not `md`.
2. `AppWindow` — LTR title bar for window dots.
3. Legal MDX — strip visible `TODO_REAL_DATA:` prefixes.
