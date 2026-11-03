# Service bento static images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace live mini-UI bento visuals with static illustrated scenes (one per service) matching the approved v3 art direction.

**Architecture:** Add optional `bento.image` (public path) on each service; `ServicesBento` renders a decorative `next/image` (or `<img>` for SVG) when `image` is set. Ship six SVG scenes under `public/brand/bento/`, then remove the React mini-UI path and unused i18n keys.

**Tech Stack:** Next.js App Router, Zod content schemas, SVG assets (same pattern as `public/projects/*-cover.svg`), Tailwind tokens.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-11-03-service-bento-static-images-design.md`
- No text (Persian or English) inside artwork
- Brand colors only from v3 tokens; orange accent ≤ ~5% of scene
- No people, purple washes, emoji, drafting/blueprint grids, fake logos
- Decorative images: empty `alt`, parent already names the service
- RTL: no left/right in new layout CSS — logical properties only
- No hard-coded hex in **components** (SVG assets may embed brand hex like existing project covers)
- Commit only if the user asks
- Verify with `npm run lint`, `npm run typecheck`, `npm run build` in `kara-web/`

## File map

| File | Role |
|------|------|
| `kara-web/src/lib/content.ts` | Extend `serviceBentoSchema` with optional `image` |
| `kara-web/src/content/home-bento.ts` | Plumb `image` on `HomeBentoTile` |
| `kara-web/src/content/services/index.ts` | Include `image` in `getHomeBentoTiles()` |
| `kara-web/src/content/services/{crm,rag-ai,data-science,erp,web-platforms,custom-software}.ts` | Set `bento.image` paths |
| `kara-web/public/brand/bento/*.svg` | Six scene assets |
| `kara-web/src/components/sections/bento/BentoSceneImage.tsx` | Decorative image slot |
| `kara-web/src/components/sections/ServicesBento.tsx` | Prefer `image` over live visuals |
| `kara-web/src/components/sections/bento/BentoVisuals.tsx` | Delete after cutover |
| Locale messages for `Services.bento.*` visual strings | Remove unused keys after cutover |

---

### Task 1: Schema + tile plumbing for `bento.image`

**Files:**
- Modify: `kara-web/src/lib/content.ts` (`serviceBentoSchema`)
- Modify: `kara-web/src/content/home-bento.ts`
- Modify: `kara-web/src/content/services/index.ts` (`getHomeBentoTiles`)

**Interfaces:**
- Consumes: existing `serviceBentoSchema` fields (`order`, `span`, `visual`, `dark?`, `shortTitle`)
- Produces: `ServiceBento.image?: string`; `HomeBentoTile.image?: string`

- [ ] **Step 1: Extend Zod schema**

In `serviceBentoSchema`, add optional `image` (public URL path starting with `/`):

```ts
export const serviceBentoSchema = z.object({
  order: z.number().int().nonnegative(),
  span: z.union([z.literal(2), z.literal(4), z.literal(6)]),
  visual: z.enum(["kanban", "chat", "bars", "flow", "browser", "code"]),
  /** Decorative bento scene under `/public` (e.g. `/brand/bento/crm.svg`). */
  image: z
    .string()
    .min(1)
    .refine((value) => value.startsWith("/"), {
      message: "bento.image must be a root-relative public path",
    })
    .optional(),
  dark: z.boolean().optional(),
  shortTitle: localizedStringSchema,
});
```

- [ ] **Step 2: Plumb through home bento types**

Update `kara-web/src/content/home-bento.ts`:

```ts
export type HomeBentoTile = {
  slug: string;
  span: 2 | 4 | 6;
  visual: BentoVisual;
  /** When set, `ServicesBento` renders this instead of the live mini-UI. */
  image?: string;
  dark?: boolean;
  title: { fa: string; en: string };
};
```

Update `getHomeBentoTiles` in `kara-web/src/content/services/index.ts`:

```ts
export function getHomeBentoTiles() {
  return [...services]
    .sort((a, b) => a.bento.order - b.bento.order)
    .map((service) => ({
      slug: service.slug,
      span: service.bento.span,
      visual: service.bento.visual,
      image: service.bento.image,
      dark: service.bento.dark,
      title: service.bento.shortTitle,
    }));
}
```

- [ ] **Step 3: Typecheck (still green — field optional, no content yet)**

Run:

```bash
cd kara-web && npm run typecheck
```

Expected: exit 0.

- [ ] **Step 4: Commit (only if user asked)**

```bash
git add kara-web/src/lib/content.ts kara-web/src/content/home-bento.ts kara-web/src/content/services/index.ts
git commit -m "$(cat <<'EOF'
feat(bento): allow optional static image path on service tiles

