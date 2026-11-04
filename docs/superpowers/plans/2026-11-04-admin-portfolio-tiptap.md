# Implementation Plan: Admin Portfolio & Case Studies Management

**Date:** 2026-11-04  
**Spec:** `docs/superpowers/specs/2026-11-04-admin-portfolio-tiptap-design.md`  
**Branch:** `feature/admin-portfolio-tiptap`  

---

## Tasks

### Task 1: Mongoose Project Model & Zod Validations
- Create `src/lib/db/models/Project.ts` with strict schema matching `projectSchema`.
- Create `src/lib/validations/project.ts` with Zod validation.
- Create unit test `scripts/test-project-model.ts` and verify.

### Task 2: Seed Script for Existing 2 Pilot Projects
- Create `scripts/seed-projects.ts` that reads `ops-crm-pilot.mdx` and `rag-knowledge-pilot.mdx` and upserts them into MongoDB.
- Run script and verify documents in MongoDB.

### Task 3: Admin Projects CRUD API Endpoints
- Create `src/app/api/admin/projects/route.ts` (GET list, POST new).
- Create `src/app/api/admin/projects/[id]/route.ts` (GET single, PUT update, DELETE).
- Create test script `scripts/test-projects-api.ts` and verify.

### Task 4: Admin Shell Navigation & Admin Projects List Page
- Update `src/app/[locale]/admin/AdminShell.tsx` to add `/admin/projects` link.
- Create `src/app/[locale]/admin/projects/page.tsx` and `AdminProjectsClient.tsx`.

### Task 5: Admin Project Form & Edit / Create Pages
- Create `src/components/admin/projects/ProjectForm.tsx` with 5 tabs and Tiptap integration.
- Create `src/app/[locale]/admin/projects/new/page.tsx` & `NewProjectClient.tsx`.
- Create `src/app/[locale]/admin/projects/[id]/edit/page.tsx` & `EditProjectClient.tsx`.

### Task 6: Public Portfolio Frontend Integration
- Update `src/content/projects.ts` to query MongoDB `Project` model with `"use cache"` and fallback.
- Update `src/app/[locale]/portfolio/[slug]/page.tsx` to render `contentHtml` when available.

### Task 7: Full Verification & Build
- Run TypeScript check (`tsc --noEmit`).
- Run ESLint (`npm run lint`).
- Run all test suites.
- Run production build (`next build`) and confirm 0 errors.
