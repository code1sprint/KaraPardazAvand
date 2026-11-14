import type { AppLocale } from "@/i18n/routing";

export type ServiceSeoFields = {
  title: { fa: string; en: string };
  description: { fa: string; en: string };
};

export type ServiceMetaSource = {
  title: { fa: string; en: string };
  outcome: { fa: string; en: string };
  seo?: Partial<ServiceSeoFields> | null;
};

export function syncServiceSeoFromContent(
  content: { title: { fa: string; en: string }; outcome: { fa: string; en: string } },
  seo?: Partial<ServiceSeoFields> | null,
): ServiceSeoFields {
  return {
    title: {
      fa: (seo?.title?.fa || "").trim() || content.title.fa,
      en: (seo?.title?.en || "").trim() || content.title.en,
    },
    description: {
      fa: (seo?.description?.fa || "").trim() || content.outcome.fa,
      en: (seo?.description?.en || "").trim() || content.outcome.en,
    },
  };
}

/** Custom SEO if both fa fields set; else track title + outcome. */
export function resolveServicePageMeta(
  source: ServiceMetaSource,
  locale: AppLocale,
): { title: string; description: string } {
  const customTitleFa = (source.seo?.title?.fa || "").trim();
  const customDescFa = (source.seo?.description?.fa || "").trim();
  const useCustom = Boolean(customTitleFa && customDescFa);

  const titleObj = useCustom
    ? {
        fa: customTitleFa,
        en: (source.seo?.title?.en || "").trim() || source.title.en,
      }
    : source.title;
  const descObj = useCustom
    ? {
        fa: customDescFa,
        en: (source.seo?.description?.en || "").trim() || source.outcome.en,
      }
    : source.outcome;

  return {
    title: (locale === "en" ? titleObj.en : titleObj.fa) || titleObj.fa,
    description:
      (locale === "en" ? descObj.en : descObj.fa) || descObj.fa,
  };
}
