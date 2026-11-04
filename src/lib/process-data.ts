import type { AppLocale } from "@/i18n/routing";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getProcessModel } from "@/lib/db/models/Process";
import {
  getProcessSteps,
  getEngagementModels,
  getCommunicationRows,
  type ResolvedProcessStep,
  type ResolvedEngagementModel,
  type ResolvedCommunicationRow,
} from "@/content/process";

export type ResolvedProcessData = {
  hero?: {
    titleBefore: string;
    titleGradient: string;
    titleAfter: string;
    lead: string;
  };
  steps: ResolvedProcessStep[];
  engagementModels: ResolvedEngagementModel[];
  communicationRows: ResolvedCommunicationRow[];
  guide?: {
    title: string;
    html: string;
  } | null;
};

export async function getResolvedProcessData(
  locale: AppLocale,
): Promise<ResolvedProcessData> {
  "use cache";

  try {
    await connectToDatabase();
    const ProcessModel = await getProcessModel();
    const doc = await ProcessModel.findOne().lean();

    if (doc) {
      const hero = doc.hero
        ? {
            titleBefore:
              (locale === "en"
                ? doc.hero.titleBefore?.en
                : doc.hero.titleBefore?.fa) ||
              doc.hero.titleBefore?.fa ||
              "",
            titleGradient:
              (locale === "en"
                ? doc.hero.titleGradient?.en
                : doc.hero.titleGradient?.fa) ||
              doc.hero.titleGradient?.fa ||
              "",
            titleAfter:
              (locale === "en"
                ? doc.hero.titleAfter?.en
                : doc.hero.titleAfter?.fa) ||
              doc.hero.titleAfter?.fa ||
              "",
            lead:
              (locale === "en" ? doc.hero.lead?.en : doc.hero.lead?.fa) ||
              doc.hero.lead?.fa ||
              "",
          }
        : undefined;

      const steps: ResolvedProcessStep[] = (doc.steps || []).map((s) => ({
        id: s.id,
        number: s.number,
        title:
          (locale === "en" ? s.title?.en : s.title?.fa) || s.title?.fa || "",
        purpose:
          (locale === "en" ? s.purpose?.en : s.purpose?.fa) ||
          s.purpose?.fa ||
          "",
        deliverables: (s.deliverables || []).map(
          (d) =>
            (locale === "en" ? d?.en : d?.fa) || d?.fa || "",
        ),
        clientInvolvement:
          (locale === "en"
            ? s.clientInvolvement?.en
            : s.clientInvolvement?.fa) ||
          s.clientInvolvement?.fa ||
          "",
        duration:
          (locale === "en" ? s.duration?.en : s.duration?.fa) ||
          s.duration?.fa ||
          null,
      }));

      const engagementModels: ResolvedEngagementModel[] = (
        doc.engagementModels || []
      ).map((m) => ({
        id: m.id,
        title:
          (locale === "en" ? m.title?.en : m.title?.fa) || m.title?.fa || "",
        description:
          (locale === "en" ? m.description?.en : m.description?.fa) ||
          m.description?.fa ||
          "",
        needs_business_confirmation: true,
      }));

      const communicationRows: ResolvedCommunicationRow[] = (
        doc.communicationRows || []
      )
        .filter((r) => {
          const val = (locale === "en" ? r.value?.en : r.value?.fa) || r.value?.fa;
          return Boolean(val);
        })
        .map((r) => ({
          id: r.id,
          label:
            (locale === "en" ? r.label?.en : r.label?.fa) || r.label?.fa || "",
          value:
            (locale === "en" ? r.value?.en : r.value?.fa) || r.value?.fa || "",
          ...(r.needs_business_confirmation
            ? { needs_business_confirmation: true as const }
            : {}),
        }));

      const guideTitle =
        (locale === "en" ? doc.guide?.title?.en : doc.guide?.title?.fa) ||
        doc.guide?.title?.fa ||
        "";
      const guideHtml =
        (locale === "en"
          ? doc.guide?.tiptapBody?.en?.html
          : doc.guide?.tiptapBody?.fa?.html) ||
        doc.guide?.tiptapBody?.fa?.html ||
        "";

      const guide =
        guideTitle && guideHtml
          ? {
              title: guideTitle,
              html: guideHtml,
            }
          : null;

      return {
        hero,
        steps,
        engagementModels,
        communicationRows,
        guide,
      };
    }
  } catch {
    // Fall back to static definitions during prerendering or DB outage
  }

  return {
    steps: getProcessSteps(locale),
    engagementModels: getEngagementModels(locale),
    communicationRows: getCommunicationRows(locale),
  };
}
