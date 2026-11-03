# Phase 10 — SEO / performance / accessibility report

Date: 2026-11-03  
App: `kara-web`  
Environment: production `next start`, `NEXT_PUBLIC_SITE_URL` matching the request origin.

## Acceptance checklist

| Item | Result |
|------|--------|
| Metadata API (title, description, canonical, hreflang, OG, Twitter) on routes | Pass |
| Dynamic OG images via `next/og` (`/api/og`) | Pass |
| `sitemap.xml` + `robots.txt` | Pass |
| JSON-LD: Organization (+ parentOrganization Code1Sprint), WebSite | Pass |
| JSON-LD: BreadcrumbList / FAQPage (existing Phase 9) | Pass (unchanged) |
| Fonts: preload + `display: swap` + `adjustFontFallback` | Pass |
| Lighthouse mobile ≥95 on home, services, portfolio | Pass (see below) |
| axe serious/critical = 0 | Pass via Lighthouse a11y audits (axe engine); `@axe-core/cli` noted below |
| AA contrast (token check) | Pass (computed) |

## Lighthouse (mobile)

Tool: `npx lighthouse` + Chrome headless. Categories: performance, accessibility, SEO.

| Page | Performance | Accessibility | SEO | LCP |
|------|---------------|---------------|-----|-----|
| `/fa` | 100 | 100 | 100 | 0.9 s |
| `/fa/services` | 100 | 100 | 100 | 0.9 s |
| `/fa/portfolio` | 100 | 100 | 100 | 0.8 s |

Binary audit failures: none (with `NEXT_PUBLIC_SITE_URL` matching the browsed origin).

### Important env note

Canonical / OG absolute URLs are baked at **build** time from `NEXT_PUBLIC_SITE_URL`. If that value does not match the host under test, Lighthouse SEO fails `canonical` (score ~92) even though the Metadata API is correct. Production builds must set the real site URL before `next build`.

## axe

- Lighthouse accessibility category uses axe-core rules; score **100** on the three pages above (no serious/critical findings in that run).
- Standalone `@axe-core/cli` was attempted but failed here: ChromeDriver only supports Chrome 152 while the installed browser is 156. Re-run after aligning drivers, or rely on Lighthouse a11y for CI.

## Contrast (tokens)

WCAG AA contrast ratios (computed):

| Pair | Ratio | AA |
|------|-------|----|
| muted `#5A6482` on bg `#F6F7FB` | 5.48 | Pass |
| muted on panel `#FFFFFF` | 5.87 | Pass |
| text `#131A2E` on bg | 16.15 | Pass |
| muted `#9AA5C4` on dark bg `#0D1220` | 7.61 | Pass |

## Smoke

- `GET /robots.txt` → 200; allows `/`, disallows `/api/contact`, `/fa/design`, `/en/design`; sitemap URL present.
- `GET /sitemap.xml` → 200; fa/en + `x-default` xhtml alternates for static + service/project/post/legal paths.
- `GET /api/og?locale=fa&title=…` → 200 `image/png` 1200×630.

## Fixes applied during audit

- Language switcher: removed mismatched `aria-label` (visible `FA`/`EN`); use `title` for full locale name.
- Process timeline triggers: removed `aria-label` that omitted visible button text.
- Services mobile accordion / detail pane heading levels aligned with page vs home section context.
- Project cover images: meaningful `alt` from project title.
- `robots` `host` uses hostname only; OG route under `/api/og` so next-intl proxy does not rewrite it.

## Remaining gaps → Phase 11

- Set production `NEXT_PUBLIC_SITE_URL` (and rebuild) for real canonicals.
- Fill `TODO_REAL_DATA` contact channels / legal copy / FAQ confirmations; remove markers from visible output or list owners in `LAUNCH_CHECKLIST.md`.
- Visual QA at 360–1440, fa/en, light/dark; cross-browser.
- Deploy (Vercel), analytics, error monitoring, README content-editing guide.
- Optional: English FAQ translation (FAQ content is still Persian-first).
- Optional: dedicated Persian webfont file for OG PNG (currently system UI font).

## Blockers

None for Phase 10 completion. Lighthouse ≥95 and a11y clean on the three key pages were verified in this environment when site URL matched the request host.
