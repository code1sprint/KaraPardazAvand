# Multi-Tenant Ticketing Engine (KaraPardaz Step 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a robust, secure, multi-tenant ticketing engine and operator dashboard in KaraPardaz Avand so external client projects (such as AMLAK and future clinic/enterprise platforms) can submit and track support tickets via a secure REST API.

**Architecture:** Headless multi-tenant hub inside KaraPardaz. Projects register with unique IDs and secret API keys. Tenant REST APIs (`/api/v1/tickets`) authenticate inbound requests via `X-Project-Id` and `X-Project-Key`, storing tickets and chronological message threads in MongoDB. KaraPardaz staff manage, filter, and reply to all client tickets through a unified, project-partitioned Admin UI (`/admin/tickets`).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (Strict), MongoDB with Mongoose, Bcryptjs, Jose, Zod, Tailwind CSS, Lucide React.

**Spec:** `docs/superpowers/specs/2026-11-05-multi-tenant-ticketing-system-design.md`

## Global Constraints

- RTL-first: Only logical properties (`ms-`, `me-`, `ps-`, `pe-`, `text-start`). Never left or right in UI components.
- Design tokens: Use project design tokens (`--bg`, `--panel`, `--line`, `--text`, `--muted`, `--blue`, `--sky`, `--orange`, `--ok`) and never raw hard-coded hex colors in components.
- Fonts: Vazirmatn for Persian typography, JetBrains Mono for codes/ticket numbers/IDs.
- Security: Project secret API keys must be hashed using bcrypt before database storage. Timing-safe verification on headers.
- Multi-tenancy: Strictly partition all ticket data and queries by `projectId`. No cross-tenant leakage.

## Review Focus

1. **Tampered or Missing `X-Project-Key`:** Inbound requests with missing, invalid, or mismatched project API keys must be rejected immediately with HTTP 401 Unauthorized before any database writes or queries occur. (Tested in Task 2)
2. **Cross-Tenant Access / IDOR:** A client supplying a valid API key for `amlak` must never be able to read, query, or append messages to a ticket belonging to `clinic` or any other `projectId`. (Tested in Task 3)
3. **Posting Message to Closed Ticket:** Submitting a message to a ticket whose status is `CLOSED` must be rejected with HTTP 409 Conflict, informing the client that closed tickets are immutable. (Tested in Task 3)
4. **Reopening Resolved Ticket:** Submitting a user reply to a ticket in `RESOLVED` status within the 7-day window must successfully append the message and transition status back to `OPEN`. (Tested in Task 3)
5. **Admin Operator Authorization:** Non-admin/unauthenticated requests to `/api/admin/tickets` or `/admin/tickets` UI must be redirected or rejected with 401/403. (Tested in Task 5 & 7)

---

### Task 1: Multi-Tenant Data Models & Zod Validations

**Files:**
- Create: `src/lib/db/models/SupportedProject.ts`
- Create: `src/lib/db/models/SupportTicket.ts`
- Create: `src/lib/validations/ticket.ts`
- Test: `scripts/test-ticket-models.ts`

**Interfaces:**
- Produces:
  - `SupportedProject`: Mongoose Model for `ISupportedProject` (`projectId`, `name`, `apiKeyHash`, `departments`, `isActive`)
  - `SupportTicket`: Mongoose Model for `ISupportTicket` (`ticketNumber`, `projectId`, `requester`, `department`, `priority`, `status`, `messages`, `lastMessageAt`, `resolvedAt`, `closedAt`)
  - `createTicketSchema`: Zod schema validating inbound ticket creation payload
  - `addMessageSchema`: Zod schema validating inbound message reply payload

- [ ] **Step 1: Write the failing model test script in `scripts/test-ticket-models.ts`**

```typescript
import assert from "node:assert";
import { createTicketSchema, addMessageSchema } from "../src/lib/validations/ticket";

console.log("🧪 Testing Ticket Zod Validation Schemas...");

// Test valid creation
const validPayload = {
  requester: {
    userId: "usr_123",
    name: "علی محمدی",
    phone: "09121112233",
    organization: "املاک نگین",
  },
  department: "technical",
  priority: "HIGH",
  subject: "مشکل در جستجو",
  message: "توضیحات باگ به صورت کامل",
};
const parsed = createTicketSchema.safeParse(validPayload);
assert(parsed.success, "Valid payload should pass validation");

// Test invalid priority
const invalidPriority = { ...validPayload, priority: "SUPER_URGENT" };
assert(!createTicketSchema.safeParse(invalidPriority).success, "Invalid priority must fail");

// Test missing required fields
assert(!createTicketSchema.safeParse({}).success, "Empty payload must fail");

console.log("   ✅ Ticket validation schemas verified.");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx scripts/test-ticket-models.ts`  
Expected: FAIL with "Cannot find module '../src/lib/validations/ticket'"

