# Vertical Rhythm & Spacing Audit Report (Baseline: BEFORE)

Generated: 2026-11-04T18:00:51.476Z
Base URL: http://localhost:3000
Locales: fa, en
Viewports: 1440px (desktop), 1024px (desktop small), 768px (tablet), 390px (mobile)

---

## 1. Summary of Spacing Status

1. Consecutive plain sections exhibit doubled gaps (140px-260px) due to stacked padding-block.
2. Inconsistent section-to-band transitions (20px to 220px).
3. Non-standard container widths in FAQ and inner sections causing heading indentation shifts.
4. Duplicate back-to-back CTAs on /about, /process, /faq, /portfolio/[slug], /services/[slug], /insights/[slug].
5. /contact renders both the contact form and the global footer CTA band.

---

## 2. Visual Gaps Table (Sorted by Size Descending)

| Locale | Viewport | Route | From Section | To Section | Gap Type | Measured Visual Gap (px) |
|---|---|---|---|---|---|---|
| `fa` | `desktop-1440` | `/about` | `about-soft-cta` | `footer-5` | `content-to-footer` | **293px** |
| `fa` | `desktop-1024` | `/about` | `about-soft-cta` | `footer-5` | `content-to-footer` | **293px** |
| `fa` | `desktop-1440` | `/faq` | `faq-soft-cta` | `footer-3` | `content-to-footer` | **293px** |
| `fa` | `desktop-1024` | `/faq` | `faq-soft-cta` | `footer-3` | `content-to-footer` | **293px** |
| `fa` | `desktop-1440` | `/insights/crm-fit` | `insights-soft-cta` | `footer-3` | `content-to-footer` | **293px** |
| `fa` | `desktop-1024` | `/insights/crm-fit` | `insights-soft-cta` | `footer-3` | `content-to-footer` | **293px** |
| `en` | `desktop-1440` | `/about` | `about-soft-cta` | `footer-5` | `content-to-footer` | **293px** |
| `en` | `desktop-1024` | `/about` | `about-soft-cta` | `footer-5` | `content-to-footer` | **293px** |
| `en` | `desktop-1440` | `/faq` | `faq-soft-cta` | `footer-3` | `content-to-footer` | **293px** |
| `en` | `desktop-1024` | `/faq` | `faq-soft-cta` | `footer-3` | `content-to-footer` | **293px** |
| `en` | `desktop-1440` | `/insights/crm-fit` | `insights-soft-cta` | `footer-3` | `content-to-footer` | **293px** |
| `en` | `desktop-1024` | `/insights/crm-fit` | `insights-soft-cta` | `footer-3` | `content-to-footer` | **293px** |
| `fa` | `desktop-1440` | `/` | `insights` | `faq` | `plain-to-plain` | **261px** |
| `fa` | `desktop-1440` | `/` | `faq` | `footer-7` | `content-to-footer` | **261px** |
| `fa` | `desktop-1024` | `/` | `insights` | `faq` | `plain-to-plain` | **261px** |
| `fa` | `desktop-1024` | `/` | `faq` | `footer-7` | `content-to-footer` | **261px** |
| `en` | `desktop-1440` | `/` | `insights` | `faq` | `plain-to-plain` | **261px** |
| `en` | `desktop-1440` | `/` | `faq` | `footer-7` | `content-to-footer` | **261px** |
| `en` | `desktop-1024` | `/` | `insights` | `faq` | `plain-to-plain` | **261px** |
| `en` | `desktop-1024` | `/` | `faq` | `footer-7` | `content-to-footer` | **261px** |
| `fa` | `desktop-1440` | `/contact` | `contact-form-heading` | `footer-2` | `content-to-footer` | **260px** |
| `fa` | `desktop-1024` | `/contact` | `contact-form-heading` | `footer-2` | `content-to-footer` | **260px** |
| `en` | `desktop-1440` | `/contact` | `contact-form-heading` | `footer-2` | `content-to-footer` | **260px** |
| `en` | `desktop-1024` | `/contact` | `contact-form-heading` | `footer-2` | `content-to-footer` | **260px** |
| `en` | `desktop-1440` | `/` | `portfolio` | `process` | `plain-to-plain` | **258px** |
| `fa` | `desktop-1440` | `/` | `portfolio` | `process` | `plain-to-plain` | **257px** |
| `fa` | `desktop-1440` | `/` | `process` | `insights` | `plain-to-plain` | **253px** |
| `fa` | `desktop-1024` | `/` | `process` | `insights` | `plain-to-plain` | **253px** |
| `en` | `desktop-1440` | `/` | `process` | `insights` | `plain-to-plain` | **253px** |
| `en` | `desktop-1024` | `/` | `process` | `insights` | `plain-to-plain` | **253px** |
| `fa` | `desktop-1440` | `/services` | `div-0` | `footer-1` | `content-to-footer` | **247px** |
| `fa` | `desktop-1024` | `/services` | `div-0` | `footer-1` | `content-to-footer` | **247px** |
| `fa` | `desktop-1440` | `/services/crm` | `div-0` | `footer-1` | `content-to-footer` | **247px** |
| `fa` | `desktop-1024` | `/services/crm` | `div-0` | `footer-1` | `content-to-footer` | **247px** |
| `en` | `desktop-1440` | `/services` | `div-0` | `footer-1` | `content-to-footer` | **247px** |
| `en` | `desktop-1024` | `/services` | `div-0` | `footer-1` | `content-to-footer` | **247px** |
| `en` | `desktop-1440` | `/services/crm` | `div-0` | `footer-1` | `content-to-footer` | **247px** |
| `en` | `desktop-1024` | `/services/crm` | `div-0` | `footer-1` | `content-to-footer` | **247px** |
| `fa` | `desktop-1440` | `/insights` | `div-0` | `footer-1` | `content-to-footer` | **239px** |
| `fa` | `desktop-1024` | `/insights` | `div-0` | `footer-1` | `content-to-footer` | **239px** |
| `fa` | `desktop-1024` | `/` | `portfolio` | `process` | `plain-to-plain` | **236px** |
| `fa` | `desktop-1440` | `/about` | `brands` | `culture` | `plain-to-plain` | **236px** |
| `fa` | `desktop-1024` | `/about` | `brands` | `culture` | `plain-to-plain` | **236px** |
| `en` | `desktop-1024` | `/` | `portfolio` | `process` | `plain-to-plain` | **236px** |
| `en` | `desktop-1440` | `/about` | `brands` | `culture` | `plain-to-plain` | **236px** |
| `en` | `desktop-1024` | `/about` | `brands` | `culture` | `plain-to-plain` | **236px** |
| `fa` | `desktop-1440` | `/terms` | `div-0` | `footer-1` | `content-to-footer` | **222px** |
| `fa` | `desktop-1024` | `/terms` | `div-0` | `footer-1` | `content-to-footer` | **222px** |
| `fa` | `desktop-1440` | `/privacy` | `div-0` | `footer-1` | `content-to-footer` | **222px** |
| `fa` | `desktop-1024` | `/privacy` | `div-0` | `footer-1` | `content-to-footer` | **222px** |
| `en` | `desktop-1440` | `/terms` | `div-0` | `footer-1` | `content-to-footer` | **222px** |
| `en` | `desktop-1024` | `/terms` | `div-0` | `footer-1` | `content-to-footer` | **222px** |
| `en` | `desktop-1440` | `/privacy` | `div-0` | `footer-1` | `content-to-footer` | **222px** |
| `en` | `desktop-1024` | `/privacy` | `div-0` | `footer-1` | `content-to-footer` | **222px** |
| `fa` | `desktop-1440` | `/process` | `div-0` | `footer-1` | `content-to-footer` | **215px** |
| `fa` | `desktop-1024` | `/process` | `div-0` | `footer-1` | `content-to-footer` | **215px** |
| `en` | `desktop-1440` | `/process` | `div-0` | `footer-1` | `content-to-footer` | **215px** |
| `en` | `desktop-1024` | `/process` | `div-0` | `footer-1` | `content-to-footer` | **215px** |
| `fa` | `desktop-1440` | `/portfolio` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `fa` | `desktop-1024` | `/portfolio` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `fa` | `desktop-1440` | `/portfolio/ops-crm-pilot` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `fa` | `desktop-1024` | `/portfolio/ops-crm-pilot` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `en` | `desktop-1440` | `/portfolio` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `en` | `desktop-1024` | `/portfolio` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `en` | `desktop-1440` | `/portfolio/ops-crm-pilot` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `en` | `desktop-1024` | `/portfolio/ops-crm-pilot` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `en` | `desktop-1440` | `/insights` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `en` | `desktop-1024` | `/insights` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `en` | `tablet-768` | `/terms` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `en` | `tablet-768` | `/privacy` | `div-0` | `footer-1` | `content-to-footer` | **214px** |
| `fa` | `tablet-768` | `/about` | `about-soft-cta` | `footer-5` | `content-to-footer` | **207px** |
| `fa` | `tablet-768` | `/faq` | `faq-soft-cta` | `footer-3` | `content-to-footer` | **207px** |
| `fa` | `tablet-768` | `/insights/crm-fit` | `insights-soft-cta` | `footer-3` | `content-to-footer` | **207px** |
| `en` | `tablet-768` | `/about` | `about-soft-cta` | `footer-5` | `content-to-footer` | **207px** |
| `en` | `tablet-768` | `/faq` | `faq-soft-cta` | `footer-3` | `content-to-footer` | **207px** |
| `en` | `tablet-768` | `/insights/crm-fit` | `insights-soft-cta` | `footer-3` | `content-to-footer` | **207px** |
| `fa` | `tablet-768` | `/contact` | `contact-form-heading` | `footer-2` | `content-to-footer` | **203px** |
| `en` | `tablet-768` | `/contact` | `contact-form-heading` | `footer-2` | `content-to-footer` | **203px** |
| `fa` | `tablet-768` | `/services` | `div-0` | `footer-1` | `content-to-footer` | **199px** |
| `fa` | `tablet-768` | `/services/crm` | `div-0` | `footer-1` | `content-to-footer` | **199px** |
| `en` | `tablet-768` | `/services` | `div-0` | `footer-1` | `content-to-footer` | **199px** |
| `en` | `tablet-768` | `/services/crm` | `div-0` | `footer-1` | `content-to-footer` | **199px** |
| `fa` | `mobile-390` | `/about` | `about-soft-cta` | `footer-5` | `content-to-footer` | **191px** |
| `fa` | `mobile-390` | `/faq` | `faq-soft-cta` | `footer-3` | `content-to-footer` | **191px** |
| `fa` | `tablet-768` | `/insights` | `div-0` | `footer-1` | `content-to-footer` | **191px** |
| `fa` | `mobile-390` | `/insights/crm-fit` | `insights-soft-cta` | `footer-3` | `content-to-footer` | **191px** |
| `en` | `mobile-390` | `/about` | `about-soft-cta` | `footer-5` | `content-to-footer` | **191px** |
| `en` | `mobile-390` | `/faq` | `faq-soft-cta` | `footer-3` | `content-to-footer` | **191px** |
| `en` | `mobile-390` | `/insights/crm-fit` | `insights-soft-cta` | `footer-3` | `content-to-footer` | **191px** |
| `fa` | `mobile-390` | `/contact` | `contact-form-heading` | `footer-2` | `content-to-footer` | **187px** |
| `en` | `mobile-390` | `/contact` | `contact-form-heading` | `footer-2` | `content-to-footer` | **187px** |
| `fa` | `tablet-768` | `/` | `insights` | `faq` | `plain-to-plain` | **185px** |
| `fa` | `mobile-390` | `/` | `insights` | `faq` | `plain-to-plain` | **185px** |
| `en` | `tablet-768` | `/` | `insights` | `faq` | `plain-to-plain` | **185px** |
| `en` | `mobile-390` | `/` | `insights` | `faq` | `plain-to-plain` | **185px** |
| `en` | `mobile-390` | `/terms` | `div-0` | `footer-1` | `content-to-footer` | **182px** |
| `en` | `mobile-390` | `/privacy` | `div-0` | `footer-1` | `content-to-footer` | **182px** |
| `fa` | `tablet-768` | `/` | `process` | `insights` | `plain-to-plain` | **177px** |
| `en` | `tablet-768` | `/` | `process` | `insights` | `plain-to-plain` | **177px** |
| `fa` | `tablet-768` | `/` | `faq` | `footer-7` | `content-to-footer` | **175px** |

