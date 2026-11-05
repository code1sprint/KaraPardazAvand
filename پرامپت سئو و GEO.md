
هدف: نمایش سایت برای نام شرکت (فارسی و انگلیسی) و برای جستجوهای خدماتی (CRM، ERP، RAG و غیره) در گوگل، Bing و چت‌بات‌ها. این پکیج بخش فنی و ساختاری را پوشش می‌دهد؛ محتوای بیرونی (پروفایل‌ها، مقاله‌های مهمان) جدا انجام می‌شود.

## قبل از شروع باید تصمیم بگیری

| مورد | توضیح |
| --- | --- |
| نام رسمی انگلیسی | پیشنهاد: Kara Pardaz Avand (مطابق دامنه). املای قدیمی Oond فقط اگر لازم است و فقط به‌عنوان نام جایگزین. |
| اطلاعات تماس واقعی | ایمیل، تلفن، آدرس (اختیاری)، ساعت کاری. |
| لینک پروفایل‌های رسمی | LinkedIn، GitHub، Telegram، Instagram، Code1Sprint. |
| سال تاسیس | اختیاری؛ فقط اگر می‌خواهی منتشر شود. |
| سیاست ربات‌های هوش مصنوعی | پیشنهاد: اجازه‌ی کامل خزیدن. |
| دامنه‌ی اصلی | apex (karapardazavand.ir) یا www؛ دیگری با ریدایرکت ۳۰۱. |
| تایید مالکیت | توکن Google Search Console و Bing Webmaster. |
| جمله‌ی تعریف شرکت | فارسی و انگلیسی؛ باید تو تایید کنی (نمونه در فاز S5). |

## طرز استفاده

- فاز S0 را یک بار در AGENTS.md بگذار، سپس فازها را یکی‌یکی بفرست.
- خروجی فاز S1 (گزارش وضعیت فعلی) را پیش از تغییرات بخوان.
- پرامپت‌ها به منبع محتوای فعلی سایت (فایل‌ها یا پنل مدیریت) وابسته نیستند؛ ایجنت از همان استفاده می‌کند.
- بعد از هر انتشار، در Search Console صفحات مهم را URL Inspection کن و درخواست ایندکس بده.

## فاز S0 — قوانین و منبع واحد هویت برند

```
SEO AND GEO RULES (append to AGENTS.md)

CONTEXT
The site https://karapardazavand.ir is live (Next.js App Router, fa default, en secondary). Goals: (1) rank for the company name in Persian and English; (2) rank for service queries: custom CRM, custom ERP, enterprise RAG, data dashboards, web platforms, custom software; (3) be cited correctly by AI chatbots and search assistants.

PRINCIPLES
- One entity. One canonical Persian name and one canonical English name. All other variants appear ONLY in alternateName data, never in visible text or metadata.
- Every fact must be real and visible on the page. Structured data must mirror visible content. Never invent contacts, dates, ratings, reviews, clients, statistics or awards. When data is missing, omit the field and list it in reports/seo-todo.md.
- No keyword stuffing, hidden text, doorway pages or fake reviews. Write for people first: specific, quotable sentences.
- Single source of truth: src/lib/seo/entity.ts (typed, zod-validated). Components never hard-code brand strings.
- Use whatever content source the site uses today (content files or the admin database). Do not migrate it.

ENTITY CONFIG (src/lib/seo/entity.ts)
canonicalName {fa, en}; alternateNames[] (only variants the business confirmed); definition {fa, en} (one factual sentence about the company); url; logo (absolute URL, square and wide variants); parentOrganization {name, url}; sameAs[] (official profile URLs); contact {email, phone, address, hours} with each field optional; foundingDate optional; areaServed; knowsAbout[]; services[] with {slug, name {fa,en}, primaryKeyword {fa,en}}. Values marked TODO_REAL_DATA are treated as absent.

WORKFLOW
Phase by phase: short plan, implement, run lint, typecheck and build, then report files changed, how to verify, acceptance results, open questions. Do not start the next phase.
```

## فاز S1 — ممیزی وضعیت فعلی (قبل از هر تغییر)

