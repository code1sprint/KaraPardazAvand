# Process cards accordion (کشویی) — Design

**Date:** 2026-11-03  
**Status:** Approved in conversation; awaiting implementation  
**Scope:** Home/section `ProcessTimeline` and `/process` `ProcessVerticalTrack`

## Goal

Process step cards open and close with a height slide animation. Only one card may be open at a time; clicking the open card closes it.

## Current behavior

- `ProcessTimeline` (home / shared section) and `ProcessVerticalTrack` (`/process`) already toggle detail panels via `activeId`.
- One step is always open; clicking the active card does not close it.
- Panel show/hide is instant (`hidden` + conditional render); no height animation.
- Focusing a trigger also activates that step (`onFocus`), which is undesirable for keyboard navigation.

## Chosen approach

Keep both components and their layouts (horizontal timeline on desktop for `ProcessTimeline`; vertical track for `ProcessVerticalTrack`). Add accordion semantics and height animation in place. Do not replace with the FAQ `Accordion` component (would drop the desktop horizontal composition).

## Behavior

| Interaction | Result |
|-------------|--------|
| Click closed card | That card opens; any other open card closes |
| Click open card | That card closes (`activeId = null`) |
| Initial load | First step open (`steps[0].id`) |
| Keyboard focus | Does not open/close; only click / Enter / Space on the button |
| `prefers-reduced-motion: reduce` | Instant open/close (no height tween) |

## Visual

- Header always visible: step number, title, purpose summary.
- Collapsible body: deliverables, client involvement, duration (when resolved).
- Orange border / number ring only when that card is open; closed cards use neutral line/muted styles.
- No new icons required; optional chevron is out of scope to avoid visual drift from the current card look.

## Technical notes

- Files to change: `kara-web/src/components/sections/ProcessTimeline.tsx`, `kara-web/src/components/sections/ProcessVerticalTrack.tsx`.
- State: `useState<string | null>(steps[0]?.id ?? null)`.
- Toggle helper: if `id === activeId` then `null`, else `id`.
- Animate panel with `motion/react` (`AnimatePresence` + height `auto` / `0`, opacity), matching existing site usage (`useReducedMotion`).
- Accessibility already present (`aria-expanded`, `aria-controls`, `role="region"`); keep and ensure `aria-expanded={false}` when closed.
- No content/copy changes; no new messages or content schema fields.
- Server `ProcessSection` unchanged aside from any prop wiring if needed (none expected).

## Out of scope

- Multiple panels open at once
- Replacing with shared `Accordion` UI
- Changing horizontal desktop timeline to a vertical FAQ list
- Content edits in `process.ts`

## Acceptance

1. Only one process card detail panel open at a time (or none).
2. Clicking the open card closes its details.
3. Opening/closing animates height when motion is allowed; instant when reduced-motion is on.
4. Desktop horizontal layout of `ProcessTimeline` remains.
5. `/process` vertical track behaves the same accordion way.
6. Lint, typecheck, and build pass for `kara-web`.