- [ ] **Step 3: Implement `src/lib/validations/ticket.ts`**

Define Zod schemas:
- `ticketStatusEnum`: `z.enum(["OPEN", "IN_PROGRESS", "ANSWERED", "RESOLVED", "CLOSED"])`
- `ticketPriorityEnum`: `z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"])`
- `createTicketSchema`: validates `requester` (`userId`, `name`, optional `phone`, `email`, `organization`), `department`, `priority`, `subject`, `message`, optional `attachments`
- `addMessageSchema`: validates `message` (min 2 chars), optional `attachments`

- [ ] **Step 4: Implement `src/lib/db/models/SupportedProject.ts` and `src/lib/db/models/SupportTicket.ts`**

Implement Mongoose schemas adhering to Section 6 of the spec with indexes:
- `SupportedProject`: unique index on `projectId`.
- `SupportTicket`: unique index on `ticketNumber`, compound index on `{ projectId: 1, "requester.userId": 1, status: 1 }`, and index on `{ projectId: 1, lastMessageAt: -1 }`.

- [ ] **Step 5: Run test to verify validation test passes**

Run: `npx tsx scripts/test-ticket-models.ts`  
Expected: PASS with "✅ Ticket validation schemas verified."

- [ ] **Step 6: Commit**

```bash
git add src/lib/db/models/SupportedProject.ts src/lib/db/models/SupportTicket.ts src/lib/validations/ticket.ts scripts/test-ticket-models.ts
git commit -m "feat(tickets): add SupportedProject and SupportTicket models and validations"
```

---

### Task 2: Tenant Security & Authentication Helper

**Files:**
- Create: `src/lib/auth/tenant-auth.ts`
- Test: `scripts/test-tenant-auth.ts`

**Interfaces:**
- Consumes: `SupportedProject` model, bcryptjs
- Produces: `verifyTenantRequest(request: Request): Promise<{ project: ISupportedProject } | { errorResponse: NextResponse }>`

- [ ] **Step 1: Write test script in `scripts/test-tenant-auth.ts`**

Test header extraction and authentication logic:
- Missing `X-Project-Id` or `X-Project-Key` returns 401.
- Project not found or inactive returns 401.
- Invalid key hash comparison returns 401.
- Valid project and matching secret key returns project object.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx tsx scripts/test-tenant-auth.ts`  
Expected: FAIL with "Cannot find module '../src/lib/auth/tenant-auth'"

- [ ] **Step 3: Implement `src/lib/auth/tenant-auth.ts`**

Extract headers `x-project-id` and `x-project-key`.  
Connect to database. Query `SupportedProject.findOne({ projectId, isActive: true })`.  
Verify key using `bcrypt.compare(apiKey, project.apiKeyHash)`.  
Return `{ project }` on success, or JSON `NextResponse` with status 401 on failure.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx tsx scripts/test-tenant-auth.ts`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/auth/tenant-auth.ts scripts/test-tenant-auth.ts
git commit -m "feat(tickets): implement multi-tenant authentication helper"
```

---

### Task 3: External Tenant REST APIs (`/api/v1/tickets`)

**Files:**
- Create: `src/app/api/v1/tickets/route.ts` (GET user tickets, POST create ticket)
- Create: `src/app/api/v1/tickets/[id]/route.ts` (GET ticket details)
- Create: `src/app/api/v1/tickets/[id]/messages/route.ts` (POST user reply message)
- Create: `src/app/api/v1/tickets/[id]/close/route.ts` (PATCH user close ticket)
- Test: `scripts/test-tickets-api.ts`

**Interfaces:**
- Consumes: `verifyTenantRequest`, `SupportTicket`, `SupportedProject`, `createTicketSchema`, `addMessageSchema`
- Produces: Standard REST API responses for client applications

- [ ] **Step 1: Implement `src/app/api/v1/tickets/route.ts`**
  - `GET`: Authenticates tenant with `verifyTenantRequest`. Reads query param `userId`. Filters `{ projectId, "requester.userId": userId }`. Supports pagination (`page`, `limit`) and optional `status`. Returns `{ ok: true, tickets, pagination }`.
  - `POST`: Authenticates tenant. Validates body with `createTicketSchema`. Generates human-friendly `ticketNumber` (e.g. `TK-${projectId.toUpperCase()}-${randomCode}`). Creates ticket with initial message from `CLIENT_USER`. Sets `status: "OPEN"`.

- [ ] **Step 2: Implement `src/app/api/v1/tickets/[id]/route.ts`**
  - `GET`: Authenticates tenant. Validates `userId` param. Finds ticket matching `_id` (or `ticketNumber`) AND `projectId` AND `"requester.userId": userId`. Returns 404 if not found or unauthorized cross-tenant attempt.

- [ ] **Step 3: Implement `src/app/api/v1/tickets/[id]/messages/route.ts`**
  - `POST`: Authenticates tenant. Validates `addMessageSchema`.
  - Check ticket status:
    - If `status === "CLOSED"`, return 409 Conflict ("تیکت بسته شده است و امکان ارسال پاسخ جدید وجود ندارد.").
    - If `status === "RESOLVED"`, transition to `OPEN` (reopened).
    - If `status === "ANSWERED"`, transition to `IN_PROGRESS` or `OPEN`.
  - Append message subdocument with `senderRole: "CLIENT_USER"`, update `lastMessageAt: new Date()`.

- [ ] **Step 4: Implement `src/app/api/v1/tickets/[id]/close/route.ts`**
  - `PATCH`: Authenticates tenant and validates ownership. Sets `status: "CLOSED"` and `closedAt: new Date()`.

- [ ] **Step 5: Write and run integration test in `scripts/test-tickets-api.ts`**

Verify complete flow:
1. Create ticket via API logic.
2. Query user tickets list.
3. Post message to ticket.
4. Try posting message to closed ticket -> verify 409 Conflict.
5. Try cross-tenant access -> verify 404/401 rejection.

Run: `npx tsx scripts/test-tickets-api.ts`  
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/api/v1/tickets scripts/test-tickets-api.ts
git commit -m "feat(tickets): implement external tenant REST API endpoints"
```