```
PHASE S1 - AUDIT (report only, change nothing)
Write scripts/seo-audit.ts (Playwright plus fetch). For every route in the sitemap and in the page map, in fa and en, record:
- HTTP status, redirect chain (including / to /fa, http to https, www to apex, trailing slash behavior)
- title and meta description with their lengths; duplicates across pages
- canonical, hreflang alternates (reciprocal and x-default), meta robots, X-Robots-Tag
- number of H1s, heading outline, first 160 visible characters
- JSON-LD blocks: types, parse errors, @id references, mismatches with visible content
- Open Graph and Twitter tags; OG image URL status
- presence of server-rendered main content (fetch with JavaScript disabled and compare)
- internal links count, orphan pages (in sitemap but unlinked), broken links
- robots.txt and sitemap.xml: contents, coverage versus real routes, noindex pages wrongly included
- brand spelling scan: every occurrence of the brand name in any spelling, in visible text and metadata
- image weight on the home page and the _next/image widths requested for cards
Also request key pages with these user agents and compare status and content size: Googlebot, bingbot, GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot. Differences must be flagged.
Output reports/seo-before.md with a prioritized issue list (critical, important, minor) and reports/seo-todo.md with missing business data.
NOTE: reachability from outside Iran cannot be proven locally; add a manual checklist item (WebPageTest or a foreign VPS) to the report.

ACCEPTANCE
- Report exists, is specific (URL plus problem plus suggested fix) and ends with the list of decisions needed from the business.
```

## فاز S2 — متادیتا، canonical و hreflang

```
PHASE S2 - METADATA SYSTEM
1. Implement a metadata factory (src/lib/seo/metadata.ts) used by every route through generateMetadata: title, description, canonical (absolute, self-referencing), alternates.languages for fa and en plus x-default, openGraph (type, locale fa_IR or en_US, siteName, url, image), twitter card, robots. Set metadataBase.
2. Titles at most 60 characters, descriptions 140 to 160 characters, unique per page. Use templates with an explicit override field in content (seo.title, seo.description). Fallback description comes from the page summary, never from a generic string.
3. Home titles and descriptions:
   fa title: کارا پرداز اوند | توسعه نرم‌افزار سازمانی، CRM، ERP و RAG
   fa description: کارا پرداز اوند: طراحی و توسعه نرم‌افزار سفارشی، CRM و ERP اختصاصی، هوش مصنوعی سازمانی (RAG) و داشبورد داده برای کسب‌وکارها و سازمان‌ها.
   en title: Kara Pardaz Avand | Custom Enterprise Software, CRM, ERP & RAG
   en description: Kara Pardaz Avand designs and builds custom software, bespoke CRM and ERP systems, enterprise RAG AI and data dashboards for businesses.
4. Service pages: title pattern '<primary keyword> | <brand>' with these primary keywords (fa): CRM: ساخت CRM اختصاصی برای سازمان‌ها; ERP: پیاده‌سازی ERP سفارشی; RAG: سیستم RAG سازمانی و چت‌بات روی اسناد; data: داشبورد مدیریتی و علم داده; web: طراحی و توسعه وب‌سایت و پلتفرم سازمانی; custom software: توسعه نرم‌افزار سفارشی سازمانی. Provide English equivalents. Store them in entity.ts services[].primaryKeyword.
5. Posts and projects: title from the content title plus brand suffix when it fits; description from the summary; og:type article for posts with published and modified times.
6. Indexing rules: index and follow for public pages; noindex for /admin, /api, preview, thank-you and search result pages; canonical stripped of query strings except meaningful filters (filtered list pages canonicalize to the unfiltered list).
7. Normalize URLs: / to /fa with a 301 (or serve fa at the root, one of the two, decided in the audit), http to https, www to the chosen host, consistent trailing slash. No redirect chains longer than one hop.
8. Add verification tags through metadata.verification from env: GOOGLE_SITE_VERIFICATION, BING_SITE_VERIFICATION.

ACCEPTANCE
- Every route has unique title and description within the length limits, a self-referencing canonical and reciprocal hreflang; redirects are single-hop; the audit script shows zero critical metadata issues.
```

## فاز S3 — داده‌ی ساختاریافته (JSON-LD)

```
PHASE S3 - STRUCTURED DATA
Build typed helpers (schema-dts or equivalent) in src/lib/seo/jsonld.ts and render JSON-LD on the server via a <JsonLd> component (no client rendering, properly escaped).

NODES (use stable @id values on the site host, for example https://karapardazavand.ir/#organization):
- Organization: name (canonical, per language), alternateName[] from entity.ts, url, logo as ImageObject, description (the definition sentence), sameAs[], parentOrganization (Code1Sprint, with its url), contactPoint and address ONLY when real data exists, areaServed, knowsAbout[]. Referenced by @id everywhere else.
- WebSite: @id, url, name, inLanguage, publisher referencing the Organization.
- WebPage or CollectionPage on every page with isPartOf, inLanguage, breadcrumb.
- BreadcrumbList on all inner pages, matching the visible breadcrumbs.
- Service on each service page: name, description (the answer block), serviceType, provider (Organization @id), areaServed, url.
- Article (BlogPosting) on posts: headline, description, datePublished, dateModified, author (Person or Organization as in the byline), publisher (Organization @id), image, mainEntityOfPage, inLanguage.
- Article for case studies: headline, description, about (the service), datePublished if known.
- FAQPage where an FAQ is visible. (Expect no rich result in most cases; it is for machine readability.)
RULES
- Every value must match visible text. Omit unknown fields; never put placeholders in output.
- No Review, AggregateRating, Offer prices or awards unless real, public data exists.
- fa and en pages each describe themselves in their own language and link to the other through the existing hreflang, not through duplicated nodes.
- Validate every node with zod or schema-dts types at build time; invalid structured data fails the build.

ACCEPTANCE
- Google Rich Results Test and Schema.org validator report no errors on home, one service page, one post, one case study in fa and en; the audit shows each @id resolves to exactly one node.
```

