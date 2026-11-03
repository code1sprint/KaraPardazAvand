# Design Spec: Admin Services Management with Hybrid Tiptap + Structured Fields

**Date:** 2026-11-04  
**Author:** Kara Pardaz Oond Engineering  
**Branch:** `feature/admin-services-tiptap`  
**Status:** In Progress

---

## 1. Overview & Business Objectives

Kara Pardaz Oond provides 6 high-value software services:
1. `crm`: سیستم‌های سازمانی و CRM سفارشی (Enterprise Systems & Custom CRM)
2. `rag-ai`: سامانه‌های هوش مصنوعی و RAG (Enterprise AI & RAG)
3. `data-science`: علم داده و داشبوردهای تحلیلی (Data Science & Analytics)
4. `erp`: سیستم‌های یکپارچه ERP (Enterprise ERP)
5. `web-platforms`: وب‌سایت‌ها و پلتفرم‌های مقیاس‌پذیر (Scalable Web Platforms)
6. `custom-software`: نرم‌افزارهای سفارشی عملیاتی (Custom Operational Software)

These pages have a rich, signature design structure:
- High-level value proposition and system map SVG diagram
- Target audience list
- Bento deliverables tiles (4 to 6 items)
- 4-step delivery process track
- Grouped technology stack chips
- Case-study project links
- Technical FAQ accordion
- Bottom CTA banner

### The Hybrid Architecture
- **Structured Fields:** For all core brand sections (Deliverables, Audience, Process Steps, Stack, System Map, FAQs, Bento) so layout integrity and signature animations are strictly preserved.
- **Tiptap Rich Editor:** For an optional **«توضیحات عمیق و جزییات فنی معماری» (Deep-Dive / Architecture Notes)** section, allowing technical leads to write rich engineering deep-dives, insert code blocks, tables, callout warnings, and custom CTA buttons directly in the service page.

---

## 2. Data Model (`src/lib/db/models/Service.ts`)

A Mongoose model representing a service:
- `slug`: string (indexed, unique, lowercase, kebab-case)
- `title`: `{ fa: string, en: string }`
- `outcome`: `{ fa: string, en: string }` (Lead summary)
- `audience`: `Array<{ fa: string, en: string }>` (2-6 items)
- `deliverables`: `Array<{ title: { fa: string, en: string }, description: { fa: string, en: string } }>`
- `steps`: `Array<{ title: { fa: string, en: string }, description: { fa: string, en: string } }>` (4 steps)
- `stack`: `Array<{ label: { fa: string, en: string }, items: string[] }>`
- `systemMap`:
  - `windowTitle`: string
  - `layout`: "hub" | "funnel" | "modules" | "pipeline" | "etl" | "stack"
  - `descriptionLead`: `{ fa: string, en: string }`
  - `description`: `{ fa: string, en: string }`
  - `nodes`: `{ inputTop, inputBottom, core, outputTop, outputBottom }` (localized)
  - `logs`: `Array<{ fa: string, en: string }>` (3 items)
- `faqs`: `Array<{ id: string, question: { fa: string, en: string }, answer: { fa: string, en: string } }>`
- `relatedProjects`: `string[]`
- `bento`: `{ order: number, span: 2 | 4 | 6, image: string, shortTitle: { fa: string, en: string } }`
- `deepDiveJson`: `Record<string, unknown>` (Tiptap ProseMirror document)
- `deepDiveHtml`: `string` (Sanitized and normalized HTML output)
- `status`: `"published" | "draft"`
- `updatedBy`: ObjectId ref to User
- `timestamps`: `true`

---

## 3. API Endpoints

- `GET /api/admin/services`: Lists all services with summary fields.
- `POST /api/admin/services`: Creates a new service with Zod validation and Persian normalization.
- `GET /api/admin/services/[id]`: Returns full service data for editing.
- `PUT /api/admin/services/[id]`: Updates service with validation.
- `DELETE /api/admin/services/[id]`: Removes a service (or marks draft).

---

## 4. Admin UI (`/admin/services`)

1. **Dashboard / Index (`/admin/services/page.tsx`):**
   - Clean table of 6 services showing Icon, Title, Slug, Layout, Status, and Edit Action.
   - Quick filters (All, Published, Draft).
   - "ایجاد خدمت جدید" button.
2. **Editor Form (`/admin/services/[id]/edit/page.tsx`):**
   - Tabbed layout matching the mental model of the product:
     - **تب ۱: اطلاعات پایه و هیرو (Basics & Hero)**: Title, Slug, Outcome Lead, Audience, Bento config, Status.
     - **تب ۲: خروجی‌های ملموس و مراحل (Deliverables & Steps)**: Repeater for deliverables with title/description, 4 delivery steps.
     - **تب ۳: استک فنی و دیاگرام سیستم (Stack & System Map)**: Stack categories and tags, System map window title, topology layout selector (`hub`, `pipeline`, etc.), node labels, terminal logs.
     - **تب ۴: سوالات متداول و پروژه‌ها (FAQs & Projects)**: FAQ items repeater, project checkboxes.
     - **تب ۵: یادداشت‌های فنی و معماری عمیق (Deep-Dive Tiptap)**: Full Tiptap editor with callouts, code blocks, tables, and media.
   - Live action bar: Save draft, Publish, Preview on site.

---

## 5. Public Site Integration

- `src/content/services/index.ts`: `getAllServices()` and `getServiceBySlug(slug)` first query MongoDB; if database is unreachable or building statically without DB, fall back cleanly to static `crmService`, `ragAiService`, etc.
- `src/app/[locale]/services/[slug]/page.tsx`: If `service.deepDiveHtml` is set, render the dedicated deep-dive section with `.prose` formatting, respecting tokens and RTL.
