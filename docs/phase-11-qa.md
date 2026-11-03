# Phase 11 — Visual / QA pass notes

Date: 2026-11-03  
App: `kara-web`  
Method: code + content audit, production build, HTTP smoke on critical routes. Full device-lab / Safari iOS / Firefox matrix was **not** run in this environment (no browser farm); treat cross-browser as a short manual pass on the deploy preview.

## What was checked

| Area | Result |
|------|--------|
| Physical `left`/`right` / `ml-`/`mr-` in `src` | None found — logical Tailwind (`ms`/`me`/`ps`/`pe`/`text-start`) used |
| RTL icon / punctuation risks | No obvious mirrored-icon bugs in layout chrome; keep an eye on chevrons during manual fa pass |
| Visible `TODO_REAL_DATA` / `TODO_TRANSLATE` in About + Legal | **Fixed** this phase — replaced with honest placeholder copy; gaps listed for Biz in `LAUNCH_CHECKLIST.md` |
| FAQ trailing `needs_business_confirmation` in answer strings | **Removed** from answer text (flag remains on items); UI strip kept as defense |
| Contact / stats / CTA placeholders | Correctly filtered out of public UI when unresolved |
| Draft portfolio | Hidden in production; empty state copy present |
| SEO/layout regressions | No intentional SEO/layout redesign; content-only + docs |

## Breakpoints / locales / themes (manual checklist)

Run on deploy preview or local `next start`:

| Viewport | fa light | fa dark | en light | en dark |
|----------|----------|---------|----------|---------|
| 360 | [ ] home, services, contact | [ ] | [ ] | [ ] |
| 768 | [ ] | [ ] | [ ] | [ ] |
| 1024 | [ ] | [ ] | [ ] | [ ] |
| 1440 | [ ] | [ ] | [ ] | [ ] |

Focus: header wrap, services master-detail / accordion, portfolio empty vs rows, contact form, legal prose measure, theme flash, language switch.

## Cross-browser

| Browser | Status |
|---------|--------|
| Chrome (latest) | Smoke via headless / local build tooling |
| Firefox (latest) | Manual — pending owner |
| Safari / iOS | Manual — pending owner |

## Remaining markers for the business owner

| Marker / flag | Where | Public behavior | Owner action |
|---------------|-------|-----------------|--------------|
| `TODO_REAL_DATA` | `src/content/site.ts` contact channels | Omitted from UI | Fill real email/phone/social |
| `TODO_REAL_DATA` | `src/content/stats.ts` | Strip not rendered | Confirm metrics or leave empty |
| `TODO_REAL_DATA` | `src/content/cta.ts` assurances | Not rendered | Confirm short assurances |
| Placeholder legal | `src/content/legal/*.mdx` | Honest “pending counsel” language | Replace with approved text |
| `needs_business_confirmation` | `src/content/faq.ts`, `why.ts` | Draft answers/claims visible | Confirm or soften |
| About history/team | `src/content/about.ts` | Explicit “pending confirmation” | Supply story |
| Draft projects | `src/content/projects/*.mdx` | Hidden in prod | Publish real case studies (`status: published`) + sourced results |
| EN FAQ | FAQ is Persian-first | Same FA answers on EN locale for FAQ block | Optional EN translation |

## Small fixes applied in Phase 11

- Stripped visible `TODO_*` strings from About and Legal.
- Cleaned FAQ answer source strings.
- Added `LAUNCH_CHECKLIST.md` and expanded `README.md` content-edit guide.

## Verdict (engineering)

Production build is the gate for code ship-readiness. Content completeness for marketing/legal/contact remains **Biz-blocked** where noted above — that is intentional, not inventable.
