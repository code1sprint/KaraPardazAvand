# Process cards accordion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Process step cards open/close with height slide; only one open; click again to close.

**Architecture:** Keep `ProcessTimeline` and `ProcessVerticalTrack`. Change `activeId` to `string | null`, toggle on click, animate panel with `motion/react` + `useReducedMotion`. No shared FAQ Accordion; no content changes.

**Tech Stack:** Next.js App Router, React client components, `motion/react`, Tailwind tokens.

## Global Constraints

- RTL logical properties only; tokens only (no hard-coded hex).
- Respect `prefers-reduced-motion` via `useReducedMotion()`.
- Do not invent content; do not change `process.ts` copy.
- Commit only if the user asks.

---

### Task 1: ProcessTimeline accordion + motion

**Files:**
- Modify: `kara-web/src/components/sections/ProcessTimeline.tsx`

**Interfaces:**
- Consumes: `ProcessTimelineStep[]`, label strings (unchanged props).
- Produces: same component export; state `activeId: string | null`.

- [ ] **Step 1: Update state and toggle**

Replace:

```tsx
const [activeId, setActiveId] = useState(steps[0]?.id ?? "");
```

with:

```tsx
const [activeId, setActiveId] = useState<string | null>(steps[0]?.id ?? null);

function toggle(id: string) {
  setActiveId((current) => (current === id ? null : id));
}
```

Wire button `onClick={() => toggle(step.id)}`. Remove `onFocus={() => setActiveId(step.id)}`.

- [ ] **Step 2: Animate panel**

Import `AnimatePresence`, `motion`, `useReducedMotion` from `motion/react`.

```tsx
const reduceMotion = useReducedMotion();
const active = step.id === activeId;
```

Replace the static panel `div` with:

```tsx
<AnimatePresence initial={false}>
  {active ? (
    <motion.div
      key={panelId}
      id={panelId}
      role="region"
      aria-labelledby={triggerId}
      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
      }
      className="overflow-hidden border-t border-line"
    >
      <div className="space-y-4 px-4 pb-4 pt-0">
        {/* deliverables, client, duration — same markup as before */}
      </div>
    </motion.div>
  ) : null}
</AnimatePresence>
```

Keep header button `aria-expanded={active}` and `aria-controls={panelId}`. Orange styles stay tied to `active`.

- [ ] **Step 3: Manual check**

Open home process section: first card open; click it closes; click another opens only that one; desktop stays horizontal.

---

### Task 2: ProcessVerticalTrack same behavior

**Files:**
- Modify: `kara-web/src/components/sections/ProcessVerticalTrack.tsx`

**Interfaces:**
- Same pattern as Task 1 (`activeId: string | null`, `toggle`, motion panel).

- [ ] **Step 1: Mirror Task 1 changes** in `ProcessVerticalTrack.tsx` (padding classes remain `px-5 pb-5 sm:px-6 sm:pb-6` / `space-y-5`).

- [ ] **Step 2: Verify `/process` vertical track** matches accordion behavior.

---

### Task 3: Lint / typecheck / build

**Files:** none new

- [ ] **Step 1: Run from `kara-web/`**

```bash
npm run lint && npx tsc --noEmit && npm run build
```

Expected: all succeed.

- [ ] **Step 2: Report** files changed + acceptance checklist from the design spec.
