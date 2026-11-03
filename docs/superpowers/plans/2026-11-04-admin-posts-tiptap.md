# Admin Posts Management with Tiptap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, multilingual admin CMS for Posts (Insights) in Kara Pardaz Oond, featuring a customized Persian-first Tiptap rich-text editor, automated normalization & TOC extraction, MongoDB persistence, and frontend public blog integration.

**Architecture:** Mongoose `Post` schema with dual content storage (`contentJson` for editor state, `contentHtml` for public SSR), auto-generating slugified heading IDs and precomputed `toc` on save. Admin UI provides structured fields for metadata alongside the Tiptap canvas. Public insights routes fetch directly from MongoDB with graceful build-time handling.

**Tech Stack:** Next.js (App Router), TypeScript, Mongoose, MongoDB, Tiptap (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-code-block-lowlight`), lowlight, Tailwind CSS, Zod.

**Spec:** [`docs/superpowers/specs/2026-11-04-admin-posts-tiptap-design.md`](file:///home/soheil/My/Code1Sprint/KaraPardaz/docs/superpowers/specs/2026-11-04-admin-posts-tiptap-design.md)

## Global Constraints

- RTL-first: logical properties only (`ms-`, `me-`, `ps-`, `pe-`, `text-start`). Never bare left or right.
- All colors and typography must use design tokens (`var(--text)`, `var(--muted)`, `var(--line)`, `var(--panel)`, `var(--blue)`, Vazirmatn font, JetBrains Mono font).
- Code blocks must strictly render with `dir="ltr"` and `font-mono text-left`.
- ZWNJ (`\u200c`) shortcut on `Shift+Space` and `Mod-Shift-2`.
- Pre-save normalization converts Arabic `ي`/`ك` to Persian `ی`/`ک` and normalizes Persian numbers for `locale: "fa"`.
- `contentJson` holds Tiptap state; `contentHtml` holds pre-sanitized, slugified HTML.

## Review Focus

1. **Heading ID collisions:** If a Persian article has duplicate headings (e.g. two `نتیجه‌گیری`), slugification must append numeric suffixes (`نتیجه‌گیری-1`) to avoid broken TOC anchor jumps.
2. **Empty or unreachable DB at build time:** `generateStaticParams` and public listing must not crash `next build` if MongoDB is empty or unseeded; they must return a fallback empty array.
3. **Locale mismatch on public view:** Requesting `/en/insights/crm-fit` when `crm-fit` only exists in `fa` must trigger `notFound()`.
4. **Preservation of English code and URLs during Persian normalization:** Normalizer must not replace numbers or Latin letters inside `<code>`, `<pre>`, or `href` attributes.
5. **Session auth protection on admin routes:** All `/api/admin/posts` mutating endpoints must enforce admin auth session via `requireAdminAuth()`.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: Installed npm packages: `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-code-block-lowlight`, `lowlight`.

- [ ] **Step 1: Install Tiptap and lowlight dependencies**
  Run: `npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-code-block-lowlight lowlight`
- [ ] **Step 2: Verify package.json contains new dependencies**
  Inspect `package.json` and ensure `@tiptap/react` is present.
- [ ] **Step 3: Commit**
  ```bash
  git add package.json package-lock.json
  git commit -m "chore: install tiptap and lowlight dependencies"
  ```

---

### Task 2: Data Model & Schema (`Post`)

**Files:**
- Create: `src/lib/db/models/Post.ts`
- Create: `src/lib/validations/post.ts`
- Test: `scripts/test-post-model.ts`

**Interfaces:**
- Produces: `IPost` interface, `Post` Mongoose model, `postFormSchema` Zod validator.

- [ ] **Step 1: Create Zod validation schema in `src/lib/validations/post.ts`**
  Define `postInputSchema` verifying:
  - `slug`: string (trimmed, lowercased, regex `/^[a-z0-9-]+$/`)
  - `locale`: enum `["fa", "en"]`
  - `title`: string (min 3)
  - `summary`: string (min 10)
  - `tags`: array of strings
  - `author`: object with `name`, `role`, `avatar`
  - `status`: enum `["draft", "published"]`
  - `publishedAt`: coerce date
  - `cover`: optional string
  - `contentJson`: record
  - `contentHtml`: string
- [ ] **Step 2: Create Mongoose schema and model in `src/lib/db/models/Post.ts`**
  Implement `PostSchema` with compound unique index `{ slug: 1, locale: 1 }` and query index `{ locale: 1, status: 1, publishedAt: -1 }`.
  Export `getPostModel()` with hot-reload singleton cache `mongoose.models.Post || mongoose.model("Post", PostSchema)`.
- [ ] **Step 3: Write a test verification script `scripts/test-post-model.ts`**
  Connect to DB, test schema validation, verify duplicate `{ slug, locale }` is rejected, and cleanup test doc.
- [ ] **Step 4: Run test verification script**
  Run: `npx tsx scripts/test-post-model.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/lib/db/models/Post.ts src/lib/validations/post.ts scripts/test-post-model.ts
  git commit -m "feat(db): create Post model, schema and zod validations"
  ```

---

### Task 3: Persian Normalizer & TOC Extractor

**Files:**
- Create: `src/lib/editor/normalizer.ts`
- Test: `scripts/test-normalizer.ts`

**Interfaces:**
- Produces:
  - `normalizePersianText(text: string): string`
  - `processPostContent(rawHtml: string, locale: "fa" | "en"): { contentHtml: string; toc: Array<{ id: string; title: string; depth: number }>; readingTime: number }`

- [ ] **Step 1: Create unit test script `scripts/test-normalizer.ts`**
  Test cases:
  1. Arabic `ي` and `ك` converted to `ی` and `ک` in Persian mode.
  2. Numbers in normal text converted to Persian in `fa`, but preserved inside `<code>...</code>` and `<pre>...</pre>`.
  3. ZWNJ surrounding whitespace trimmed.
  4. Headings `<h2>` and `<h3>` injected with `id` attribute; duplicate headings get sequential suffix (`-1`, `-2`).
  5. Reading time calculation (approx 200 words per minute).
- [ ] **Step 2: Run test to verify failure**
  Run: `npx tsx scripts/test-normalizer.ts`
  Expected: FAIL ("cannot find module")
- [ ] **Step 3: Implement `src/lib/editor/normalizer.ts`**
  Implement `normalizePersianText` and `processPostContent`.
- [ ] **Step 4: Run test to verify pass**
  Run: `npx tsx scripts/test-normalizer.ts`
  Expected: PASS
- [ ] **Step 5: Commit**
  ```bash
  git add src/lib/editor/normalizer.ts scripts/test-normalizer.ts
  git commit -m "feat(editor): implement persian normalizer, heading id injection and toc extraction"
  ```

---

### Task 4: Seed Script for Existing MDX Posts

**Files:**
- Create: `scripts/seed-posts.ts`

**Interfaces:**
- Consumes: `src/content/posts/*.mdx`, `Post` model, `processPostContent`.
- Produces: Populates MongoDB with the 3 existing posts (`crm-fit`, `staged-delivery`, `rag-boundaries`) under `locale: "fa"`.

- [ ] **Step 1: Implement `scripts/seed-posts.ts`**
  Parse the existing 3 `.mdx` files using `gray-matter`. Convert markdown body to clean HTML via basic markdown-to-html or existing mdx compiler, run `processPostContent`, and upsert into MongoDB with `slug` and `locale: "fa"`.
- [ ] **Step 2: Run seed script**
  Run: `npm run seed:admin && npx tsx scripts/seed-posts.ts`
  Expected: Output `Successfully seeded 3 posts into MongoDB`.
- [ ] **Step 3: Commit**
  ```bash
  git add scripts/seed-posts.ts
  git commit -m "feat(db): add seed script for initial insights posts"
  ```

---

### Task 5: Admin Post Management API Routes

**Files:**
- Create: `src/app/api/admin/posts/route.ts`
- Create: `src/app/api/admin/posts/[id]/route.ts`
- Test: `scripts/test-posts-api.ts`

**Interfaces:**
- Consumes: `requireAdminAuth` (or session auth check), `Post` model, `processPostContent`, `postInputSchema`.
- Produces:
  - `GET /api/admin/posts?locale=...&status=...&q=...`
  - `POST /api/admin/posts`
  - `GET /api/admin/posts/[id]`
  - `PUT /api/admin/posts/[id]`
  - `DELETE /api/admin/posts/[id]`

- [ ] **Step 1: Implement `src/app/api/admin/posts/route.ts`**
  GET returns list sorted by `publishedAt: -1`. POST validates input with Zod, runs `processPostContent`, creates doc, returns 201.
- [ ] **Step 2: Implement `src/app/api/admin/posts/[id]/route.ts`**
  GET by id, PUT validates and updates with `processPostContent`, DELETE removes doc.
- [ ] **Step 3: Test API routes with `scripts/test-posts-api.ts`**
  Run script simulating admin requests to create, get, update, and delete a draft post.
- [ ] **Step 4: Commit**
  ```bash
  git add src/app/api/admin/posts/route.ts src/app/api/admin/posts/[id]/route.ts scripts/test-posts-api.ts
  git commit -m "feat(api): implement admin posts CRUD endpoints"
  ```

---

### Task 6: Tiptap Persian Rich-Text Editor Component

**Files:**
- Create: `src/components/admin/editor/TiptapEditor.tsx`
- Create: `src/components/admin/editor/TiptapToolbar.tsx`
- Create: `src/components/admin/editor/zwnj-extension.ts`

**Interfaces:**
- Produces: `<TiptapEditor value={jsonValue} onChange={(json, html) => void} locale={"fa" | "en"} />`

- [ ] **Step 1: Create `src/components/admin/editor/zwnj-extension.ts`**
  Create custom Tiptap extension adding keyboard shortcuts for `Shift-Space` and `Mod-Shift-2` to insert `\u200c`.
- [ ] **Step 2: Create `src/components/admin/editor/TiptapToolbar.tsx`**
  Floating / sticky toolbar with buttons: Bold, Italic, H2, H3, BulletList, OrderedList, Blockquote, CodeBlock, Link, ZWNJ button, Undo, Redo. Styled with design tokens and visible focus.
- [ ] **Step 3: Create `src/components/admin/editor/TiptapEditor.tsx`**
  Integrate extensions (StarterKit, Link, Placeholder, CodeBlockLowlight with `lowlight`, ZwnjExtension). Apply `prose prose-slate max-w-none text-text font-vazirmatn leading-relaxed` and `dir={locale === "fa" ? "rtl" : "ltr"}`.
- [ ] **Step 4: Commit**
  ```bash
  git add src/components/admin/editor/
  git commit -m "feat(ui): create Tiptap Persian editor with toolbar and ZWNJ extension"
  ```

---

### Task 7: Admin UI Pages for Posts

**Files:**
- Modify: `src/app/[locale]/admin/posts/page.tsx`
- Create: `src/app/[locale]/admin/posts/new/page.tsx`
- Create: `src/app/[locale]/admin/posts/[id]/edit/page.tsx`
- Create: `src/components/admin/posts/PostForm.tsx`

**Interfaces:**
- Produces: Full admin UI to browse, search, filter, create, and edit posts.

- [ ] **Step 1: Create `src/components/admin/posts/PostForm.tsx`**
  Two-column form layout:
  - Main column: Title input, TiptapEditor for content body.
  - Sidebar: Slug (with auto-slugify button from title), Locale selector (`fa` / `en`), Summary textarea, Tags input, Author fields, Status selector (`draft` / `published`), PublishedAt date picker, Cover URL.
  - Top action bar with "ذخیره تغییرات" and "پیش‌نمایش" buttons.
- [ ] **Step 2: Implement `src/app/[locale]/admin/posts/page.tsx`**
  Connect to `/api/admin/posts`. Display real data table with search, locale filter tabs (`همه`, `فارسی`, `انگلیسی`), status badge, actions (ویرایش, حذف), and "افزودن مقاله جدید" linking to `/admin/posts/new`.
- [ ] **Step 3: Implement `src/app/[locale]/admin/posts/new/page.tsx`**
  Renders `PostForm` in create mode. On submit, POSTs to `/api/admin/posts` and redirects to `/admin/posts`.
- [ ] **Step 4: Implement `src/app/[locale]/admin/posts/[id]/edit/page.tsx`**
  Fetches post data, renders `PostForm` in edit mode. On submit, PUTs to `/api/admin/posts/[id]` with toast confirmation.
- [ ] **Step 5: Verify in browser / build**
  Run: `npm run lint && npm run typecheck`
  Expected: PASS
- [ ] **Step 6: Commit**
  ```bash
  git add src/app/[locale]/admin/posts/ src/components/admin/posts/
  git commit -m "feat(admin): build posts listing and create/edit form pages"
  ```

---

### Task 8: Public Insights Blog Frontend Integration

**Files:**
- Modify: `src/content/posts.ts`
- Modify: `src/app/[locale]/insights/page.tsx`
- Modify: `src/app/[locale]/insights/[slug]/page.tsx`

**Interfaces:**
- Connects public `/insights` and `/insights/[slug]` to MongoDB `Post` collection.

- [ ] **Step 1: Update `src/content/posts.ts`**
  Implement `getPostBySlug(slug: string, locale: string)` and `getPosts(locale: string)` querying MongoDB `Post` model. Handle build-time gracefully (return empty array if DB unavailable).
- [ ] **Step 2: Update `src/app/[locale]/insights/[slug]/page.tsx`**
  Render `post.contentHtml` directly inside `<Prose dangerouslySetInnerHTML={{ __html: post.contentHtml }} />` and pass precomputed `post.toc` to `<TableOfContents>`.
- [ ] **Step 3: Update `src/app/[locale]/insights/page.tsx`**
  List posts fetched from MongoDB filtered by the current `locale`.
- [ ] **Step 4: Verify Next.js build**
  Run: `npm run build`
  Expected: Build succeeds with static/dynamic routes.
- [ ] **Step 5: Commit**
  ```bash
  git add src/content/posts.ts src/app/[locale]/insights/
  git commit -m "feat(insights): integrate public blog pages with MongoDB and pre-rendered HTML"
  ```

---

### Task 9: End-to-End Verification and Acceptance Check

**Files:**
- Test verification across admin and public pages.

- [ ] **Step 1: Run linter and typechecker**
  Run: `npm run lint && npm run typecheck`
  Expected: Clean pass with 0 errors.
- [ ] **Step 2: Run end-to-end test script**
  Run: `npx tsx scripts/seed-posts.ts && npm run build`
  Expected: All 3 seeded posts build and render cleanly.
- [ ] **Step 3: Commit and summarize**
  ```bash
  git commit --allow-empty -m "chore: complete admin posts tiptap implementation"
  ```