*(Total measured transitions: 224)*

---

## 3. Container Alignment & Width Deviations

The standard container expects `max-width: 1180px` (or `viewportWidth - 48px` when smaller).

| Locale | Viewport | Route | Section | Measured Width | Standard Width | Container Classes |
|---|---|---|---|---|---|---|
| `fa` | `desktop-1024` | `/` | `hero-heading` | 1024px | 976px | `mx-auto w-full px-6 max-w-[var(--contain` |
| `fa` | `desktop-1024` | `/` | `services` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/` | `why` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/` | `portfolio` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/` | `process` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/` | `insights` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/` | `hero-heading` | 768px | 720px | `mx-auto w-full px-6 max-w-[var(--contain` |
| `fa` | `tablet-768` | `/` | `services` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/` | `why` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/` | `portfolio` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/` | `process` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/` | `insights` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/` | `hero-heading` | 390px | 342px | `mx-auto w-full px-6 max-w-[var(--contain` |
| `fa` | `mobile-390` | `/` | `services` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/` | `why` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/` | `portfolio` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/` | `process` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/` | `insights` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/about` | `about-hero-heading` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/about` | `principles` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/about` | `brands` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/about` | `culture` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/about` | `about-soft-cta` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/about` | `about-hero-heading` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/about` | `principles` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/about` | `brands` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/about` | `culture` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/about` | `about-soft-cta` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/about` | `about-hero-heading` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/about` | `principles` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/about` | `brands` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/about` | `culture` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/about` | `about-soft-cta` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/services` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/services` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/services` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/services/crm` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/services/crm` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/services/crm` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/portfolio` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/portfolio` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/portfolio` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/portfolio/ops-crm-pilot` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/portfolio/ops-crm-pilot` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/portfolio/ops-crm-pilot` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/process` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/process` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/process` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/faq` | `faq-hero-heading` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/faq` | `faq-list-heading` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/faq` | `faq-soft-cta` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/faq` | `faq-hero-heading` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/faq` | `faq-list-heading` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/faq` | `faq-soft-cta` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/faq` | `faq-hero-heading` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/faq` | `faq-list-heading` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/faq` | `faq-soft-cta` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/contact` | `contact-hero-heading` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/contact` | `contact-form-heading` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/contact` | `contact-hero-heading` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/contact` | `contact-form-heading` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/contact` | `contact-hero-heading` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/contact` | `contact-form-heading` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/insights` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/insights` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/insights` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1440` | `/insights/crm-fit` | `div-0` | 1440px | 1180px | `pointer-events-none fixed inset-x-0 top-` |
| `fa` | `desktop-1024` | `/insights/crm-fit` | `div-0` | 1024px | 976px | `pointer-events-none fixed inset-x-0 top-` |
| `fa` | `desktop-1024` | `/insights/crm-fit` | `div-1` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/insights/crm-fit` | `insights-soft-cta` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/insights/crm-fit` | `div-0` | 768px | 720px | `pointer-events-none fixed inset-x-0 top-` |
| `fa` | `tablet-768` | `/insights/crm-fit` | `div-1` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/insights/crm-fit` | `insights-soft-cta` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/insights/crm-fit` | `div-0` | 390px | 342px | `pointer-events-none fixed inset-x-0 top-` |
| `fa` | `mobile-390` | `/insights/crm-fit` | `div-1` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/insights/crm-fit` | `insights-soft-cta` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/terms` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/terms` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/terms` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `desktop-1024` | `/privacy` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `tablet-768` | `/privacy` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `fa` | `mobile-390` | `/privacy` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/` | `hero-heading` | 1024px | 976px | `mx-auto w-full px-6 max-w-[var(--contain` |
| `en` | `desktop-1024` | `/` | `services` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/` | `why` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/` | `portfolio` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/` | `process` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/` | `insights` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/` | `hero-heading` | 768px | 720px | `mx-auto w-full px-6 max-w-[var(--contain` |
| `en` | `tablet-768` | `/` | `services` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/` | `why` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/` | `portfolio` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/` | `process` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/` | `insights` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/` | `hero-heading` | 390px | 342px | `mx-auto w-full px-6 max-w-[var(--contain` |
| `en` | `mobile-390` | `/` | `services` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/` | `why` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/` | `portfolio` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/` | `process` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/` | `insights` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/about` | `about-hero-heading` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/about` | `principles` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/about` | `brands` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/about` | `culture` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/about` | `about-soft-cta` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/about` | `about-hero-heading` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/about` | `principles` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/about` | `brands` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/about` | `culture` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/about` | `about-soft-cta` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/about` | `about-hero-heading` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/about` | `principles` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/about` | `brands` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/about` | `culture` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/about` | `about-soft-cta` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/services` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/services` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/services` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/services/crm` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/services/crm` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/services/crm` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/portfolio` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/portfolio` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/portfolio` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/portfolio/ops-crm-pilot` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/portfolio/ops-crm-pilot` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/portfolio/ops-crm-pilot` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/process` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/process` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/process` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/faq` | `faq-hero-heading` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/faq` | `faq-list-heading` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/faq` | `faq-soft-cta` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/faq` | `faq-hero-heading` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/faq` | `faq-list-heading` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/faq` | `faq-soft-cta` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/faq` | `faq-hero-heading` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/faq` | `faq-list-heading` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/faq` | `faq-soft-cta` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/contact` | `contact-hero-heading` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/contact` | `contact-form-heading` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/contact` | `contact-hero-heading` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/contact` | `contact-form-heading` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/contact` | `contact-hero-heading` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/contact` | `contact-form-heading` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/insights` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/insights` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/insights` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1440` | `/insights/crm-fit` | `div-0` | 1440px | 1180px | `pointer-events-none fixed inset-x-0 top-` |
| `en` | `desktop-1024` | `/insights/crm-fit` | `div-0` | 1024px | 976px | `pointer-events-none fixed inset-x-0 top-` |
| `en` | `desktop-1024` | `/insights/crm-fit` | `div-1` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/insights/crm-fit` | `insights-soft-cta` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/insights/crm-fit` | `div-0` | 768px | 720px | `pointer-events-none fixed inset-x-0 top-` |
| `en` | `tablet-768` | `/insights/crm-fit` | `div-1` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/insights/crm-fit` | `insights-soft-cta` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/insights/crm-fit` | `div-0` | 390px | 342px | `pointer-events-none fixed inset-x-0 top-` |
| `en` | `mobile-390` | `/insights/crm-fit` | `div-1` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/insights/crm-fit` | `insights-soft-cta` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/terms` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/terms` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/terms` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `desktop-1024` | `/privacy` | `div-0` | 1024px | 976px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `tablet-768` | `/privacy` | `div-0` | 768px | 720px | `relative mx-auto w-full px-6 max-w-[var(` |
| `en` | `mobile-390` | `/privacy` | `div-0` | 390px | 342px | `relative mx-auto w-full px-6 max-w-[var(` |

---

## 4. Elements Adding Empty Space (Min-Height / Large Padding / Fixed Height)

- **/** (`services`): `article.relative` &rarr; min-height: 300px
- **/** (`services`): `article.relative` &rarr; min-height: 280px
- **/about** (`brands`): `div.flex` &rarr; min-height: 140px
- **/services** (`div-0`): `article.relative` &rarr; min-height: 300px
- **/services** (`div-0`): `article.relative` &rarr; min-height: 280px
- **/services/crm** (`div-0`): `article.relative` &rarr; min-height: 180px
- **/process** (`div-0`): `article.relative` &rarr; min-height: 220px

---

## 5. Detailed Route-by-Route Breakdown (Sample Viewport 1440px fa & en)

### / [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `hero-heading` | `section` | No | `74px / 40px` | 300px | "سیستم‌هایی که کار سازمان شما ر" | 1180px |
| `services` | `section` | No | `110px / 110px` | 154px | "هر سیستم، با نتیجه‌ی مشخص" | 1180px |
| `why` | `section` | ✅ Yes | `112px / 112px` | 154px | "سه اصل که مسیر کار را شفاف نگه" | 1180px |
| `portfolio` | `section` | No | `110px / 110px` | 154px | "کارهایی که مسیر مسئله را روشن " | 1180px |
| `process` | `section` | No | `110px / 110px` | 154px | "از تحلیل تا پشتیبانی، مرحله‌به" | 1180px |
| `insights` | `section` | No | `110px / 110px` | 154px | "آخرین نوشته‌ها" | 1180px |
| `faq` | `section` | No | `110px / 110px` | 360px | "سوالات متداول" | 768px |
| `footer-7` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `hero-heading` &rarr; `services` (plain-to-plain): **166px**
- `services` &rarr; `why` (plain-to-band): **134px**
- `why` &rarr; `portfolio` (band-to-plain): **126px**
- `portfolio` &rarr; `process` (plain-to-plain): **257px**
- `process` &rarr; `insights` (plain-to-plain): **253px**
- `insights` &rarr; `faq` (plain-to-plain): **261px**
- `faq` &rarr; `footer-7` (content-to-footer): **261px**

### /about [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `about-hero-heading` | `section` | No | `64px / 0px` | 154px | "نرم‌افزاری می‌سازیم که با کار " | 1180px |
| `principles` | `section` | ✅ Yes | `112px / 112px` | 154px | "چطور کار می‌کنیم" | 1180px |
| `brands` | `section` | No | `110px / 110px` | 154px | "دو برند، یک تیم" | 1180px |
| `culture` | `section` | No | `110px / 110px` | 154px | "اصول کاری مهندسی" | 1180px |
| `about-soft-cta` | `section` | No | `0px / 110px` | 187px | "گفت‌وگو را شروع کنیم؟" | 1180px |
| `footer-5` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `about-hero-heading` &rarr; `principles` (plain-to-band): **8px**
- `principles` &rarr; `brands` (band-to-plain): **126px**
- `brands` &rarr; `culture` (plain-to-plain): **236px**
- `culture` &rarr; `about-soft-cta` (plain-to-plain): **143px**
- `about-soft-cta` &rarr; `footer-5` (content-to-footer): **293px**

### /services [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "خدمات کارا پرداز اوند" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **247px**

### /services/crm [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `0px / 0px` | 154px | "CRM" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **247px**

### /portfolio [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "نمونه‌کارها" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **214px**

### /portfolio/ops-crm-pilot [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "نمونه — پایلوت CRM عملیات فروش" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **214px**

### /process [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `0px / 0px` | 154px | "فرایند همکاری؛ از تحلیل نیاز ت" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **215px**

### /faq [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `faq-hero-heading` | `section` | No | `64px / 0px` | 154px | "سوالات متداول" | 1180px |
| `faq-list-heading` | `section` | No | `48px / 110px` | 153px | "فهرست پرسش‌ها" | 1180px |
| `faq-soft-cta` | `section` | No | `0px / 110px` | 187px | "پاسخ موردنظرتان را پیدا نکردید" | 1180px |
| `footer-3` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `faq-hero-heading` &rarr; `faq-list-heading` (plain-to-plain): **48px**
- `faq-list-heading` &rarr; `faq-soft-cta` (plain-to-plain): **144px**
- `faq-soft-cta` &rarr; `footer-3` (content-to-footer): **293px**

### /contact [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `contact-hero-heading` | `section` | No | `64px / 0px` | 154px | "بیایید شروع کنیم" | 1180px |
| `contact-form-heading` | `section` | No | `48px / 110px` | 154px | "ارسال پیام" | 1180px |
| `footer-2` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `contact-hero-heading` &rarr; `contact-form-heading` (plain-to-plain): **48px**
- `contact-form-heading` &rarr; `footer-2` (content-to-footer): **260px**

### /insights [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "مقالات" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **239px**

### /insights/crm-fit [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `0px / 0px` | -px | - | 1440px |
| `div-1` | `div` | No | `64px / 64px` | 154px | "CRM سفارشی یا آماده؛ معیار انت" | 1180px |
| `insights-soft-cta` | `section` | No | `0px / 110px` | 187px | "موضوع مشابهی در سازمان شما هست" | 1180px |
| `footer-3` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `div-1` (plain-to-plain): **136px**
- `div-1` &rarr; `insights-soft-cta` (plain-to-plain): **118px**
- `insights-soft-cta` &rarr; `footer-3` (content-to-footer): **293px**

### /terms [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "شرایط استفاده" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **222px**

### /privacy [FA]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "حریم خصوصی" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "بیایید سیستم بعدی سازمان شما ر" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **222px**

### / [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `hero-heading` | `section` | No | `102px / 40px` | 300px | "Systems that move your organiz" | 1180px |
| `services` | `section` | No | `110px / 110px` | 154px | "Every system, with a clear out" | 1180px |
| `why` | `section` | ✅ Yes | `112px / 112px` | 154px | "Three principles that keep the" | 1180px |
| `portfolio` | `section` | No | `110px / 110px` | 154px | "Work that clarifies the proble" | 1180px |
| `process` | `section` | No | `110px / 110px` | 154px | "From analysis to support, step" | 1180px |
| `insights` | `section` | No | `110px / 110px` | 154px | "Latest writing" | 1180px |
| `faq` | `section` | No | `110px / 110px` | 360px | "FAQ" | 768px |
| `footer-7` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `hero-heading` &rarr; `services` (plain-to-plain): **166px**
- `services` &rarr; `why` (plain-to-band): **134px**
- `why` &rarr; `portfolio` (band-to-plain): **126px**
- `portfolio` &rarr; `process` (plain-to-plain): **258px**
- `process` &rarr; `insights` (plain-to-plain): **253px**
- `insights` &rarr; `faq` (plain-to-plain): **261px**
- `faq` &rarr; `footer-7` (content-to-footer): **261px**

### /about [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `about-hero-heading` | `section` | No | `64px / 0px` | 154px | "We build software that fits ho" | 1180px |
| `principles` | `section` | ✅ Yes | `112px / 112px` | 154px | "How we work" | 1180px |
| `brands` | `section` | No | `110px / 110px` | 154px | "Two brands, one team" | 1180px |
| `culture` | `section` | No | `110px / 110px` | 154px | "Engineering working principles" | 1180px |
| `about-soft-cta` | `section` | No | `0px / 110px` | 187px | "Shall we start a conversation?" | 1180px |
| `footer-5` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `about-hero-heading` &rarr; `principles` (plain-to-band): **8px**
- `principles` &rarr; `brands` (band-to-plain): **126px**
- `brands` &rarr; `culture` (plain-to-plain): **236px**
- `culture` &rarr; `about-soft-cta` (plain-to-plain): **143px**
- `about-soft-cta` &rarr; `footer-5` (content-to-footer): **293px**

### /services [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "Kara Pardaz Oond services" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **247px**

### /services/crm [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `0px / 0px` | 154px | "CRM" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **247px**

### /portfolio [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "Work" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **214px**

### /portfolio/ops-crm-pilot [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "نمونه — پایلوت CRM عملیات فروش" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **214px**

### /process [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `0px / 0px` | 154px | "Collaboration process; from ne" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **215px**

### /faq [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `faq-hero-heading` | `section` | No | `64px / 0px` | 154px | "Frequently asked" | 1180px |
| `faq-list-heading` | `section` | No | `48px / 110px` | 153px | "Question list" | 1180px |
| `faq-soft-cta` | `section` | No | `0px / 110px` | 187px | "Didn’t find your answer?" | 1180px |
| `footer-3` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `faq-hero-heading` &rarr; `faq-list-heading` (plain-to-plain): **48px**
- `faq-list-heading` &rarr; `faq-soft-cta` (plain-to-plain): **144px**
- `faq-soft-cta` &rarr; `footer-3` (content-to-footer): **293px**

### /contact [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `contact-hero-heading` | `section` | No | `64px / 0px` | 154px | "Let’s get started" | 1180px |
| `contact-form-heading` | `section` | No | `48px / 110px` | 154px | "Send a message" | 1180px |
| `footer-2` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `contact-hero-heading` &rarr; `contact-form-heading` (plain-to-plain): **48px**
- `contact-form-heading` &rarr; `footer-2` (content-to-footer): **260px**

### /insights [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "Insights" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **214px**

### /insights/crm-fit [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `0px / 0px` | -px | - | 1440px |
| `div-1` | `div` | No | `64px / 64px` | 154px | "CRM سفارشی یا آماده؛ معیار انت" | 1180px |
| `insights-soft-cta` | `section` | No | `0px / 110px` | 187px | "Working on something similar?" | 1180px |
| `footer-3` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `div-1` (plain-to-plain): **136px**
- `div-1` &rarr; `insights-soft-cta` (plain-to-plain): **118px**
- `insights-soft-cta` &rarr; `footer-3` (content-to-footer): **293px**

### /terms [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "Terms of Service" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **222px**

### /privacy [EN]

| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |
|---|---|---|---|---|---|---|
| `div-0` | `div` | No | `64px / 64px` | 154px | "Privacy Policy" | 1180px |
| `footer-1` | `footer` | No | `0px / 0px` | 410px | "Let’s build your organization’" | 1180px |

**Gaps on this page:**

- `div-0` &rarr; `footer-1` (content-to-footer): **222px**

