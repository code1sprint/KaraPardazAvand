# Service bento static images — Design

**Date:** 2026-11-03  
**Status:** Approved in conversation (visual companion v3); awaiting implementation plan  
**Scope:** Home / services overview bento tiles (`ServicesBento` + per-service `bento.visual`)

## Goal

Replace the current live mini-UI bento visuals (chat, kanban, browser, flow, bars, code) with **static illustrated images** — one creative, product-real scene per service — while keeping titles/copy as HTML text outside the image.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Medium | Static AI-generated (or exported) images inside each tile |
| Style | Flat illustration language with **creative, product-real depth** (approved companion v3) — not bare icon blobs, not stock photos of people |
| Text in image | **None** — no Persian or English labels inside the artwork |
| Composition approach | One conceptual scene per card (2–6 layered software motifs, unique metaphor) |
| Brand | Kara Pardaz v3 tokens: navy `#061D44`, blue `#1D6DD1`, sky `#2E8FF0`, orange `#FF800D` (~5%), soft bg `#F6F9FE` / `#DCE4F1`; Vazirmatn is for page type only (not drawn into art) |
| Forbidden | People/stock faces, purple washes, emoji icons, blueprint/drafting grids, fake logos, illegible fake text |

## Per-card art direction

Reference mockups: brainstorm companion `service-card-scenes-v3.html` (session under `.superpowers/brainstorm/`).

### 1. RAG و هوش مصنوعی (`visual` today: `chat`)

- **Metaphor:** Scattered knowledge gathering into a grounded answer.
- **Scene:** Documents / shards in a soft orbital path; dashed retrieval beams into a glowing navy/sky core with a small orange spark; tilted glass answer card (shapes only, no glyphs); optional small access/status chip.
- **Surface:** Light atmospheric background with soft blue + faint orange glow.

### 2. CRM (`visual` today: `kanban`)

- **Metaphor:** Live sales flow on a work desk.
- **Scene:** Perspective desk; tilted product board with three columns; deal cards with abstract avatar circles; one active card orange-edged; optional motion trail / sticky note (amber).
- **Surface:** Cool desk gradient (light).

### 3. وب‌سایت و پلتفرم (`visual` today: `browser`)

- **Metaphor:** Multi-device web presence.
- **Scene:** Laptop with light page (hero block + side cards) overlapping a phone frame; navy brand backdrop; soft contact glow; tiny orange click pulse (no cursor glyph needed).
- **Surface:** Dark navy product atmosphere (tile itself may stay light card with dark image inset, or image fills the visual slot).

### 4. ERP (`visual` today: `flow`)

- **Metaphor:** Real org ops linked together.
- **Scene:** Soft isometric floor; three iso modules (warehouse / purchase / finance as colored blocks, unlabeled); glowing route lines; central hub ellipsoid; packet dots on routes; one orange-accented path/module.
- **Surface:** Light cool floor.

### 5. علم داده و داشبورد (`visual` today: `bars`)

- **Metaphor:** Decision control room.
- **Scene:** Dark cinematic panel; three floating glass KPI tiles (one orange-rimmed); area chart + bars; peak marker orange.
- **Surface:** Dark win-bg family (`#0A1530` / `#061D44`).

### 6. نرم‌افزار سفارشی (`visual` today: `code`, dark tile)

- **Metaphor:** Building a system, not a template.
- **Scene:** Dark IDE window with colored syntax *blocks* (no characters); modules snapping in from the side; orange snap spark; soft system-map dots (software nodes, not drafting).
- **Surface:** Dark — aligns with existing `bento.dark` tile.

## Shared production rules

- **Aspect / crop:** Illustrate for a **wide visual band** roughly matching current bento visual slot (~3:2 to 16:10). Safe content inset ~8% from edges (tile radius clips corners).
- **Detail level:** Companion v3 density — layered, atmospheric, unique per card; avoid empty sparse icon layouts (rejected v1).
- **Consistency:** Same light direction (soft top-left), same corner radius language in depicted UI chrome (~12–18px), same orange budget.
- **Export:** Prefer SVG or WebP/PNG @2x. Suggested paths: `kara-web/public/brand/bento/{slug}.webp` (and `.svg` source if kept).
- **Accessibility:** Images are decorative (`alt=""` / `aria-hidden`) because the tile title already names the service.
- **i18n:** Artwork is locale-agnostic (no text); one asset serves `fa` and `en`.

## Integration (site)

### Current state

- `ServicesBento` maps `bento.visual` keys to React components in `BentoVisuals.tsx` (`chat`, `kanban`, `browser`, `flow`, `bars`, `code`).
- Each service file sets `bento: { order, span, visual, shortTitle, dark? }`.

### Target state

- Extend content model so each bento tile can reference a static image (e.g. `visual: "image"` + `imageSrc` / `image` keyed by slug), **or** keep visual enum values but swap the renderer to `<Image>` for those keys.
- Remove or stop mounting the live mini-UI components for these six tiles once images ship (dead code cleanup in the same change or immediate follow-up).
- Preserve tile layout, spans, dark variant for custom software, titles, and motion/hover already on `Tile`.
- Use `next/image` with explicit width/height or `fill` + sized parent; honor existing radius/overflow on the visual slot.

### Out of scope

- Redesigning bento grid spans or copy.
- Replacing AppWindow / system maps on `/services/[slug]`.
- Animated Lottie inside tiles.
- Generating marketing photography of people.

## Acceptance criteria

1. All six overview bento tiles show the approved scene metaphors (above), with **no readable text** in the artwork.
2. Look matches brand tokens; orange remains an accent, not the field color.
3. Light and dark tiles still read correctly next to each other (custom software dark scene on dark tile).
4. `fa` / `en` unchanged aside from decorative visual swap.
5. Lint / typecheck / build pass after wiring.
6. `prefers-reduced-motion` unaffected (statics do not introduce motion).

## Open implementation choices (resolve in plan)

1. **Generation path:** AI image gen from locked prompts vs. hand-refined SVG exported from the v3 compositions.
2. **Content schema:** new `image` field vs. repurpose `visual` enum.
3. **Format:** SVG-first (sharp, tiny) vs. WebP raster (richer lighting).

**Recommendation:** Start from v3 compositions → refine as SVG or high-quality raster; prefer SVG if lighting can be preserved without looking flat again; otherwise WebP @2x. Schema: add optional `image` on `bento` and render image when present (backward compatible).
