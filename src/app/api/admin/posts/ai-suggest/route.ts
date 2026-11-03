import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { normalizePersianText } from "@/lib/editor/normalizer";

const TECHNICAL_KEYWORD_MAP: Array<{ regex: RegExp; tag: string }> = [
  { regex: /crm|مشتری|فروش|سرنخ|پشتیبانی/i, tag: "CRM" },
  { regex: /erp|انبار|حسابداری|برنامه‌ریزی منابع/i, tag: "ERP" },
  { regex: /rag|هوش مصنوعی|مدل زبانی|llm|وکتور/i, tag: "هوش مصنوعی و RAG" },
  { regex: /داده|داشبورد|علم داده|bi|هوش تجاری/i, tag: "داده و تحلیل" },
  { regex: /معماری|مایکروسرویس|کلود|زیرساخت|سیستم/i, tag: "معماری نرم‌افزار" },
  { regex: /وب|فرانت|next|react|پلتفرم/i, tag: "پلتفرم‌های تحت وب" },
  { regex: /امنیت|احراز هویت|رمزنگاری|حریم خصوصی/i, tag: "امنیت داده" },
];

export const POST = withAuth(
  async (request: Request) => {
    let body: { title?: string; contentHtml?: string; locale?: "fa" | "en" } = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ ok: false, message: "داده نامعتبر است." }, { status: 400 });
    }

    const { title = "", contentHtml = "", locale = "fa" } = body;

    // Clean plain text
    const plainText = contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const cleanTitle = normalizePersianText(title.trim());

    // 1. Generate suggested tags from content keywords
    const detectedTags = new Set<string>();
    const fullCorpus = `${cleanTitle} ${plainText}`;

    for (const item of TECHNICAL_KEYWORD_MAP) {
      if (item.regex.test(fullCorpus)) {
        detectedTags.add(item.tag);
      }
    }

    if (detectedTags.size === 0) {
      detectedTags.add(locale === "fa" ? "فناوری و نرم‌افزار" : "Software Engineering");
    }

    // 2. Generate summary
    let suggestedSummary = "";
    if (plainText.length > 30) {
      // Extract first 1 to 2 sentences
      const sentences = plainText.split(/[.!?؟]/).map((s) => s.trim()).filter((s) => s.length > 15);
      if (sentences.length > 0) {
        suggestedSummary = sentences.slice(0, 2).join(". ") + ".";
      } else {
        suggestedSummary = plainText.slice(0, 160) + "...";
      }
    } else if (cleanTitle) {
      suggestedSummary = `بررسی جامع و تحلیلی درباره «${cleanTitle}» و معیارهای فنی آن در سامانه‌های سازمانی.`;
    }

    suggestedSummary = normalizePersianText(suggestedSummary);

    return NextResponse.json({
      ok: true,
      suggestedTitle: cleanTitle || "رویکردهای مهندسی در توسعه سامانه‌های سازمانی",
      suggestedSummary,
      suggestedTags: Array.from(detectedTags),
    });
  },
  { roles: ["admin", "editor"] },
);
