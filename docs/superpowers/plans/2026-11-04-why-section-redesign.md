# Why Section & Band Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the "Why" section background and presentation from heavy diagonal caution-like stripes and harsh slants to an international, modern, minimal dark tech surface featuring subtle ambient glow, micro-dot grid texture, and polished glassmorphic bento cards.

**Architecture:** 
1. Upgrade `Band.tsx` and `globals.css` with a refined dark tech canvas (smooth deep navy gradient, subtle ambient radial glow, optional clean micro dot/grid matrix, and refined borders instead of jarring skewed cuts while maintaining backward compatibility).
2. Enhance `WhySection.tsx` by housing each of the 3 core principles inside glassmorphic bento cards with monospace index badges, subtle hover lift, and accessible typography.
3. Verify type safety (`npm run typecheck`), linting (`npm run lint`), and responsive rendering across devices.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, next-intl.

**Spec:** User feedback on visual direction (replacing noisy 135deg stripe pattern with modern, minimal, captivating international dark tech design as outlined in Proposal 1).

## Global Constraints

- Must follow `AGENTS.md` rules: strict TypeScript, logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`), tokens over hardcoded hex values.
- Orange accent at most ~5% of surface (used as subtle marker/tri-marker).
- Must respect `prefers-reduced-motion` (no aggressive transforms or animations when reduced motion is preferred).
- Full RTL and accessibility compliance (AA contrast, semantic HTML, screen-reader friendly).

## Review Focus

1. Mobile responsiveness: Ensure bento cards stack gracefully on mobile screens without overflow.
2. Other usages of `Band`: Ensure changes to `Band` do not break or degrade `SiteFooter` or `AboutPrinciplesBand`.
3. High contrast / accessibility: Text contrast on glass cards must maintain AA compliance against the dark navy background.
4. Semantic markup: Preserve `ul > li` and `h2`/`h3` hierarchy for screen readers and SEO.
5. Performance: Grid/dot textures must be lightweight CSS (radial/repeating-linear gradients) without heavy DOM elements or image downloads.

---

### Task 1: Update Background Styling & Textures in CSS and Band Component

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/layout/Band.tsx`

**Interfaces:**
- Consumes: CSS custom properties (`--navy`, `--navy-2`, `--win-deep`, `--stripe`, `--orange`)
- Produces: Refined `.bg-band-dots` / `.bg-band-grid` and modernized `Band` layout supporting modern clean borders and ambient glow.

- [ ] **Step 1: Update `globals.css` with subtle tech dot matrix / micro grid**
Add `.bg-band-dots` or update `.bg-band-stripe` to a subtle, modern micro dot texture (`radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px) 0 0 / 24px 24px`), eliminating heavy 90px/170px caution stripes.

- [ ] **Step 2: Update `Band.tsx` to modern ambient surface**
Refine `Band.tsx` to support a modern clean border look (`border-y border-white/10` with subtle top light beam) while softening or making the clip-path configurable, and enriching ambient lighting with radial gradients for depth.

- [ ] **Step 3: Verify CSS compilation and typecheck**
Run: `npm run typecheck`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**
```bash
git add src/app/globals.css src/components/layout/Band.tsx
git commit -m "style(layout): modernize Band surface with ambient glow and micro dot matrix"
```

---

### Task 2: Redesign WhySection with Glassmorphic Bento Cards

**Files:**
- Modify: `src/components/sections/WhySection.tsx`

**Interfaces:**
- Consumes: `whyStatements` from `@/content/why`, `pickLocalized` from `@/content/services`, `TriMarker` from `@/components/ui/TriMarker`.
- Produces: Polished 3-card bento grid with glassmorphism, mono numbering (`01`, `02`, `03`), subtle hover lift, and clean typography.

- [ ] **Step 1: Refactor `WhySection.tsx` cards list**
Wrap each statement in a high-tech glass card (`bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]`).
Add a top row inside each card with an index badge (e.g. `<span className="font-mono text-xs text-sky/80">0{index + 1}</span>`) and `<TriMarker />`.

- [ ] **Step 2: Enhance header & lead presentation**
Ensure the section title and eyebrow have appropriate breathing room and contrast, retaining the signature orange accent on eyebrow or marker.

- [ ] **Step 3: Verify type safety and build**
Run: `npm run typecheck && npm run lint`
Expected: PASS with 0 errors and 0 lint warnings.

- [ ] **Step 4: Commit**
```bash
git add src/components/sections/WhySection.tsx
git commit -m "feat(sections): redesign WhySection with modern glass bento cards"
```

---

### Task 3: Visual & Accessibility Verification

**Files:**
- Verify: `npm run build`

- [ ] **Step 1: Run production build verification**
Run: `npm run build`
Expected: Successful build with all pages passing static generation.

- [ ] **Step 2: Inspect responsive design and dark surface contrast**
Verify that the text meets AA standards on the dark background and that cards collapse into a single column cleanly on mobile.
