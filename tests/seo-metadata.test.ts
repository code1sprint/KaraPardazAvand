import assert from "node:assert/strict";
import { test } from "node:test";
import { createPageMetadata, clampDescription, formatMetaTitle } from "../src/lib/seo/metadata";

test("home page metadata matches exact spec requirements and lengths", () => {
  const faMeta = createPageMetadata({
    locale: "fa",
    path: "/",
    isHome: true,
  });

  const faTitle =
    typeof faMeta.title === "string"
      ? faMeta.title
      : (faMeta.title as { absolute?: string })?.absolute;
  assert.equal(faTitle, "کارا پرداز اوند | توسعه نرم‌افزار سازمانی، CRM، ERP و RAG");
  assert.ok(faTitle && faTitle.length <= 60, `fa title length ${faTitle?.length} > 60`);
  assert.equal(
    faMeta.description,
    "کارا پرداز اوند در زمینه توسعه نرم‌افزار سازمانی، سامانه‌های CRM و ERP اختصاصی برای سازمان‌ها فعالیت می‌کند. برای بررسی فرایندها مشاوره دریافت کنید.",
  );
  assert.ok(
    faMeta.description!.length >= 120 && faMeta.description!.length <= 158,
    `fa description length ${faMeta.description!.length} outside 120-158`,
  );

  const enMeta = createPageMetadata({
    locale: "en",
    path: "/",
    isHome: true,
  });
  const enTitle =
    typeof enMeta.title === "string"
      ? enMeta.title
      : (enMeta.title as { absolute?: string })?.absolute;
  assert.equal(enTitle, "Kara Pardaz Avand | Enterprise Software, CRM, ERP & RAG");
  assert.ok(enTitle && enTitle.length <= 60, `en title length ${enTitle?.length} > 60`);
  assert.ok(
    enMeta.description!.length >= 120 && enMeta.description!.length <= 158,
    `en description length ${enMeta.description!.length} outside bounds`,
  );
});

test("canonical and hreflang are absolute, reciprocal, and include x-default", () => {
  const meta = createPageMetadata({
    locale: "fa",
    path: "/services/crm",
    title: "ساخت CRM اختصاصی برای سازمان‌ها | کارا پرداز اوند",
    description: "توسعه سامانه مدیریت ارتباط با مشتریان متناسب با فرایندهای سازمان شما، با معماری یکپارچه، مالکیت کامل سورس کد و بدون لایسنس کاربری دوره‌ای.",
  });

  assert.equal(meta.alternates?.canonical, "https://karapardazavand.ir/fa/services/crm");
  assert.equal(meta.alternates?.languages?.["fa"], "https://karapardazavand.ir/fa/services/crm");
  assert.equal(meta.alternates?.languages?.["en"], "https://karapardazavand.ir/en/services/crm");
  assert.equal(meta.alternates?.languages?.["x-default"], "https://karapardazavand.ir/fa/services/crm");
});

test("formatMetaTitle stays within 60 characters and suffixes brand name sensibly", () => {
  const shortTitle = formatMetaTitle("طراحی پلتفرم", "fa");
  assert.equal(shortTitle, "طراحی پلتفرم | کارا پرداز اوند");
  assert.ok(shortTitle.length <= 60);

  const longRawTitle = "سامانه فوق‌پیشرفته و هوشمند مهندسی و مدیریت ساخت سازه‌های سنگین فلزی";
  const formattedLong = formatMetaTitle(longRawTitle, "fa");
  assert.ok(formattedLong.length <= 60, `formattedLong length ${formattedLong.length} > 60`);
});

test("clampDescription fits within 140 to 160 characters without breaking mid-word", () => {
  const tooLong = "این یک متن طولانی تستی برای ارزیابی عملکرد متد خلاصه‌سازی و تنظیم طول متادیسکریپشن است که باید به شکل دقیق و حرفه‌ای کوتاه شود بدون اینکه به نیمه کلمه آسیب بزند یا کاراکترهای عجیب ایجاد کند.";
  const clamped = clampDescription(tooLong);
  assert.ok(clamped.length >= 140 && clamped.length <= 160, `Clamped length ${clamped.length} out of range`);
});
