# Plan: Add Lenis Smooth Scroll to Public Site

## Overview
Implement Lenis smooth scrolling for the public-facing pages of the Kara Pardaz Avand website, while strictly excluding the admin dashboard (`/admin`) and respecting accessibility constraints (`prefers-reduced-motion`).

## Context & Architecture Decisions
- Package: `lenis`
- Target: Public site routes only. The admin panel (`/admin/*`) has its own scroll management, code editors, and data tables which must not be affected.
- Accessibility: Respect `prefers-reduced-motion: reduce` by disabling smooth scroll if requested by the user's OS.
- Directionality & Touch: Maintain standard native momentum scroll on touch devices to preserve mobile performance and battery.
- Integration Point: `src/components/layout/SmoothScroll.tsx` client component embedded in `src/app/[locale]/layout.tsx`.
- CSS: Standard Lenis CSS helper classes in `src/app/globals.css`.

## Tasks

### Task 1: Package installation
- Install `lenis` via npm.
- Deliverable: `package.json` contains `lenis`.

### Task 2: Create `SmoothScroll` Client Component
- File: `src/components/layout/SmoothScroll.tsx`
- Behavior:
  - Hooks into Next.js router / pathname.
  - If pathname starts with `/[locale]/admin` or `/admin`, does not instantiate Lenis (or destroys existing instance).
  - Listens to `window.matchMedia('(prefers-reduced-motion: reduce)')`.
  - Runs Lenis RAF loop via `requestAnimationFrame`.
  - Cleans up (`lenis.destroy()`) on unmount.
- Export from `src/components/layout/index.ts`.

### Task 3: Add Lenis CSS Styles
- File: `src/app/globals.css`
- Add:
  ```css
  html.lenis, html.lenis body {
    height: auto;
  }
  .lenis.lenis-smooth {
    scroll-behavior: auto !important;
  }
  .lenis.lenis-smooth [data-lenis-prevent] {
    overscroll-behavior: contain;
  }
  .lenis.lenis-stopped {
    overflow: hidden;
  }
  .lenis.lenis-smooth iframe {
    pointer-events: none;
  }
  ```

### Task 4: Integrate into Root Layout
- File: `src/app/[locale]/layout.tsx`
- Add `<SmoothScroll />` inside the layout tree.

### Task 5: Verification & Quality Assurance
- Run `npm run typecheck`
- Run `npm run lint`
- Run `npm run build`
- Verify that public pages scroll smoothly and that `/admin` is unaffected.