## فاز S4 — خزش، ایندکس و sitemap

```
PHASE S4 - CRAWLING AND INDEXING
1. app/robots.ts: allow all public paths; disallow /admin, /api, preview and internal search; list the sitemap URL. Add a config flag AI_CRAWLERS (allow or block, default allow) that generates explicit rules for GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and CCBot accordingly. Keep the rules readable with comments.
2. app/sitemap.ts: every indexable fa and en URL (home, services, service details, portfolio, case studies, process, about, insights, posts, faq, contact, legal) with alternates (hreflang) and lastModified from the content's real updated date. Exclude noindex pages and drafts. Split into multiple sitemaps if over 5,000 URLs.
3. 404 pages return a real 404 status; removed or unpublished content returns 404 or 410; no soft-404s.
4. Redirect map for slug changes (301) managed in content or the admin; no chains.
5. IndexNow: implement /api/indexnow (protected) and a key file at the site root; ping IndexNow when content is published, updated or unpublished, and as a script for bulk submission. Document how to disable it.
6. Add an RSS feed for posts at /insights/rss.xml (per language) and link it with rel=alternate in the head.
7. Ensure all important content is in the initial server-rendered HTML (no content that appears only after client-side fetching).

ACCEPTANCE
- robots.txt and sitemap.xml validate; the audit shows 100 percent sitemap coverage of indexable routes and no noindex route in the sitemap; AI crawler user agents receive the same 200 content as Googlebot.
```

## فاز S5 — ساختار محتوا برای موتورهای پاسخ‌گو (GEO)

```
PHASE S5 - CONTENT STRUCTURE FOR ANSWER ENGINES
Add structure; do not rewrite the site's voice. All new copy is drafted by you, flagged needs_business_confirmation in the content source, and hidden from production until confirmed.

1. Company definition sentence, one per language, shown on the home page (under the hero or in the about section), on /about and used in the Organization JSON-LD. Draft for confirmation:
   fa: کارا پرداز اوند (Kara Pardaz Avand) یک شرکت توسعه نرم‌افزار سازمانی است که CRM، ERP، سیستم‌های RAG و داشبورد داده را متناسب با فرایند هر سازمان می‌سازد.
   en: Kara Pardaz Avand is an enterprise software company that builds custom CRM, ERP, RAG systems and data dashboards fitted to each organization's processes.
2. AnswerBlock component at the top of every service page: a 40 to 60 word direct definition of the service and who it is for, visually distinct, same text used in the Service schema.
3. Service page outline with a single H1 and clear H2s: what it is, when you need it, custom versus off-the-shelf, how we build it (service-specific steps), what affects cost (factors only, no invented prices), delivered outputs, related case study, FAQ.
4. Posts: TL;DR box at the top (3 bullet sentences), visible author byline and published and updated dates, a sources section where claims need support, related service link and related posts.
5. Case studies: a summary block with problem, solution and measured result (number plus its source), stack, and the service it demonstrates.
6. Facts block on /about: services, technology stack, industries served, languages, relationship to Code1Sprint; only confirmed facts.
7. Internal linking: each service links to its case studies and articles and back; use descriptive anchors matching the primary keyword once per page, never repeated mechanically.
8. Visible breadcrumbs on all inner pages; heading anchors; descriptive alt text on meaningful images (fa and en).

ACCEPTANCE
- Each service page has an AnswerBlock, one H1 and the outline above; every post has TL;DR, byline and dates; the audit reports no page without a link to a related service or case study.
```

## فاز S6 — اطلاعات تماس و نشانه‌های اعتماد

