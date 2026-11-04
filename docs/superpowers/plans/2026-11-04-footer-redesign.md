# Site Footer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Site Footer into a modern tech monolith featuring a floating Bento CTA launchpad, live system status indicator, refined social/channel icon badges, and an ultra-subtle typographic watermark.

**Architecture:**
1. Update i18n dictionaries (`messages/fa.json` and `messages/en.json`) with new strings for the secondary CTA button (`footer.cta.secondaryButton`: "فرایند همکاری" / "Our Process") and system status badge (`footer.status`: "کلیه سیستم‌ها فعال است" / "All systems operational").
2. Refactor `src/components/layout/SiteFooter.tsx` to:
   - Render the pre-footer CTA as an elevated floating Bento card within a `Container` instead of a plain edge-to-edge band.
   - Add the live system status indicator with pulsing emerald indicator next to the brand info.
   - Refine the social/contact links into clean, accessible interactive badges with inline SVGs.
   - Render the subtle background typographic watermark (`KARA PARDAZ AVAND`).
3. Run verification with `npm run typecheck`, `npm run lint`, and `npm run build`.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, next-intl.

**Spec:** `docs/superpowers/specs/2026-11-04-footer-redesign.md`

## Global Constraints
- Next.js App Router, TypeScript strict, logical properties only (`ms-`, `me-`, `ps-`, `pe-`, `text-start`).
- All colors and radii come from tokens or Tailwind standard palette (`win-deep`, `navy`, `on-brand`, `line`, `rounded-[28px]`, `rounded-full`).
- No fake external certification badges or non-existent client logos.
- Full keyboard support and screen reader accessibility (`aria-hidden` on decorative elements, semantic `footer`, `nav`, `ul > li`).

## Review Focus
1. Mobile layout: Ensure the floating CTA card and multi-column footer stack cleanly on small viewports without horizontal scroll.
2. Link integrity: All navigation, contact, and legal links must retain correct href targets and rel attributes.
3. Contrast: Text must remain AA compliant on the dark surface.
4. i18n parity: Both FA and EN locales must have corresponding keys and correct localized text.
5. Performance: Pure CSS/SVG visuals without heavy external assets.

---

### Task 1: Update i18n Translations for Footer

**Files:**
- Modify: `messages/fa.json:105-120`
- Modify: `messages/en.json:105-120`

**Interfaces:**
- Consumes: `next-intl` translation keys under namespace `Layout.footer`.
- Produces: `footer.cta.secondaryButton`, `footer.status`, `footer.statusAria`.

- [ ] **Step 1: Add new keys to `messages/fa.json`**
Add:
- `"status": "کلیه سیستم‌ها فعال است"`
- `"secondaryButton": "فرایند همکاری"` under `cta`

- [ ] **Step 2: Add matching keys to `messages/en.json`**
Add:
- `"status": "All systems operational"`
- `"secondaryButton": "Our Process"` under `cta`

- [ ] **Step 3: Verify JSON validity and typecheck**
Run: `npm run typecheck`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit**
```bash
git add messages/fa.json messages/en.json
git commit -m "i18n(footer): add translations for status indicator and secondary CTA"
```

---

### Task 2: Implement Floating Bento CTA and Modernized Footer in SiteFooter.tsx

**Files:**
- Modify: `src/components/layout/SiteFooter.tsx`

**Interfaces:**
- Consumes: translations from `next-intl/server`, `consultCta`, `processLink` or `/process`, `brandAssets`, `contactChannels`.
- Produces: Polished modern footer with floating Bento CTA, live status indicator, SVG social links, and typographic watermark.

- [ ] **Step 1: Build the floating CTA launchpad**
Render an elevated Bento card within `<Container>` above the main footer:
- Rounded `rounded-[28px]` or `rounded-[32px]`.
- Deep navy background with ambient radial glow and micro-dots.
- Heading, primary button (`درخواست مشاوره`), and secondary ghost button (`فرایند همکاری`).

- [ ] **Step 2: Upgrade brand column with live status badge**
Add a pill badge below the description:
- Glowing emerald dot with `animate-pulse`.
- Text: `t("footer.status")`.

- [ ] **Step 3: Modernize contact and social channels**
Add inline SVGs for Telegram, LinkedIn, GitHub, Email, Phone, rendering clean, clickable pill badges.

- [ ] **Step 4: Add the subtle typographic watermark**
At the bottom of the footer, add an `aria-hidden` large text container:
`"KARA PARDAZ AVAND"` in wide tracking, bold sans/mono, `opacity-[0.03] select-none pointer-events-none`.

- [ ] **Step 5: Verify typecheck and lint**
Run: `npm run typecheck && npm run lint`
Expected: PASS with 0 errors.

- [ ] **Step 6: Commit**
```bash
git add src/components/layout/SiteFooter.tsx
git commit -m "feat(footer): redesign footer with floating CTA launchpad, status badge and watermark"
```

---

### Task 3: Build Verification & Mobile Polish

**Files:**
- Verify: `npm run build`

- [ ] **Step 1: Run production build**
Run: `npm run build`
Expected: Code 0, all static pages generated successfully.

- [ ] **Step 2: Check responsive layout**
Verify no layout shifting or overflow on mobile and desktop viewports.
