# About page copy (intro + story) — Design

**Date:** 2026-11-14  
**Scope:** Rewrite About intro + story (option B). Add credibility blocks: what we build, how we work.  
**Tone:** Operational engineering (approach 1). Inspired by Exactlly/Albus-style About pages; no fake stats, dates, clients, or testimonials.  
**Status:** Copy approved by stakeholder. Awaiting review of this spec before implementation plan.

## Goals

- Professional Persian-first (and English) About copy that does not read as AI boilerplate.
- SEO: natural use of canonical name «کارا پرداز اوند» / Kara Pardaz Avand, plus services (corporate sites, e-commerce, CRM, ERP, RAG, dashboards, web platforms).
- Credibility without invented numbers: concrete service list + clear working method.
- Facts only: Code1Sprint alignment stated once, plainly; no “sister brand” marketing phrasing.

## Non-goals

- Rewriting principles / culture / team sections (out of scope unless follow-up).
- Inventing founding date, headcount, client logos, or case-study claims.
- Keyword stuffing.

## Content source / delivery (implementation constraint)

Today the public About page falls back to `src/content/about.ts` when MongoDB is empty/unavailable; admin reads only MongoDB. Story with headings + list needs HTML (`story.html` / TipTap), not a single plain `Text` paragraph.

**Implementation must update both:**

1. Static content in `src/content/about.ts` (intro + story) so site fallback is correct.
2. Seed / MongoDB About document (`scripts/seed-about-process.ts` and/or admin API payload) so `/admin/about` shows the same copy.

Story body format: HTML with `<p>`, `<h3>`, `<ul><li>` matching page prose styles.

## Approved copy

### Intro

| Field | fa | en |
|-------|----|----|
| title | نرم‌افزاری که با کار روزمرهٔ سازمان جور درمی‌آید | Software that fits how the organization actually works |
| lead | کارا پرداز اوند سامانه‌های سازمانی را از صفر طراحی می‌کند: وب و پلتفرم، CRM و ERP سفارشی، RAG سازمانی و داشبورد داده. تمرکز روی نتیجهٔ عملیاتی است، نه قالب آماده. | Kara Pardaz Avand designs enterprise systems from the ground up—web platforms, custom CRM and ERP, enterprise RAG, and data dashboards—aimed at operational outcomes, not off-the-shelf templates. |

### Story

| Field | fa | en |
|-------|----|----|
| title | دربارهٔ کارا پرداز اوند | About Kara Pardaz Avand |

**Body (fa) — narrative**

نرم‌افزار آماده وقتی خوب کار می‌کند که فرایند شما با قالبش یکی باشد. برای خیلی از سازمان‌ها این اتفاق نمی‌افتد: یا باید کار روزمره را عوض کنند، یا بعد از یک پروژهٔ سفارشی با سیستمی می‌مانند که نگهداری‌اش سخت است. کارا پرداز اوند روی همین فاصله کار می‌کند.

ما CRM و ERP اختصاصی، پلتفرم وب، داشبورد مدیریتی و سامانه‌های RAG را متناسب با فروش، عملیات و دادهٔ همان سازمان می‌سازیم. قبل از کد، محدوده و معیار موفقیت نوشته می‌شود؛ بعد از استقرار، دسترسی و مستندات طوری تحویل می‌شود که تیم خودتان بتواند ادامه دهد.

استاندارد مهندسی و مسیر فنی ما با Code1Sprint هم‌راستاست. تمرکز تحویل روی سازمان‌های ایرانی است که به سامانهٔ دقیق نیاز دارند، نه به محصول همه‌کاره.

**Body (fa) — چه می‌سازیم**

- سایت شرکتی و معرفی برند
- فروشگاه اینترنتی و سامانهٔ فروش آنلاین
- پلتفرم وب و سامانه‌های عملیاتی
- CRM اختصاصی برای فروش و پیگیری مشتری
- ERP سفارشی هم‌راستا با فرایند داخلی سازمان
- داشبورد داده برای تصمیم مدیریتی
- RAG سازمانی روی اسناد و دانش داخلی

**Body (fa) — چطور کار می‌کنیم**

کار را با فهم فرایند واقعی شروع می‌کنیم، نه با انتخاب قالب آماده. محدوده، فرضیات و معیار موفقیت را می‌نویسیم تا دو طرف بدانند چه چیزی ساخته می‌شود و چه چیزی خارج از پروژه است.

ساخت را مرحله‌به‌مرحله جلو می‌بریم؛ هر مرحله قابل دیدن و بازبینی است. در تحویل، کد، دسترسی‌ها و مستندات استقرار همراه سیستم می‌آید تا ادامهٔ کار دست تیم شما باشد.

**Body (en) — narrative**

Off-the-shelf software works when your process already matches its template. For many organizations it doesn’t: either day-to-day work has to bend, or a custom project leaves behind a system that is hard to keep running. Kara Pardaz Avand works that gap.

We build custom CRM and ERP, web platforms, management dashboards, and enterprise RAG around how each organization’s sales, operations, and data actually run. Scope and success criteria are written before code; after go-live, access and documentation are handed over so your own team can continue.

Our engineering bar and technical path align with Code1Sprint. Delivery focus is Iranian organizations that need a precise system—not a one-size-fits-all product.

**Body (en) — What we build**

- Corporate and company websites
- E-commerce and online sales systems
- Web platforms and operational systems
- Custom CRM for sales and customer follow-up
- Bespoke ERP aligned with internal process
- Data dashboards for management decisions
- Enterprise RAG over internal documents and knowledge

**Body (en) — How we work**

We start from how your process actually runs, not from a ready-made template. Scope, assumptions, and success criteria are written down so both sides know what will be built—and what stays out of scope.

We build in stages; each stage is visible and reviewable. At handover, code, access, and deploy documentation come with the system so your team can keep going.

## Acceptance checklist

- [ ] Intro title/lead match table above (fa + en) in static content and DB/seed.
- [ ] Story title and full body (narrative + two H3 sections) render on `/fa/about` and `/en/about`.
- [ ] Same story HTML visible in `/admin/about` after seed or upsert.
- [ ] No invented stats, clients, dates, or testimonials.
- [ ] Lint / typecheck / build pass after code changes.

## Open questions

- If MongoDB already has a sparse About document, seed must **upsert** (not skip when doc exists), or admin must be updated manually once—confirm preferred path at plan time.