EOF
)"
```

---

### Task 2: Six SVG scene assets

**Files:**
- Create: `kara-web/public/brand/bento/crm.svg`
- Create: `kara-web/public/brand/bento/rag-ai.svg`
- Create: `kara-web/public/brand/bento/data-science.svg`
- Create: `kara-web/public/brand/bento/erp.svg`
- Create: `kara-web/public/brand/bento/web-platforms.svg`
- Create: `kara-web/public/brand/bento/custom-software.svg`

**Interfaces:**
- Consumes: art direction from spec + companion mockups in `.superpowers/brainstorm/*/content/service-card-scenes-v3.html`
- Produces: six standalone SVGs at the paths above

**Slug → scene map**

| File | Metaphor (from spec) |
|------|----------------------|
| `crm.svg` | Desk + tilted kanban board, orange active card, sticky note |
| `rag-ai.svg` | Orbital docs → glowing core → tilted glass answer card |
| `data-science.svg` | Dark glass KPIs + area/bars, orange peak |
| `erp.svg` | Isometric modules + glowing routes + hub |
| `web-platforms.svg` | Laptop + phone on navy backdrop |
| `custom-software.svg` | Dark IDE + snapping modules + orange spark |

- [ ] **Step 1: Create directory and SVG shell pattern**

Each file must:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600" role="img" aria-hidden="true">
  <!-- full-bleed background + scene; NO text nodes, NO <text> -->
</svg>
```

Match project-cover convention (`960×600`). Keep ~8% safe inset from edges for tile radius clipping.

- [ ] **Step 2: Author `crm.svg` (pattern for the set)**

Port/enrich the CRM card SVG from companion v3 onto the 960×600 canvas (scale transforms as needed). Requirements checklist before leaving the file:

- No `<text>` or letter shapes that read as words
- Colors from brand set: `#061D44`, `#0A3A86`, `#1D6DD1`, `#2E8FF0`, `#FF800D`, `#FFB843`, `#34C48B`, `#F6F9FE`, `#DCE4F1`, `#FFFFFF`
- One clear orange accent (active deal), not an orange wash
- Depth via soft shadow filters / layered boards (v3 density, not v1 sparse icons)

- [ ] **Step 3: Author the other five SVGs**

Same checklist. Use the matching v3 card composition as the starting point; scale to `viewBox="0 0 960 600"`. For dark scenes (`data-science`, `web-platforms` backdrop, `custom-software`), fill the full canvas with dark navy gradients so letterboxing does not flash light gray inside dark tiles.

- [ ] **Step 4: Spot-check locally**

Open each SVG in a browser or IDE preview. Confirm no glyphs, no purple, no people, orange still accent-only.

- [ ] **Step 5: Commit (only if user asked)**

```bash
git add kara-web/public/brand/bento/
git commit -m "$(cat <<'EOF'
feat(brand): add service bento scene illustrations

EOF
)"
```

---

### Task 3: `BentoSceneImage` + wire `ServicesBento`

**Files:**
- Create: `kara-web/src/components/sections/bento/BentoSceneImage.tsx`
- Modify: `kara-web/src/components/sections/ServicesBento.tsx`

**Interfaces:**
- Consumes: `src: string` (root-relative public path)
- Produces: `BentoSceneImage({ src }: { src: string }): ReactElement` — decorative, `aria-hidden`

- [ ] **Step 1: Add `BentoSceneImage`**

```tsx
import { cn } from "@/lib/cn";

export type BentoSceneImageProps = {
  src: string;
  className?: string;
};

/** Decorative service scene — title on the tile already names the service. */
export function BentoSceneImage({ src, className }: BentoSceneImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG scenes; avoid next/image raster pipeline
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      className={cn(
        "pointer-events-none h-[140px] w-full rounded-[var(--radius-control)] object-cover object-center md:h-[160px]",
        className,
      )}
    />
  );
}
```

Use `<img>` for SVG (same practical approach as many local brand SVGs). If the repo already prefers `next/image` for SVG, switch to:

```tsx
import Image from "next/image";
// width={960} height={600} className="h-auto w-full ..."
```

—but keep `alt=""` and `aria-hidden`.

- [ ] **Step 2: Prefer `image` in `ServicesBento`**

Replace `renderVisual(tile.visual, t)` usage so that when `tile.image` is set, the scene image is used:

```tsx
const visual = tile.image ? (
  <BentoSceneImage
    src={tile.image}
    className={tile.dark ? "md:h-[200px]" : undefined}
  />
) : (
  renderVisual(tile.visual, t)
);
```

Keep the existing `isCode` / dark tile layout branch based on `tile.visual === "code"` **or** `tile.slug === "custom-software"` / `tile.dark` so the full-width custom tile layout still works once images land. Prefer:

```tsx
const isWideDark = Boolean(tile.dark);
```

and use `isWideDark` instead of `isCode` for the special layout (title + visual side-by-side), so layout is driven by `dark` not by the old `code` visual key.

- [ ] **Step 3: Typecheck**

```bash
cd kara-web && npm run typecheck
```

Expected: exit 0. UI still shows live mini-UIs until Task 4 sets `image` on services.

- [ ] **Step 4: Commit (only if user asked)**

```bash
git add kara-web/src/components/sections/bento/BentoSceneImage.tsx kara-web/src/components/sections/ServicesBento.tsx
git commit -m "$(cat <<'EOF'
feat(bento): render static scene image when service provides one

