# AMLAK Ticketing Integration (Step 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the KaraPardaz Multi-Tenant Ticketing Engine into the AMLAK CRM Support Center (`/support`) so consultants can create, track, and converse on support tickets directly from their AMLAK dashboard.

**Architecture:** Next.js Route Handlers in AMLAK Frontend act as a secure server-side proxy (`/api/tickets`) forwarding consultant requests to KaraPardaz REST API (`/api/v1/tickets`) with the secret `X-Project-Key`. Client UI in AMLAK uses Zustand (`useSupportStore`), Lucide icons, and Tailwind CSS to provide a native, responsive ticket management tab in `/support`.

**Tech Stack:** Next.js 15, React 19, TypeScript, Zustand, Tailwind CSS, Radix UI / shadcn dialogs, Lucide React.

**Spec:** `KaraPardaz/docs/superpowers/specs/2026-11-05-multi-tenant-ticketing-system-design.md`

## Global Constraints

- RTL-first: Arabic/Persian layout with logical properties.
- Security: Never expose `KARAPARDAZ_PROJECT_KEY` to the client browser. All calls to KaraPardaz must route through server route handlers.
- Consultant Identity: Extract current logged-in user from `useUserStore` or cookie/session and pass `userId`, `name`, `phone`, and `organization` to the ticket payload.

## Review Focus

1. **Proxy Secret Protection:** The browser network tab must only see requests to `/api/tickets`, never revealing `x-project-key`.
2. **Current User Scoping:** Consultants only see tickets where `userId === currentUser.id`.
3. **Optimistic/Instant Feedback:** Creating a ticket or sending a reply immediately updates the local UI.
4. **Status Colors & Badges:** Correct visual mapping for `OPEN`, `IN_PROGRESS`, `ANSWERED`, `RESOLVED`, `CLOSED`.
5. **Thread Timeline:** Distinct bubbles for consultant messages vs KaraPardaz support agent replies.

---

### Task 1: Environment Setup & Secure Proxy Route Handlers in AMLAK

**Files:**
- Modify: `/home/soheil/My/NextJs/AMLAK/Frontend/.env.local`
- Create: `/home/soheil/My/NextJs/AMLAK/Frontend/src/lib/karapardaz-client.ts`
- Create: `/home/soheil/My/NextJs/AMLAK/Frontend/src/app/api/tickets/route.ts`
- Create: `/home/soheil/My/NextJs/AMLAK/Frontend/src/app/api/tickets/[id]/route.ts`
- Create: `/home/soheil/My/NextJs/AMLAK/Frontend/src/app/api/tickets/[id]/messages/route.ts`
- Create: `/home/soheil/My/NextJs/AMLAK/Frontend/src/app/api/tickets/[id]/close/route.ts`
- Test: `/home/soheil/My/NextJs/AMLAK/Frontend/scripts/test-ticket-proxy.mjs`

- [ ] **Step 1: Configure environment in `.env.local`**
- [ ] **Step 2: Implement server helper in `src/lib/karapardaz-client.ts`**
- [ ] **Step 3: Implement route handlers in `src/app/api/tickets/**`**
- [ ] **Step 4: Write and run verification script in `scripts/test-ticket-proxy.mjs`**

---

### Task 2: Service & Zustand Store Update in AMLAK

**Files:**
- Modify: `/home/soheil/My/NextJs/AMLAK/Frontend/src/types/index.ts`
- Modify: `/home/soheil/My/NextJs/AMLAK/Frontend/src/services/ticket-service.ts`
- Modify: `/home/soheil/My/NextJs/AMLAK/Frontend/src/store/support-store.ts`

- [ ] **Step 1: Update `SupportTicket` interface in `src/types/index.ts`**
- [ ] **Step 2: Update `ticket-service.ts` to call `/api/tickets`**
- [ ] **Step 3: Update `support-store.ts` with reply, close, and active ticket state**

---

### Task 3: Build Native Ticketing UI in AMLAK Support Center

**Files:**
- Create: `/home/soheil/My/NextJs/AMLAK/Frontend/src/modules/support/tickets/create-ticket-dialog.tsx`
- Create: `/home/soheil/My/NextJs/AMLAK/Frontend/src/modules/support/tickets/ticket-conversation-dialog.tsx`
- Create: `/home/soheil/My/NextJs/AMLAK/Frontend/src/modules/support/tickets/ticket-tab-content.tsx`
- Modify: `/home/soheil/My/NextJs/AMLAK/Frontend/src/app/(dashboard)/support/page.tsx`

- [ ] **Step 1: Create `create-ticket-dialog.tsx`**
- [ ] **Step 2: Create `ticket-conversation-dialog.tsx`**
- [ ] **Step 3: Create `ticket-tab-content.tsx`**
- [ ] **Step 4: Integrate into `/support/page.tsx`**

---

### Task 4: Verification & Build Check

- [ ] **Step 1: Run `npx tsc --noEmit` in AMLAK Frontend**
- [ ] **Step 2: Run `npm run lint` in AMLAK Frontend**
- [ ] **Step 3: Commit all changes in AMLAK repository**
