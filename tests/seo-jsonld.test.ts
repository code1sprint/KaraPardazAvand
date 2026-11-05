import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildServiceJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  serializeJsonLd,
} from "../src/lib/seo/jsonld";

test("buildOrganizationJsonLd outputs compliant Schema.org Organization with stable @id", () => {
  const orgFa = buildOrganizationJsonLd("fa");
  assert.equal(orgFa["@type"], "Organization");
  assert.equal(orgFa["@id"], "https://karapardazavand.ir/#organization");
  assert.equal(orgFa.name, "کارا پرداز اوند");
  assert.ok(orgFa.alternateName?.includes("Kara Pardaz Oond"));
  assert.equal(orgFa.url, "https://karapardazavand.ir");
  assert.equal(orgFa.parentOrganization?.name, "Code1Sprint");
  assert.equal(orgFa.parentOrganization?.url, "https://code1sprint.com");
  // Omitted because no real phone/email confirmed yet
  assert.equal(orgFa.contactPoint, undefined);
  assert.equal(orgFa.address, undefined);

  const orgEn = buildOrganizationJsonLd("en");
  assert.equal(orgEn.name, "Kara Pardaz Avand");
});

test("buildWebSiteJsonLd links to Organization publisher via @id", () => {
  const site = buildWebSiteJsonLd("fa");
  assert.equal(site["@type"], "WebSite");
  assert.equal(site["@id"], "https://karapardazavand.ir/#website");
  assert.equal(site.publisher?.["@id"], "https://karapardazavand.ir/#organization");
  assert.equal(site.inLanguage, "fa-IR");
});

test("buildServiceJsonLd links provider to Organization @id", () => {
  const service = buildServiceJsonLd({
    locale: "fa",
    slug: "crm",
    name: "ساخت CRM اختصاصی برای سازمان‌ها",
    description: "توسعه سامانه‌های سفارشی CRM متناسب با فرایندهای سازمان.",
    url: "https://karapardazavand.ir/fa/services/crm",
  });

  assert.equal(service["@type"], "Service");
  assert.equal(service.name, "ساخت CRM اختصاصی برای سازمان‌ها");
  assert.equal(service.provider?.["@id"], "https://karapardazavand.ir/#organization");
  assert.equal(service.url, "https://karapardazavand.ir/fa/services/crm");
});

test("buildArticleJsonLd builds BlogPosting with publisher @id and dates", () => {
  const article = buildArticleJsonLd({
    locale: "fa",
    path: "/insights/crm-fit",
    headline: "انتخاب CRM مناسب سازمان",
    description: "چگونه برای سازمان سیستم CRM اختصاصی انتخاب کنیم.",
    datePublished: "2026-01-10T10:00:00Z",
    dateModified: "2026-02-15T12:00:00Z",
    authorName: "تیم فنی کارا پرداز اوند",
  });

  assert.equal(article["@type"], "BlogPosting");
  assert.equal(article.headline, "انتخاب CRM مناسب سازمان");
  assert.equal(article.publisher?.["@id"], "https://karapardazavand.ir/#organization");
  assert.equal(article.datePublished, "2026-01-10T10:00:00Z");
  assert.equal(article.dateModified, "2026-02-15T12:00:00Z");
});

test("buildBreadcrumbJsonLd and buildFaqJsonLd structure schemas correctly", () => {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "خانه", url: "https://karapardazavand.ir/fa" },
    { name: "خدمات", url: "https://karapardazavand.ir/fa/services" },
    { name: "CRM", url: "https://karapardazavand.ir/fa/services/crm" },
  ]);
  assert.equal(breadcrumb["@type"], "BreadcrumbList");
  assert.equal(breadcrumb.itemListElement.length, 3);
  assert.equal(breadcrumb.itemListElement[1].position, 2);

  const faq = buildFaqJsonLd([
    { question: "آیا سورس کد تحویل داده می‌شود؟", answer: "بله، مالکیت ۱۰۰٪ سورس‌کد به مشتری منتقل می‌شود." },
  ]);
  assert.equal(faq["@type"], "FAQPage");
  assert.equal(faq.mainEntity.length, 1);
  assert.equal(faq.mainEntity[0].name, "آیا سورس کد تحویل داده می‌شود؟");
});

test("serializeJsonLd safely escapes HTML characters to prevent XSS", () => {
  const raw = { name: "</script><script>alert('xss')</script>" };
  const serialized = serializeJsonLd(raw);
  assert.ok(!serialized.includes("</script>"));
  assert.ok(serialized.includes("\\u003c/script\\u003e"));
});
