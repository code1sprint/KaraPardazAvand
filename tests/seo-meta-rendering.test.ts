import assert from "node:assert/strict";
import { test } from "node:test";
import { routeSeoMetaCollection } from "../src/content/seo-meta";
import { createPageMetadata } from "../src/lib/seo/metadata";
import { GET as ogRouteHandler } from "../src/app/api/og/route";

test("all 62 routes render matching metadata titles, descriptions, and Open Graph tags", () => {
  for (const item of routeSeoMetaCollection) {
    const meta = createPageMetadata({
      locale: item.locale,
      path: item.route,
      isHome: item.route === "/",
    });

    const renderedTitle =
      typeof meta.title === "string"
        ? meta.title
        : (meta.title as { absolute?: string })?.absolute;
    assert.equal(
      renderedTitle,
      item.title,
      `Title mismatch on [${item.locale}] ${item.route}`,
    );

    assert.equal(
      meta.description,
      item.description,
      `Description mismatch on [${item.locale}] ${item.route}`,
    );

    // Open Graph checks
    assert.equal(
      meta.openGraph?.title,
      item.ogTitle,
      `OG Title mismatch on [${item.locale}] ${item.route}`,
    );
    assert.equal(
      meta.openGraph?.description,
      item.ogDescription,
      `OG Description mismatch on [${item.locale}] ${item.route}`,
    );

    // Twitter Card checks
    assert.equal(meta.twitter?.card, "summary_large_image");
    assert.equal(
      meta.twitter?.title,
      item.ogTitle,
      `Twitter Title mismatch on [${item.locale}] ${item.route}`,
    );
    assert.equal(
      meta.twitter?.description,
      item.ogDescription,
      `Twitter Description mismatch on [${item.locale}] ${item.route}`,
    );

    // Robots check
    const robotsObj = meta.robots as { index?: boolean; follow?: boolean } | null;
    if (item.robots.includes("noindex")) {
      assert.equal(robotsObj?.index, false);
      assert.equal(robotsObj?.follow, false);
    } else {
      assert.equal(robotsObj?.index, true);
      assert.equal(robotsObj?.follow, true);
    }
  }
});

test("OG image generation endpoint handles the longest ogImageText in Persian and English", async () => {
  // Find longest ogImageText.line1 in Persian and English
  let longestFa = "";
  let longestEn = "";

  for (const item of routeSeoMetaCollection) {
    const text = item.ogImageText.line1;
    if (item.locale === "fa" && text.length > longestFa.length) {
      longestFa = text;
    }
    if (item.locale === "en" && text.length > longestEn.length) {
      longestEn = text;
    }
  }

  assert.ok(longestFa.length > 0, "No Persian ogImageText found");
  assert.ok(longestEn.length > 0, "No English ogImageText found");

  // Call Persian OG image handler
  const faUrl = `https://karapardazavand.ir/api/og?locale=fa&title=${encodeURIComponent(longestFa)}`;
  const faReq = new Request(faUrl);
  const faRes = await ogRouteHandler(faReq);
  assert.equal(faRes.status, 200, `Fa OG handler failed with status ${faRes.status}`);
  const faContentType = faRes.headers.get("content-type");
  assert.ok(
    faContentType?.includes("image/png"),
    `Fa OG response content-type is not image/png: ${faContentType}`,
  );

  // Call English OG image handler
  const enUrl = `https://karapardazavand.ir/api/og?locale=en&title=${encodeURIComponent(longestEn)}`;
  const enReq = new Request(enUrl);
  const enRes = await ogRouteHandler(enReq);
  assert.equal(enRes.status, 200, `En OG handler failed with status ${enRes.status}`);
  const enContentType = enRes.headers.get("content-type");
  assert.ok(
    enContentType?.includes("image/png"),
    `En OG response content-type is not image/png: ${enContentType}`,
  );
});
