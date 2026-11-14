import type { AppLocale } from "@/i18n/routing";

export type LegalSeoFields = {
  title: { fa: string; en?: string };
  description: { fa: string; en?: string };
};

export type LegalMetaSource = {
  title: { fa: string; en?: string };
  summary?: { fa: string; en?: string } | null;
  seo?: Partial<LegalSeoFields> | null;
};

/**
 * Custom SEO when both fa title+description are set; else track title + summary.
 */
export function resolveLegalPageMeta(
  source: LegalMetaSource,
  locale: AppLocale,
): { title: string; description: string } {
  const customTitleFa = (source.seo?.title?.fa || "").trim();
  const customDescFa = (source.seo?.description?.fa || "").trim();
  const useCustom = Boolean(customTitleFa && customDescFa);

  const titleObj = useCustom
    ? {
        fa: customTitleFa,
        en: (source.seo?.title?.en || "").trim() || source.title.en || "",
      }
    : { fa: source.title.fa, en: source.title.en || "" };

  const summaryFa = (source.summary?.fa || "").trim();
  const summaryEn = (source.summary?.en || "").trim();
  const descObj = useCustom
    ? {
        fa: customDescFa,
        en: (source.seo?.description?.en || "").trim() || summaryEn,
      }
    : { fa: summaryFa, en: summaryEn };

  return {
    title: (locale === "en" ? titleObj.en : titleObj.fa) || titleObj.fa,
    description:
      (locale === "en" ? descObj.en : descObj.fa) || descObj.fa || "",
  };
}
