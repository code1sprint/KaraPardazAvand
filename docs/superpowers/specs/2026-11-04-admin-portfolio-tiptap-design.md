# Design Spec: Admin Portfolio & Case Studies Management (Hybrid Tiptap + Structured Fields)

**Date:** 2026-11-04  
**Author:** Kara Pardaz Oond Engineering  
**Branch:** `feature/admin-portfolio-tiptap`  
**Status:** In Progress

---

## 1. Overview & Business Objectives

Portfolio and Case Studies (`/portfolio` and `/portfolio/[slug]`) demonstrate Kara Pardaz Oond's real-world software engineering capabilities.

Current projects:
1. `ops-crm-pilot`: پایلوت CRM عملیات فروش (B2B Distribution & Sales)
2. `rag-knowledge-pilot`: پایلوت RAG دانش داخلی (Internal Knowledge RAG Pilot)

### The Hybrid Architecture
- **Structured Fields:** For essential case-study metadata:
  - Title, Slug, Sector, Year, Services tags, Company Role.
  - Problem & Solution statements.
  - Sourced Results (Key Metrics): value, label, and verifiable source (maintaining brand trust; unsourced results remain hidden per `getSourcedResults`).
  - Technology Stack tags.
  - Cover image and Gallery items with captions.
  - Project Architecture System Map: topology layout, console window title, 5-node map, and execution logs.
  - Featured & Status flags (`published` / `draft`).
- **Tiptap Rich-Text Editor:** For the in-depth case study narrative (deep dive, architecture decisions, trade-offs, terminal code blocks, nested callouts, and inline CTAs).

---

## 2. Data Model (`src/lib/db/models/Project.ts`)

Mongoose model:
- `slug`: string (unique, indexed, lowercase, kebab-case)
- `title`: string (required)
- `sector`: string (required, drives sector filter chips)
- `year`: string (e.g. "1403" or "2024")
- `services`: string[] (references service slugs: `crm`, `rag-ai`, `erp`, etc.)
- `role`: string (e.g. "طراحی محصول و پیاده‌سازی هسته CRM")
- `problem`: string (required)
- `solution`: string (required)
- `results`: Array<{ label: string; value: string; source?: string }>
- `stack`: string[] (e.g. ["TypeScript", "PostgreSQL", "Next.js"])
- `cover`: string (e.g. "/projects/ops-crm-cover.svg")
- `gallery`: Array<{ src: string; caption: string; alt?: string }>
- `systemMap`:
  - `windowTitle`: string
  - `layout`: "hub" | "funnel" | "modules" | "pipeline" | "etl" | "stack"
  - `descriptionLead`: string
  - `description`: string
  - `nodes`: { inputTop: string; inputBottom: string; core: string; outputTop: string; outputBottom: string }
  - `logs`: [string, string, string]
- `featured`: boolean (default: false)
- `status`: "published" | "draft" (default: "draft")
- `contentJson`: Record<string, unknown> (Tiptap document)
- `contentHtml`: string (Normalized HTML output)
- `timestamps`: true

---

## 3. API Endpoints

- `GET /api/admin/projects`: Lists all projects with filters (sector, status, search).
- `POST /api/admin/projects`: Validates and creates a new project with Persian normalization.
- `GET /api/admin/projects/[id]`: Returns full project data for editing.
- `PUT /api/admin/projects/[id]`: Updates project fields and HTML.
- `DELETE /api/admin/projects/[id]`: Removes project document.

---

## 4. Admin UI (`/admin/projects`)

1. **Dashboard List (`/admin/projects/page.tsx`):**
   - KPI counters: Total Projects, Published, Drafts, Featured.
   - Filter chips for status and sectors.
   - Table: Title, Slug, Sector, Year, Services, Results count, Status, Actions.
2. **Form with 5 Mental-Model Tabs (`ProjectForm.tsx`):**
   - **تب ۱: مشخصات پایه و دسته‌بندی (General & Metadata)**: Title, Slug, Sector, Year, Services multi-select, Role, Cover, Featured, Status.
   - **تب ۲: مسئله و راهکار (Problem & Solution)**: Clear problem & solution inputs.
   - **تب ۳: دستاوردهای عددی و استک (Metrics & Tech Stack)**: Sourced results repeater, Stack tags.
   - **تب ۴: گالری و دیاگرام سیستم (Gallery & System Map)**: Gallery repeater with media picker, System map topology and nodes.
   - **تب ۵: روایت پروژه و تحلیل فنی (Tiptap Case Study Narrative)**: Full Tiptap editor with code blocks, callouts, and CTA.

---

## 5. Public Site Integration

- `src/content/projects.ts`: Update `getAllProjects()` and `getProjectBySlug()` to query MongoDB with `"use cache"` and fallback to local MDX if DB is unavailable.
- `src/app/[locale]/portfolio/[slug]/page.tsx`: Render `project.contentHtml` seamlessly when available.