---

### Task 4: Seed Script for Initial Project (`amlak`) & Mock Tickets

**Files:**
- Create: `scripts/seed-tickets.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: Populated `SupportedProject` with `projectId: "amlak"`, known test API key (`kp_live_amlak_secret123`), departments, and sample realistic tickets.

- [ ] **Step 1: Write `scripts/seed-tickets.ts`**
  - Connect to MongoDB.
  - Create or update project `amlak` with name "سامانه مدیریت املاک", hashed API key, and departments (`technical`, `contracts`, `billing`, `general`).
  - Create 3-4 realistic mock tickets representing different states (`OPEN`, `ANSWERED`, `RESOLVED`, `CLOSED`) with messages between consultants and KaraPardaz agents.

- [ ] **Step 2: Add script to `package.json`**
  - Add `"seed:tickets": "tsx scripts/seed-tickets.ts"`

- [ ] **Step 3: Run the seed script**

Run: `npm run seed:tickets`  
Expected: "✅ Seeded project 'amlak' and initial support tickets successfully."

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-tickets.ts package.json
git commit -m "chore(tickets): add seed script for amlak project and sample tickets"
```

---

### Task 5: KaraPardaz Admin Ticket Management APIs

**Files:**
- Create: `src/app/api/admin/tickets/route.ts` (GET paginated, filtered tickets)
- Create: `src/app/api/admin/tickets/[id]/route.ts` (GET ticket details)
- Create: `src/app/api/admin/tickets/[id]/reply/route.ts` (POST support agent reply)
- Create: `src/app/api/admin/tickets/[id]/status/route.ts` (PATCH status update)
- Create: `src/app/api/admin/tickets/projects/route.ts` (GET tenant projects list & stats)
- Test: `scripts/test-admin-tickets-api.ts`

**Interfaces:**
- Consumes: `withAuth` from `@/lib/auth/guard`, `SupportTicket`, `SupportedProject`
- Produces: JSON responses protected by KaraPardaz Admin session

- [ ] **Step 1: Implement `src/app/api/admin/tickets/route.ts`**
  - Protected with `withAuth(..., { roles: ["admin", "editor"] })`.
  - Supports query filters: `projectId`, `status`, `department`, `priority`, `search` (searches `subject`, `ticketNumber`, `requester.name`, `requester.phone`), `page`, `limit`.
  - Returns `{ ok: true, tickets, pagination, counts: { open, answered, inProgress, closed, total } }`.

- [ ] **Step 2: Implement `src/app/api/admin/tickets/projects/route.ts`**
  - Returns list of registered projects with their active ticket counts.

