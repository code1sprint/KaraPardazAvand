# CMS SEO sync — Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax.

**Goal:** When About (then Services) content is saved in admin, page `<title>` / meta description follow CMS data instead of only static `seo-meta` / messages.

**Architecture:** Optional `seo.{title,description}` on About/Service docs; resolve as `seo || intro/outcome`; `createPageMetadata({ preferCms: true })` skips static `seo-meta` override when CMS values are provided. Admin SEO tab with auto-fill from intro/outcome on save when SEO fields empty.

**Tech Stack:** Next.js App Router Metadata, Mongo/Mongoose, Zod, AboutForm / ServiceForm.

## Tasks

1. Metadata helper: `preferCms` in `createPageMetadata`
2. About: model + validation + API + form SEO + page metadata
3. Services: model + validation + API + form SEO + detail `generateMetadata` from DB
4. Lint / typecheck
