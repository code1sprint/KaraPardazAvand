import type { AppLocale } from "@/i18n/routing";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getSiteSettingsModel } from "@/lib/db/models/SiteSettings";
import { heroTech } from "@/content/systems";
import { whyStatements } from "@/content/why";
import { getResolvedStats } from "@/content/stats";

export type ResolvedHeroData = {
  pill: string;
  titleBefore: string;
  titleGradient: string;
  titleAfter: string;
  lead: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
  techMarquee: readonly string[];
};

export type ResolvedWhyStatement = {
  id: string;
  title: string;
  body: string;
};

export type ResolvedStatItem = {
  id: string;
  value: string;
  label: string;
  source?: string;
};

export type ResolvedContactData = {
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  socials: {
    linkedin?: string;
    github?: string;
    telegram?: string;
    instagram?: string;
  };
};

export type ResolvedSeoData = {
  siteName: string;
  homeTitle: string;
  homeDescription: string;
  ogImageAlt: string;
};

export type ResolvedHomeData = {
  hero: ResolvedHeroData;
  whyStatements: ResolvedWhyStatement[];
  stats: ResolvedStatItem[];
  contact: ResolvedContactData;
  seo: ResolvedSeoData;
};

export async function getResolvedHomeData(
  locale: AppLocale,
): Promise<ResolvedHomeData> {
  "use cache";

  try {
    await connectToDatabase();
    const SiteSettings = await getSiteSettingsModel();
    const doc = await SiteSettings.findOne().lean();

    if (doc) {
      const isEn = locale === "en";

      const hero: ResolvedHeroData = {
        pill: (isEn ? doc.hero?.pill?.en : doc.hero?.pill?.fa) || doc.hero?.pill?.fa || "",
        titleBefore: (isEn ? doc.hero?.titleBefore?.en : doc.hero?.titleBefore?.fa) || doc.hero?.titleBefore?.fa || "",
        titleGradient: (isEn ? doc.hero?.titleGradient?.en : doc.hero?.titleGradient?.fa) || doc.hero?.titleGradient?.fa || "",
        titleAfter: (isEn ? doc.hero?.titleAfter?.en : doc.hero?.titleAfter?.fa) || doc.hero?.titleAfter?.fa || "",
        lead: (isEn ? doc.hero?.lead?.en : doc.hero?.lead?.fa) || doc.hero?.lead?.fa || "",
        ctaPrimary: {
          label: (isEn ? doc.hero?.ctaPrimary?.label?.en : doc.hero?.ctaPrimary?.label?.fa) || doc.hero?.ctaPrimary?.label?.fa || "",
          href: doc.hero?.ctaPrimary?.href || "/contact",
        },
        ctaSecondary: {
          label: (isEn ? doc.hero?.ctaSecondary?.label?.en : doc.hero?.ctaSecondary?.label?.fa) || doc.hero?.ctaSecondary?.label?.fa || "",
          href: doc.hero?.ctaSecondary?.href || "/services",
        },
        techMarquee: doc.hero?.techMarquee && doc.hero.techMarquee.length > 0 ? doc.hero.techMarquee : heroTech,
      };

      const resolvedWhy: ResolvedWhyStatement[] = (doc.whyStatements || []).map((w) => ({
        id: w.id,
        title: (isEn ? w.title?.en : w.title?.fa) || w.title?.fa || "",
        body: (isEn ? w.body?.en : w.body?.fa) || w.body?.fa || "",
      }));

      const resolvedStats: ResolvedStatItem[] = (doc.stats || [])
        .filter((s) => Boolean(s.value && s.value.trim() !== ""))
        .map((s) => ({
          id: s.id,
          value: s.value || "",
          label: (isEn ? s.label?.en : s.label?.fa) || s.label?.fa || "",
          source: s.source,
        }));

      const contact: ResolvedContactData = {
        phone: doc.contact?.phone,
        email: doc.contact?.email,
        address: (isEn ? doc.contact?.address?.en : doc.contact?.address?.fa) || doc.contact?.address?.fa,
        workingHours: (isEn ? doc.contact?.workingHours?.en : doc.contact?.workingHours?.fa) || doc.contact?.workingHours?.fa,
        socials: doc.contact?.socials || {},
      };

      const seo: ResolvedSeoData = {
        siteName: (isEn ? doc.seo?.siteName?.en : doc.seo?.siteName?.fa) || doc.seo?.siteName?.fa || "",
        homeTitle: (isEn ? doc.seo?.homeTitle?.en : doc.seo?.homeTitle?.fa) || doc.seo?.homeTitle?.fa || "",
        homeDescription: (isEn ? doc.seo?.homeDescription?.en : doc.seo?.homeDescription?.fa) || doc.seo?.homeDescription?.fa || "",
        ogImageAlt: (isEn ? doc.seo?.ogImageAlt?.en : doc.seo?.ogImageAlt?.fa) || doc.seo?.ogImageAlt?.fa || "",
      };

      return {
        hero,
        whyStatements: resolvedWhy,
        stats: resolvedStats,
        contact,
        seo,
      };
    }
  } catch {
    // Fall back to static code defaults during build or DB outage
  }

  // Fallback defaults
  const isEn = locale === "en";

  return {
    hero: {
      pill: isEn ? "From the Code1Sprint family" : "از خانواده Code1Sprint",
      titleBefore: isEn ? "Systems that move " : "سیستم‌هایی که ",
      titleGradient: isEn ? "your organization's work" : "کار سازمان شما",
      titleAfter: isEn ? " forward" : " را جلو می‌برند",
      lead: isEn
        ? "Custom software design and development, CRM, ERP, enterprise AI, and data dashboards—from needs analysis through post-delivery support."
        : "طراحی و توسعه نرم‌افزار سفارشی، CRM، ERP، هوش مصنوعی سازمانی و داشبورد داده؛ از تحلیل نیاز تا پشتیبانی بعد از تحویل.",
      ctaPrimary: {
        label: isEn ? "Request consultation" : "درخواست مشاوره رایگان",
        href: "/contact",
      },
      ctaSecondary: {
        label: isEn ? "View services" : "مشاهده خدمات",
        href: "/services",
      },
      techMarquee: heroTech,
    },
    whyStatements: whyStatements.map((w) => ({
      id: w.id,
      title: w.title[locale],
      body: w.body[locale],
    })),
    stats: getResolvedStats().map((s) => ({
      id: s.id,
      value: s.value,
      label: s.id,
    })),
    contact: {
      email: "info@karapardaz.com",
      socials: {},
    },
    seo: {
      siteName: isEn ? "Kara Pardaz Avand" : "کارا پرداز اوند",
      homeTitle: isEn ? "Kara Pardaz Avand" : "کارا پرداز اوند",
      homeDescription: isEn
        ? "Custom software design and development"
        : "طراحی و توسعه نرم‌افزار سفارشی، CRM، ERP، هوش مصنوعی سازمانی و داشبورد داده.",
      ogImageAlt: isEn ? "Kara Pardaz Avand card" : "تصویر اشتراک‌گذاری کارا پرداز اوند",
    },
  };
}