- [ ] **Step 3: Implement `src/app/api/admin/tickets/[id]/reply/route.ts`**
  - Protected by admin session.
  - Appends message with `senderRole: "SUPPORT_AGENT"`, `senderName: context.user.name || "تیم پشتیبانی کاراپرداز"`, `senderId: context.user.sub`.
  - Updates ticket `status: "ANSWERED"`, `lastMessageAt: new Date()`.

- [ ] **Step 4: Implement `src/app/api/admin/tickets/[id]/status/route.ts`**
  - Updates ticket status (`IN_PROGRESS`, `RESOLVED`, `CLOSED`). Sets `resolvedAt` or `closedAt` accordingly.

- [ ] **Step 5: Write and run admin API test in `scripts/test-admin-tickets-api.ts`**

Run: `npx tsx scripts/test-admin-tickets-api.ts`  
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/api/admin/tickets scripts/test-admin-tickets-api.ts
git commit -m "feat(tickets): implement internal admin ticket management APIs"
```

---

### Task 6: KaraPardaz Operator Admin Dashboard UI (`/admin/tickets`)

**Files:**
- Create: `src/app/[locale]/admin/tickets/page.tsx`
- Create: `src/components/admin/tickets/TicketStatsCards.tsx`
- Create: `src/components/admin/tickets/ProjectFilterBar.tsx`
- Create: `src/components/admin/tickets/TicketTable.tsx`
- Create: `src/components/admin/tickets/TicketDetailDrawer.tsx`
- Create: `src/components/admin/tickets/TicketReplyComposer.tsx`

**Interfaces:**
- Consumes: Admin Ticket APIs (`/api/admin/tickets/...`)
- Produces: Responsive, RTL-first admin dashboard for KaraPardaz operators

- [ ] **Step 1: Implement `TicketStatsCards.tsx`**
  - Metric cards showing: کل تیکت‌ها، در انتظار پاسخ کاراپرداز، در حال بررسی، حل شده / بسته.
  - Styled with tokens (`bg-panel border-line text-text`).

- [ ] **Step 2: Implement `ProjectFilterBar.tsx`**
  - Tab pills: `[ همه پروژه‌ها ] [ سامانه املاک (AMLAK) ] ...`
  - Status filter dropdown, search input for consultant name / ticket number.

- [ ] **Step 3: Implement `TicketTable.tsx`**
  - Table displaying: شماره تیکت، پروژه، درخواست‌دهنده (مشاور/سازمان)، دپارتمان، اولویت، وضعیت، آخرین بروزرسانی، دکمه مشاهده و پاسخ.

- [ ] **Step 4: Implement `TicketDetailDrawer.tsx` and `TicketReplyComposer.tsx`**
  - Drawer / Slide-over or modal showing:
    - Ticket metadata header (شماره، تاریخ، درخواست‌دهنده، تماس).
    - Chronological message history with distinct bubbles (مشاور vs پشتیبان کاراپرداز).
    - Reply textarea with "ارسال پاسخ پشتیبانی" and status changer dropdown.

- [ ] **Step 5: Assemble `src/app/[locale]/admin/tickets/page.tsx`**
  - Fetch tickets on load and on filter changes. Connect drawer open/close and reply submit handlers with optimistic or instant refresh.

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/admin/tickets src/components/admin/tickets
git commit -m "feat(tickets): build operator ticketing dashboard UI in admin panel"
```

---

### Task 7: Admin Navigation Integration & End-to-End Verification

**Files:**
- Modify: `src/app/[locale]/admin/AdminShell.tsx` (add dedicated tickets nav item with icon and live badge)
- Verify: `npm run typecheck`, `npm run lint`, `npm run build`

- [ ] **Step 1: Update `AdminShell.tsx` navigation**
  - Add `/admin/tickets` ("پشتیبانی و تیکت‌ها") to the sidebar items in `AdminShell.tsx`.
  - Keep `/admin/inquiries` as "درخواست‌های مشاوره سایت" to avoid terminology confusion between website leads and client support tickets.

- [ ] **Step 2: Run typecheck and linting**

Run: `npm run typecheck`  
Expected: 0 errors  
Run: `npm run lint`  
Expected: 0 errors

- [ ] **Step 3: Run full Next.js build verification**

Run: `npm run build`  
Expected: Successful build with `/admin/tickets` and `/api/v1/tickets` compiled cleanly.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/admin/AdminShell.tsx
git commit -m "feat(tickets): integrate ticketing center into AdminShell navigation and verify build"
```

---
