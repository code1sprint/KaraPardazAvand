import type { AppLocale } from "@/i18n/routing";

export type AboutSeoFields = {
  title: { fa: string; en?: string };
  description: { fa: string; en?: string };
};

export type AboutIntroFields = {
  title: { fa: string; en?: string };
  lead: { fa: string; en?: string };
};

/** Fill blank SEO fields from intro when saving. */
export function syncAboutSeoFromIntro(
  intro: AboutIntroFields,
  seo?: Partial<AboutSeoFields> | null,
): AboutSeoFields {
  return {
    title: {
      fa: (seo?.title?.fa || "").trim() || intro.title.fa,
      en: (seo?.title?.en || "").trim() || intro.title.en || "",
    },
    description: {
      fa: (seo?.description?.fa || "").trim() || intro.lead.fa,
      en: (seo?.description?.en || "").trim() || intro.lead.en || "",
    },
  };
}

/**
 * Resolve public meta: custom SEO (both fa title+description set) wins;
 * otherwise track intro so panel content changes update meta.
 */
export function resolveAboutPageMeta(
  intro: AboutIntroFields,
  seo: Partial<AboutSeoFields> | null | undefined,
  locale: AppLocale,
): { title: string; description: string } {
  const customTitleFa = (seo?.title?.fa || "").trim();
  const customDescFa = (seo?.description?.fa || "").trim();
  const useCustom = Boolean(customTitleFa && customDescFa);

  const source: AboutSeoFields = useCustom
    ? {
        title: {
          fa: customTitleFa,
          en: (seo?.title?.en || "").trim() || intro.title.en || "",
        },
        description: {
          fa: customDescFa,
          en: (seo?.description?.en || "").trim() || intro.lead.en || "",
        },
      }
    : {
        title: { fa: intro.title.fa, en: intro.title.en || "" },
        description: { fa: intro.lead.fa, en: intro.lead.en || "" },
      };

  const title =
    (locale === "en" ? source.title.en : source.title.fa) ||
    source.title.fa ||
    "";
  const description =
    (locale === "en" ? source.description.en : source.description.fa) ||
    source.description.fa ||
    "";

  return { title, description };
}
