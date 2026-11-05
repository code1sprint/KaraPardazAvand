import assert from "node:assert/strict";
import { test } from "node:test";
import { entityConfig, EntitySchema } from "../src/lib/seo/entity";
import {
  createPageMetadata,
  formatMetaTitle,
  clampDescription,
  HOME_METADATA,
} from "../src/lib/seo/metadata";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildServiceJsonLd,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  serializeJsonLd,
  ORGANIZATION_ID,
  WEBSITE_ID,
} from "../src/lib/seo/jsonld";
import robots, { getAiCrawlerRules } from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import { classifyReferrer } from "../src/lib/analytics";

test("REGRESSION: Brand Entity & Spelled Variants Invariants", () => {
  const parsed = EntitySchema.parse(entityConfig);
  assert.equal(parsed.canonicalName.fa, "کارا پرداز اوند");
  assert.equal(parsed.canonicalName.en, "Kara Pardaz Avand");
  assert.equal(parsed.parentOrganization.name, "Code1Sprint");

  // Verified services must exist
  assert.equal(parsed.services.length, 6);
  for (const s of parsed.services) {
    assert.ok(s.primaryKeyword.fa.length > 5);
    assert.ok(s.primaryKeyword.en.length > 5);
  }
});

test("REGRESSION: Metadata Constraints (Length, Canonical, Hreflang)", () => {
  // Home meta
  const homeFa = createPageMetadata({ locale: "fa", path: "/", isHome: true });
  const homeFaTitle = typeof homeFa.title === "string" ? homeFa.title : (homeFa.title as any)?.absolute;
  assert.ok(homeFaTitle.length <= 60, `Home fa title > 60 chars: ${homeFaTitle.length}`);
  assert.ok(homeFa.description!.length >= 140 && homeFa.description!.length <= 160);

  const homeEn = createPageMetadata({ locale: "en", path: "/", isHome: true });
  const homeEnTitle = typeof homeEn.title === "string" ? homeEn.title : (homeEn.title as any)?.absolute;
  assert.ok(homeEnTitle.length <= 60, `Home en title > 60 chars: ${homeEnTitle.length}`);
  assert.ok(homeEn.description!.length >= 140 && homeEn.description!.length <= 160);

  // Inner page canonical and hreflang
  const pageMeta = createPageMetadata({
    locale: "fa",
    path: "/services/crm",
    title: "ساخت CRM اختصاصی",
    description: "توسعه نرم‌افزار CRM سازمانی و سفارشی با بالاترین سطح امنیت و پایداری.",
  });

  assert.equal(pageMeta.alternates?.canonical, "https://karapardazavand.ir/fa/services/crm");
  assert.equal(pageMeta.alternates?.languages?.["fa"], "https://karapardazavand.ir/fa/services/crm");
  assert.equal(pageMeta.alternates?.languages?.["en"], "https://karapardazavand.ir/en/services/crm");
  assert.equal(pageMeta.alternates?.languages?.["x-default"], "https://karapardazavand.ir/fa/services/crm");
});

test("REGRESSION: Structured Data Graph & @id Reference Integrity", () => {
  const org = buildOrganizationJsonLd("fa");
  assert.equal(org["@id"], ORGANIZATION_ID);
  assert.equal(org.name, "کارا پرداز اوند");
  assert.equal(org.contactPoint, undefined); // Omitted until real data confirmed

  const website = buildWebSiteJsonLd("fa");
  assert.equal(website["@id"], WEBSITE_ID);
  assert.equal(website.publisher["@id"], ORGANIZATION_ID);

  const service = buildServiceJsonLd({
    locale: "fa",
    slug: "erp",
    name: "پیاده‌سازی ERP سفارشی",
    description: "سیستم یکپارچه منابع سازمانی",
    url: "https://karapardazavand.ir/fa/services/erp",
  });
  assert.equal(service.provider["@id"], ORGANIZATION_ID);

  const article = buildArticleJsonLd({
    locale: "fa",
    path: "/insights/staged-delivery",
    headline: "تحویل مرحله‌ای نرم‌افزار",
    description: "چرا تحویل فاز به فاز باعث کاهش ریسک پروژه‌های بزرگ می‌شود.",
  });
  assert.equal(article.publisher["@id"], ORGANIZATION_ID);

  // Security escaping
  const escaped = serializeJsonLd({ test: "</script><script>" });
  assert.ok(!escaped.includes("</script>"));
});

test("REGRESSION: Crawl Coverage & AI Bots Policies", async () => {
  const robotsConfig = robots();
  assert.ok(robotsConfig.rules);
  const allowRules = getAiCrawlerRules("allow");
  assert.equal(allowRules.length, 6);

  const sitemapItems = await sitemap();
  for (const item of sitemapItems) {
    assert.ok(!item.url.includes("/admin"));
    assert.ok(!item.url.includes("/api"));
    assert.ok(item.alternates?.languages?.["x-default"]);
  }
});

test("REGRESSION: AI Referrer Attribution Classification", () => {
  assert.equal(classifyReferrer("https://chatgpt.com/"), "ai-assistant");
  assert.equal(classifyReferrer("https://www.perplexity.ai/"), "ai-assistant");
  assert.equal(classifyReferrer("https://claude.ai/"), "ai-assistant");
  assert.equal(classifyReferrer("https://gemini.google.com/"), "ai-assistant");
});