EOF
)"
```

---

### Task 4: Point all six services at their scenes

**Files:**
- Modify: `kara-web/src/content/services/crm.ts` — `bento.image`
- Modify: `kara-web/src/content/services/rag-ai.ts`
- Modify: `kara-web/src/content/services/data-science.ts`
- Modify: `kara-web/src/content/services/erp.ts`
- Modify: `kara-web/src/content/services/web-platforms.ts`
- Modify: `kara-web/src/content/services/custom-software.ts`

**Interfaces:**
- Consumes: assets from Task 2; schema from Task 1
- Produces: every `homeBentoTiles` entry has `image` set

- [ ] **Step 1: Set `image` on each `bento` block**

Examples:

```ts
// crm.ts
bento: {
  order: 0,
  span: 4,
  visual: "kanban",
  image: "/brand/bento/crm.svg",
  shortTitle: { fa: "CRM", en: "CRM" },
},
```

```ts
// rag-ai.ts
image: "/brand/bento/rag-ai.svg",
```

```ts
// data-science.ts
image: "/brand/bento/data-science.svg",
```

```ts
// erp.ts
image: "/brand/bento/erp.svg",
```

```ts
// web-platforms.ts
image: "/brand/bento/web-platforms.svg",
```

```ts
// custom-software.ts
bento: {
  order: 5,
  span: 6,
  visual: "code",
  dark: true,
  image: "/brand/bento/custom-software.svg",
  shortTitle: {
    fa: "نرم‌افزار سفارشی",
    en: "Custom software",
  },
},
```

Keep `visual` for now (still required by schema) until Task 5 removes it.

- [ ] **Step 2: Dev visual check**

```bash
cd kara-web && npm run dev
```

Open `/fa` (and `/en`) home + `/fa/services`. Confirm all six tiles show scenes, no readable text in art, dark tile still readable, hover/link still works.

- [ ] **Step 3: Lint + typecheck + build**

```bash
cd kara-web && npm run lint && npm run typecheck && npm run build
```

Expected: all exit 0.

- [ ] **Step 4: Commit (only if user asked)**

```bash
git add kara-web/src/content/services/*.ts
git commit -m "$(cat <<'EOF'
feat(content): wire service bento tiles to static scene assets

EOF
)"
```

---

### Task 5: Remove live mini-UI path

**Files:**
- Modify: `kara-web/src/lib/content.ts` — drop `visual` from `serviceBentoSchema` (or keep unused — prefer drop)
- Modify: all six service content files — remove `visual`
- Modify: `kara-web/src/content/home-bento.ts` — remove `BentoVisual` type / `visual` field
- Modify: `kara-web/src/content/services/index.ts` — stop mapping `visual`
- Modify: `kara-web/src/components/sections/ServicesBento.tsx` — delete `renderVisual` and mini-UI imports; require `tile.image`
- Delete: `kara-web/src/components/sections/bento/BentoVisuals.tsx`
- Modify: locale message files that define `Services.bento.kanbanNew`, `chatUser`, `chatAgent`, `chatSource`, `flowWarehouse`, `flowPurchase`, `flowFinance`, `codeLabel` — remove keys only used by deleted visuals (keep any still referenced)

**Interfaces:**
- Consumes: every tile must have `image: string`
- Produces: image-only bento rendering

- [ ] **Step 1: Make `image` required; remove `visual` from schema**

```ts
export const serviceBentoSchema = z.object({
  order: z.number().int().nonnegative(),
  span: z.union([z.literal(2), z.literal(4), z.literal(6)]),
  image: z
    .string()
    .min(1)
    .refine((value) => value.startsWith("/"), {
      message: "bento.image must be a root-relative public path",
    }),
  dark: z.boolean().optional(),
  shortTitle: localizedStringSchema,
});
```

- [ ] **Step 2: Update content files and `HomeBentoTile`**

Remove `visual` from each service `bento` and from `HomeBentoTile` / `getHomeBentoTiles`.

- [ ] **Step 3: Simplify `ServicesBento`**

Always render:

```tsx
const visual = <BentoSceneImage src={tile.image!} className={tile.dark ? "md:h-[200px]" : undefined} />;
```

(`image` is required on the type after Step 2, so no `!` needed if typed correctly.)

Delete `renderVisual` and all imports from `BentoVisuals`.

If `getTranslations("Services.bento")` is unused after key removal, drop the `t` call.

- [ ] **Step 4: Delete `BentoVisuals.tsx` and scrub unused messages**

Grep to confirm no remaining imports:

```bash
cd kara-web && rg "BentoVisuals|KanbanVisual|ChatVisual|BarsVisual|FlowVisual|BrowserVisual|CodeVisual" src
```

Expected: no matches.

- [ ] **Step 5: Lint + typecheck + build**

```bash
cd kara-web && npm run lint && npm run typecheck && npm run build
```

Expected: all exit 0.

- [ ] **Step 6: Commit (only if user asked)**

```bash
git add kara-web/src/lib/content.ts kara-web/src/content kara-web/src/components/sections
git commit -m "$(cat <<'EOF'
refactor(bento): drop live mini-UI visuals in favor of static scenes

EOF
)"
```

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Static images, flat/creative product-real, no text | 2, 4 |
| Six metaphors (RAG, CRM, Web, ERP, Data, Custom) | 2 |
| Brand tokens / forbidden cues | 2 checklist |
| Decorative a11y | 3 |
| Locale-agnostic assets | 2, 4 |
| Schema `image` + render when present → then required | 1, 3, 4, 5 |
| Remove live mini-UIs | 5 |
| Preserve spans / dark custom tile / titles | 3, 4 |
| Lint / typecheck / build | 4, 5 |
| Out of scope: slug pages, Lottie, photography | — not planned |

## Placeholder / consistency self-review

- No TBD steps; paths and schema snippets are concrete.
- `image` path shape is consistent (`/brand/bento/{slug}.svg`) across tasks.
- Layout flag migrates from `visual === "code"` to `tile.dark` before `visual` is deleted.
