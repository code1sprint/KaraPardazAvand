# Design Document: Multi-Tenant Ticketing Engine for KaraPardaz & Project Integrations (AMLAK & Future Apps)

**Date:** 2026-11-05  
**Status:** In Review (Brainstorming Phase)  
**Authors:** Senior Frontend & Product Engineer (Antigravity), Product Owner  

---

## 1. Intent and Why

KaraPardaz Avand develops and maintains custom software, web platforms, and enterprise solutions for external clients. One primary live client platform is **AMLAK** (a real estate CRM and property management platform used by real estate consultants and agencies).

Currently:
- In **AMLAK**, the `/support` page only contains static educational guides and FAQs. The existing `SupportTicket` models and store in AMLAK are purely simulated mock data.
- In **KaraPardaz**, the admin panel (`/admin`) manages static content and single-way contact leads (`Inquiry`), but lacks an interactive, enterprise-grade support ticketing system.
- Looking ahead, KaraPardaz will onboard additional client platforms and enterprise applications, all needing reliable, centralized support and issue tracking.

**Objective:**  
Build a robust, secure, and extensible **Multi-Tenant Headless Ticketing Engine** inside KaraPardaz that:
1. Serves as the central support hub for KaraPardaz staff to view, filter, track, and reply to customer tickets across all projects from one unified dashboard.
2. Exposes a clean, secure REST API so client applications (starting with AMLAK) can embed native support ticket creation, tracking, and messaging directly into their user interfaces without exposing internal staff dashboards or requiring separate user logins.
3. Allows onboarding any future client application in minutes by generating a tenant configuration and API key.

---

## 2. Goals, Non-Goals, and Anti-Goals

