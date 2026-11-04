import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guard";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getSiteSettingsModel } from "@/lib/db/models/SiteSettings";
import { siteSettingsSchema } from "@/lib/validations/site-settings";
import { normalizePersianText } from "@/lib/editor/normalizer";

export const GET = withAuth(
  async () => {
    await connectToDatabase();
    const SiteSettings = await getSiteSettingsModel();

    let settings = await SiteSettings.findOne().lean();
    if (!settings) {
      settings = await SiteSettings.create({
        hero: {
          pill: { fa: "از خانواده Code1Sprint", en: "From the Code1Sprint family" },
          titleBefore: { fa: "سیستم‌هایی که ", en: "Systems that move " },
          titleGradient: { fa: "کار سازمان شما", en: "your organization's work" },
          titleAfter: { fa: " را جلو می‌برند", en: " forward" },
          lead: {
            fa: "طراحی و توسعه نرم‌افزار سفارشی، CRM، ERP، هوش مصنوعی سازمانی و داشبورد داده.",
            en: "Custom software design, CRM, ERP, enterprise AI, and data dashboards.",
          },
          ctaPrimary: {
            label: { fa: "درخواست مشاوره رایگان", en: "Request consultation" },
            href: "/contact",
          },
          ctaSecondary: {
            label: { fa: "مشاهده خدمات", en: "View services" },
            href: "/services",
          },
          techMarquee: ["TypeScript", "Next.js", "Python", "Docker", "PostgreSQL"],
        },
        whyStatements: [],
        stats: [],
        contact: {
          email: "info@karapardaz.com",
          socials: {},
        },
        seo: {
          siteName: { fa: "کارا پرداز اوند", en: "Kara Pardaz Avand" },
          homeTitle: { fa: "کارا پرداز اوند", en: "Kara Pardaz Avand" },
          homeDescription: { fa: "توسعه نرم‌افزار سازمانی", en: "Enterprise Software" },
          ogImageAlt: { fa: "کارا پرداز اوند", en: "Kara Pardaz Avand" },
        },
      });
    }

    return NextResponse.json({ ok: true, settings });
  },
  { roles: ["admin", "editor"] },
);

export const PUT = withAuth(
  async (request: Request) => {
    await connectToDatabase();
    const SiteSettings = await getSiteSettingsModel();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, message: "داده ارسالی نامعتبر است." },
        { status: 400 },
      );
    }

    const parseResult = siteSettingsSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "خطا در اعتبارسنجی تنظیمات صفحه اصلی و هویت.",
          errors: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const validData = parseResult.data;

    // Normalize Persian strings in Hero
    if (validData.hero.titleBefore.fa) {
      validData.hero.titleBefore.fa = normalizePersianText(validData.hero.titleBefore.fa);
    }
    if (validData.hero.titleGradient.fa) {
      validData.hero.titleGradient.fa = normalizePersianText(validData.hero.titleGradient.fa);
    }
    if (validData.hero.titleAfter.fa) {
      validData.hero.titleAfter.fa = normalizePersianText(validData.hero.titleAfter.fa);
    }
    if (validData.hero.lead.fa) {
      validData.hero.lead.fa = normalizePersianText(validData.hero.lead.fa);
    }

    let settings = await SiteSettings.findOne();
    if (settings) {
      settings.hero = validData.hero;
      settings.whyStatements = validData.whyStatements;
      settings.stats = validData.stats;
      settings.contact = validData.contact;
      settings.seo = validData.seo;
      settings.updatedAt = new Date();
      await settings.save();
    } else {
      settings = await SiteSettings.create(validData);
    }

    return NextResponse.json({
      ok: true,
      message: "تنظیمات صفحه اصلی و هویت برند با موفقیت ذخیره شد.",
      settings,
    });
  },
  { roles: ["admin", "editor"] },
);

export const PATCH = PUT;
