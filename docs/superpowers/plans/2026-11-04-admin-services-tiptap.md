# Implementation Plan: Admin Services Management (Hybrid Tiptap + Structured Fields)

**Date:** 2026-11-04  
**Spec:** `docs/superpowers/specs/2026-11-04-admin-services-tiptap-design.md`  
**Branch:** `feature/admin-services-tiptap`  

---

## Tasks

### Task 1: Mongoose Service Model & Zod Validations
- Create `src/lib/db/models/Service.ts` with strict schema matching `serviceSchema`.
- Create `src/lib/validations/service.ts` with comprehensive Zod validator and input schemas.
- Create unit test `scripts/test-service-model.ts` and verify.

### Task 2: Seed Script for Existing 6 Services
- Create `scripts/seed-services.ts` that reads `crmService`, `ragAiService`, `dataScienceService`, `erpService`, `webPlatformsService`, `customSoftwareService` and upserts them into MongoDB with `status: "published"`.
- Run script and verify MongoDB documents.

### Task 3: Admin Services CRUD API Endpoints
- Create `src/app/api/admin/services/route.ts` (GET all, POST new).
- Create `src/app/api/admin/services/[id]/route.ts` (GET one, PUT update, DELETE).
- Create test script `scripts/test-services-api.ts` and verify authentication, validation and CRUD operations.

### Task 4: Admin Shell Navigation & Admin Services List Page
- Update `src/app/[locale]/admin/AdminShell.tsx` to add `/admin/services` link in the sidebar.
- Create `src/app/[locale]/admin/services/page.tsx` and `AdminServicesClient.tsx` with statistics cards, status badges, and action buttons.

### Task 5: Admin Service Edit & Create Pages with Tabs & Tiptap Deep-Dive
- Create reusable `ServiceForm.tsx` with 5 tabs:
  1. Basics & Hero
  2. Deliverables & Steps
  3. Stack & System Map
  4. FAQs & Projects
  5. Deep-Dive Architecture (Tiptap Rich-Text Editor with code block, callouts, CTA, etc.)
- Create `src/app/[locale]/admin/services/new/page.tsx` & `NewServiceClient.tsx`.
- Create `src/app/[locale]/admin/services/[id]/edit/page.tsx` & `EditServiceClient.tsx`.

### Task 6: Public Services Frontend Integration
- Update `src/content/services/index.ts` to seamlessly fetch from MongoDB with static fallback.
- Update `src/app/[locale]/services/[slug]/page.tsx` to render the deep-dive Tiptap section when `deepDiveHtml` exists.

### Task 7: Full Verification & Build
- Run TypeScript check (`tsc --noEmit`).
- Run ESLint (`npm run lint`).
- Run all test scripts (`scripts/test-service-model.ts`, `scripts/test-services-api.ts`, etc.).
- Run production build (`next build`) and confirm 0 errors.