### Goals
- **Multi-Tenancy:** Partition all tickets, departments, and communication by `projectId` (e.g. `amlak`, `project-beta`).
- **Standard Enterprise Ticket Lifecycle:** Support ticket status transitions (`OPEN` -> `IN_PROGRESS` / `ANSWERED` -> `RESOLVED` / `CLOSED`), priority flags (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and department categories.
- **Message Timeline (Thread):** Maintain an orderly, chronological list of messages per ticket between the client user (consultant) and KaraPardaz support agents, including timestamps and sender identities.
- **Unified KaraPardaz Admin Inbox:** KaraPardaz operators have a dedicated, responsive dashboard (`/admin/tickets`) with tabs/filters for project, status, and priority, quick reply composers, and ticket status controls.
- **Native AMLAK Consultant Experience:** AMLAK consultants access their tickets directly inside AMLAK's `/support` page under a new "تیکت‌های پشتیبانی" tab, with ticket creation, status cards, and ticket detail views adhering to AMLAK's UI/UX.
- **Secure Server-to-Server Authentication:** Secure KaraPardaz API endpoints using project-level secret keys (`X-Project-Key`), validated against salted hashes in the database.

### Non-Goals (Scope for v1)
- **Live Real-time WebSockets / Typing Indicators:** This is a formal enterprise ticketing desk (like Jira Service Management or Zendesk), not a live chat widget like Crisp/WhatsApp. Responses and checks are asynchronous HTTP operations.
- **Direct End-User Account Creation in KaraPardaz:** End users (such as real estate consultants) are authenticated by their own host platforms (AMLAK). KaraPardaz trusts the user identity passed securely through the authenticated tenant backend.
- **Billing / Invoicing Integration:** Billing or SLA penalty tracking is out of scope for v1.

### Anti-Goals
- **No Embedded Iframe / Third-Party Look:** Avoid clunky iframes that break responsive design, theme consistency, and mobile UX in client apps.
- **No Hard-coded Project Logic in KaraPardaz:** KaraPardaz ticketing core must remain generic and project-agnostic. No `if (project === 'amlak')` branches in business logic; all project metadata comes from database configuration.

---

## 3. Constraints & Design Standards

- **KaraPardaz Architecture:** Next.js 16 (App Router), TypeScript Strict, MongoDB (Mongoose), Jose JWT authentication for KaraPardaz admin staff, Tailwind CSS, Vazirmatn font, RTL logical properties.
- **AMLAK Architecture:** Next.js (Frontend) + Go (Backend), Tailwind CSS, Lucide icons, Zustand state management.
- **Security:** Secret project keys must never be leaked to client browsers. Requests from AMLAK must route through AMLAK's server (Route Handler or Go backend proxy) with the `X-Project-Key` header.
- **RTL & Accessibility:** All UIs in both KaraPardaz and AMLAK must be RTL-first (`start`/`end`), fully accessible via keyboard, and compliant with WCAG AA contrast.

---

## 4. Architectural Approaches & Selection

### Option A: Headless Multi-Tenant API Hub + Native Client UI (Selected)
- **Architecture:** KaraPardaz provides secure REST APIs (`/api/v1/tickets/...`). Each client platform (AMLAK) uses an API key on the server side and renders its own native UI. KaraPardaz admins manage all tickets in KaraPardaz Admin.
- **Pros:**
  - Complete brand and UX consistency inside AMLAK (and any future project).
  - Clean separation of concerns; KaraPardaz remains the central brain.
  - Rock-solid security; client credentials never touch the browser.
  - Frictionless onboarding of future projects.
- **Cons:**
  - Requires implementing the UI views in both KaraPardaz and the client platform.

### Option B: Embeddable Widget / Hosted Iframe
- **Architecture:** KaraPardaz provides a hosted JS script or iframe embeddable into any website.
- **Pros:**
  - Single script tag insertion for future projects.
- **Cons:**
  - Broken look & feel across different client designs.
  - Complex session passing and cross-origin security quirks.
  - Substandard mobile experience within complex dashboards.

### Decision
**Option A was selected** by consensus because it delivers a seamless, enterprise-grade experience for consultants while giving KaraPardaz a scalable foundation for any future software client.

---

## 5. System Architecture & Components

```
┌─────────────────────────────────────────────────────────────┐
│                       AMLAK Platform                        │
│                                                             │
│  ┌─────────────────────────┐      ┌──────────────────────┐  │
│  │   Consultant Browser    │      │  AMLAK Server Proxy  │  │
│  │  (/support Ticket Tab)  │◄────►│ (Next.js / Go API)   │  │
│  └─────────────────────────┘      └──────────┬───────────┘  │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                                 HTTPS + X-Project-Key
                                 + Consultant Identity
                                               │
┌──────────────────────────────────────────────▼──────────────┐
│                   KaraPardaz Avand Hub                      │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     Public Tenant API (/api/v1/tickets/...)           │  │
│  │     - Project Verification & Rate Limiting            │  │
│  │     - Ticket CRUD & Message Appending                 │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              ▼                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     MongoDB Storage Layer                             │  │
│  │     - SupportedProjects (tenants, api keys)           │  │
│  │     - SupportTickets (project, requester, status)     │  │
│  │     - Messages (sender, role, content, timestamp)     │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              ▲                              │
│  ┌───────────────────────────┴───────────────────────────┐  │
│  │     KaraPardaz Operator Admin (/admin/tickets)        │  │
│  │     - Multi-project selector & filters                │  │
│  │     - Response composer & status lifecycle manager    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Database Schema Specifications (KaraPardaz)

### 6.1. `SupportedProject` (Tenant Configuration)
```typescript
interface ISupportedProject {
  projectId: string;          // e.g. "amlak"
  name: string;               // e.g. "سامانه مدیریت املاک"
  apiKeyHash: string;         // bcrypt hash of the secret project key
  departments: Array<{
    id: string;               // e.g. "technical", "sales", "general"
    nameFa: string;           // e.g. "پشتیبانی فنی و سامانه"
    nameEn?: string;
  }>;
  isActive: boolean;
  webhookUrl?: string;        // Optional: for notifying client app on replies
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.2. `SupportTicket` & `TicketMessage`
```typescript
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "ANSWERED" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface ITicketMessage {
  _id?: mongoose.Types.ObjectId;
  senderRole: "CLIENT_USER" | "SUPPORT_AGENT";
  senderId: string;           // Consultant ID or KaraPardaz Admin ID
  senderName: string;         // e.g. "علی محمدی (مشاور املاک نگین)" or "تیم فنی کاراپرداز"
  message: string;
  attachments?: Array<{
    name: string;
    url: string;
    size?: number;
    mimeType?: string;
  }>;
  createdAt: Date;
}

interface ISupportTicket {
  ticketNumber: string;       // Human-readable code: e.g. "TK-AMLAK-1042"
  projectId: string;          // Reference to SupportedProject.projectId
  requester: {
    userId: string;           // External unique identifier in client app
    name: string;             // Consultant full name
    phone?: string;           // Contact phone
    email?: string;
    organization?: string;    // e.g. Agency Name
  };
  department: string;         // Department ID
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  messages: ITicketMessage[];
  lastMessageAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 6.3. Ticket Lifecycle, Reopening & Authorization (Builder Decisions)
- **Lifecycle & Reopening:**
  - `OPEN` -> `IN_PROGRESS` (operator picked it up) -> `ANSWERED` (operator replied).
  - `ANSWERED` -> `RESOLVED` (user or operator marked resolved).
  - A `RESOLVED` ticket can be reopened by the user posting a reply within 7 days, which transitions it back to `OPEN`.
  - After 7 days of inactivity in `RESOLVED` status, or when explicitly closed via `/close`, a ticket becomes `CLOSED` (terminal/immutable). Posting new messages to a `CLOSED` ticket returns HTTP 409 Conflict with an error prompting the user to create a new ticket.
- **Authorization & Visibility Scoping:**
  - Tickets are primarily scoped to `requester.userId` within the authenticated `projectId`.
  - `requester.organization` is indexed to allow future supervisor/agency-wide aggregated visibility without schema migrations.
- **Attachment Pipeline (v1):**
  - Messages in v1 support direct text descriptions, logs, and markdown links. Full binary multipart file storage (MinIO/S3) is planned for v1.1; the schema stores optional URL attachments if provided.

---

## 7. API Contract

### 7.1. External Tenant API (`/api/v1/tickets`)
All requests from client platforms require the following headers:
- `X-Project-Id: <projectId>`
- `X-Project-Key: <secretApiKey>`

Endpoints:
1. `GET /api/v1/tickets?userId=<requesterId>&status=<status>&page=1&limit=20`  
   Returns paginated tickets belonging to the specified user within the authenticated project.
2. `POST /api/v1/tickets`  
   Creates a new ticket and its initial message.  
   **Payload:**
   ```json
   {
     "requester": {
       "userId": "usr_9812",
       "name": "سهراب مرادی",
       "phone": "09123456789",
       "organization": "املاک وزرا"
     },
     "department": "technical",
     "priority": "HIGH",
     "subject": "عدم بارگذاری فیلترهای پیشرفته در جستجوی فایل",
     "message": "هنگام اعمال فیلتر محدوده و قیمت، لیست ملک‌ها بروزرسانی نمی‌شود."
   }
   ```
3. `GET /api/v1/tickets/:id?userId=<requesterId>`  
   Retrieves full ticket detail and message timeline (with authorization check that `userId` owns the ticket).
4. `POST /api/v1/tickets/:id/messages`  
   Adds a reply from the client user. Updates status to `IN_PROGRESS` or `OPEN`.
5. `PATCH /api/v1/tickets/:id/close`  
   Allows the user to close a resolved ticket.

### 7.2. KaraPardaz Internal Admin API (`/api/admin/tickets`)
Protected by KaraPardaz JWT Admin Cookie:
1. `GET /api/admin/tickets` (filters: `projectId`, `status`, `department`, `search`, `page`, `limit`)
2. `GET /api/admin/tickets/:id` (full conversation + requester profile)
3. `POST /api/admin/tickets/:id/reply` (sends agent response, updates status to `ANSWERED`)
4. `PATCH /api/admin/tickets/:id/status` (manually change status to `IN_PROGRESS`, `RESOLVED`, `CLOSED`)
5. `GET /api/admin/tickets/projects` (lists registered client projects and stats)

---

## 8. User Experience & UI Flows

### 8.1. KaraPardaz Admin Panel (`/admin/tickets`)
- **Navigation:** Added to `AdminShell.tsx` alongside existing modules.
- **Header Summary:** Metric cards showing Total Open Tickets, Awaiting Support Response, Average Resolution Time, Partitioned by Project.
- **Project Filter Bar:** Tabs `[ همه پروژه‌ها ] [ املاک (AMLAK) ] [ + افزودن پروژه ]`.
- **Ticket Table:** Ticket number, Project badge, Requester (with agency/phone tooltip), Department, Priority badge, Status badge, Last updated time.
- **Ticket Detail / Reply Panel:**
  - Left/Top: Ticket metadata & Requester contact info.
  - Center: Chronological message conversation bubble stream (distinct styling for Agent vs Client User).
  - Bottom: Markdown/Text reply area with canned responses and "ارسال پاسخ و تغییر وضعیت" button.

### 8.2. AMLAK Support Page (`/support`)
- **Tab Layout:** Extend the existing tabs in `/support`:
  - `دانش‌نامه و راهنما` (existing)
  - `سوالات متداول` (existing)
  - `تیکت‌های پشتیبانی من` **(New)**
- **Tickets Tab Features:**
  - Action button: "ثبت تیکت جدید" opening a modal with Department, Subject, Priority, and Description.
  - Active tickets list with status chips (در انتظار پاسخ کاراپرداز، پاسخ داده شد، بسته شده).
  - Clicking a ticket opens a clean conversation drawer/dialog showing the history of messages and a reply box to follow up.

---

## 9. Rollout & Builder Decisions

### Decided in this Document
- MongoDB schema and collection naming in KaraPardaz.
- REST endpoint structure and header-based tenant authentication.
- Separation of concerns between KaraPardaz (central repository) and AMLAK (client consumer).
- Status lifecycle: `OPEN`, `IN_PROGRESS`, `ANSWERED`, `RESOLVED`, `CLOSED`.

### Left to Builder Implementation
- Specific debounce timings for search inputs.
- Seed script (`scripts/seed-tickets.ts`) for generating initial mock tickets and initial `amlak` project API key for development and automated testing.
- UI component breakdown and animations inside KaraPardaz admin and AMLAK dashboard.

---