```
PHASE S6 - CONTACT DATA AND TRUST
1. Replace the placeholder text 'contact channels will be published soon' everywhere with real data from the settings source: email, phone, address, working hours, Telegram, WhatsApp, Instagram, LinkedIn, GitHub. Fields without data are hidden, not shown as placeholders.
2. Footer, /contact and /about show the same contact block (one component, one source). Use mailto and tel links; format numbers consistently in fa and en.
3. sameAs links in the footer or about page point to the same profiles listed in entity.ts, with rel=me where supported.
4. Add an optional trust-badge slot (for example the national e-trust badge) controlled by settings; render nothing when empty.
5. Add contactPoint and address to the Organization JSON-LD only when the data is present.

ACCEPTANCE
- No placeholder contact text remains in production; contact data is identical on every page that shows it and matches the JSON-LD.
```

## فاز S7 — کیفیت فنی و عملکرد

```
PHASE S7 - TECHNICAL QUALITY AND PERFORMANCE
- Core Web Vitals targets on mobile: LCP under 2.5s, CLS under 0.1, INP under 200ms on home, a service page, a case study and a post.
- Images: correct sizes attributes so card images do not request 3840px widths; modern formats; explicit dimensions; priority only for the hero image; lazy-load below the fold.
- Fonts: preload the primary weights, font-display swap, size-adjusted fallbacks.
- Remove render-blocking third-party scripts; defer analytics.
- Caching: immutable caching for hashed assets, sensible revalidation for pages, compression enabled.
- Server response (TTFB) measured from at least two regions; report results.
- Verify that every page works and is fully readable with JavaScript disabled for the main content.
- Add Lighthouse CI with budgets to the pipeline.

ACCEPTANCE
- Lighthouse mobile at least 90 for performance and 100 for SEO and best practices on the four key pages; report included in reports/seo-after.md.
```

## فاز S8 — اندازه‌گیری

```
PHASE S8 - MEASUREMENT
1. Wire the verification tags (S2) and document the steps to add the site to Google Search Console and Bing Webmaster Tools, submit the sitemap and request indexing for key URLs.
2. Analytics: keep it privacy-friendly. Classify referrers into channels, including AI assistants (chatgpt.com, perplexity.ai, gemini.google.com, copilot.microsoft.com, claude.ai) as an 'ai-assistant' channel; show it in the existing analytics view or an admin report. Record only aggregate counts, no personal data.
3. Create docs/ai-visibility-check.md: 20 fixed prompts in Persian and English (brand name queries, service queries such as custom CRM, custom ERP, enterprise RAG, dashboards), a results table template (assistant, date, prompt, was the company mentioned, was it cited with a link, accuracy notes), to be run monthly by a human.
4. Optional: generate /llms.txt from the content source (company definition, service list with URLs, key case studies, contact). Make it a build step that can be switched off; do not include unpublished or sensitive data.

ACCEPTANCE
- Verification works in both consoles; AI referrer channel appears in reports; the check document exists and is usable as written.
```

## فاز S9 — تست‌های رگرسیون و گزارش نهایی

```
PHASE S9 - REGRESSION TESTS AND FINAL REPORT
Add automated checks to CI (Playwright or Vitest) that fail on:
- missing or duplicate title or description; lengths out of range; not exactly one H1
- canonical not absolute or not self-referencing; hreflang not reciprocal; missing x-default
- JSON-LD parse errors, schema validation failures, unresolved @id, or values that differ from visible text (brand name, contact data, dates)
- sitemap missing an indexable route, or containing noindex, draft or archived items; robots.txt not matching the AI_CRAWLERS flag
- any brand spelling outside entity.ts (canonical plus confirmed alternates); the scan covers visible text, metadata, JSON-LD and OG images text
- AI and search crawler user agents receiving a different status or much smaller content than a normal browser
- OG image route failing for a long Persian title
Then run the audit again and write reports/seo-after.md: before and after table, remaining items, manual steps for the team (Search Console and Bing submission, URL Inspection of 10 key URLs, Rich Results Test, foreign-network reachability test, first run of the AI visibility check).

ACCEPTANCE
- CI is green; the after-report shows no critical issues; the manual checklist is complete and assigned.
```

## نکات پایانی

- اگر ایجنت جمله‌ها یا ادعاهای جدید نوشت، قبل از انتشار خودت تایید یا بازنویسی کن؛ ادعای بدون پشتوانه هم برای کاربر و هم برای چت‌بات‌ها آسیب‌زاست.
- این پکیج تضمین رتبه نمی‌دهد؛ پایه‌ی فنی را درست می‌کند. اثر اصلی بر جستجوهای خدماتی از محتوای عمیق و ذکر شدن در منابع بیرونی می‌آید.
- بعد از هر مرحله‌ی انتشار، چند روز صبر کن و در Search Console وضعیت ایندکس و خطاها را ببین.
