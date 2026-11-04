import type { AppLocale } from "@/i18n/routing";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getAboutModel } from "@/lib/db/models/About";
import {
  getAboutIntro,
  getAboutStory,
  getAboutPrinciples,
  getAboutBrandNodes,
  getAboutTeam,
  getAboutCulture,
  type ResolvedAboutPrinciple,
  type ResolvedAboutBrandNode,
  type ResolvedAboutTeamMember,
  type ResolvedAboutCultureItem,
} from "@/content/about";

export type ResolvedAboutData = {
  intro: {
    title: string;
    lead: string;
  };
  story: {
    title: string;
    body?: string;
    html?: string;
  } | null;
  principles: ResolvedAboutPrinciple[];
  brandNodes: ResolvedAboutBrandNode[];
  team: ResolvedAboutTeamMember[];
  culture: ResolvedAboutCultureItem[];
};

export async function getResolvedAboutData(
  locale: AppLocale,
): Promise<ResolvedAboutData> {
  "use cache";

  try {
    await connectToDatabase();
    const AboutModel = await getAboutModel();
    const doc = await AboutModel.findOne().lean();

    if (doc) {
      const intro = {
        title: (locale === "en" ? doc.intro?.title?.en : doc.intro?.title?.fa) || doc.intro?.title?.fa || "",
        lead: (locale === "en" ? doc.intro?.lead?.en : doc.intro?.lead?.fa) || doc.intro?.lead?.fa || "",
      };

      const storyTitle = (locale === "en" ? doc.story?.title?.en : doc.story?.title?.fa) || doc.story?.title?.fa || "";
      const storyHtml = (locale === "en" ? doc.story?.tiptapBody?.en?.html : doc.story?.tiptapBody?.fa?.html) || doc.story?.tiptapBody?.fa?.html || "";

      const story = storyTitle && storyHtml ? {
        title: storyTitle,
        html: storyHtml,
      } : null;

      const principles: ResolvedAboutPrinciple[] = (doc.principles || []).map((p) => ({
        id: p.id,
        title: (locale === "en" ? p.title?.en : p.title?.fa) || p.title?.fa || "",
        body: (locale === "en" ? p.body?.en : p.body?.fa) || p.body?.fa || "",
      }));

      const brandNodes: ResolvedAboutBrandNode[] = (doc.brandNodes || []).map((b) => ({
        id: b.id as "code1sprint" | "kara",
        name: (locale === "en" ? b.name?.en : b.name?.fa) || b.name?.fa || "",
        focus: (locale === "en" ? b.focus?.en : b.focus?.fa) || b.focus?.fa || "",
      }));

      const team: ResolvedAboutTeamMember[] = (doc.team || []).map((m) => ({
        id: m.id,
        name: (locale === "en" ? m.name?.en : m.name?.fa) || m.name?.fa || "",
        role: (locale === "en" ? m.role?.en : m.role?.fa) || m.role?.fa || "",
        photo: m.photo || null,
      }));

      const culture: ResolvedAboutCultureItem[] = (doc.culture || []).map((c) => ({
        id: c.id,
        title: (locale === "en" ? c.title?.en : c.title?.fa) || c.title?.fa || "",
        body: (locale === "en" ? c.body?.en : c.body?.fa) || c.body?.fa || "",
        needs_business_confirmation: true,
      }));

      return {
        intro,
        story,
        principles,
        brandNodes,
        team,
        culture,
      };
    }
  } catch {
    // Fall back to static definitions during prerendering or DB outage
  }

  const staticStory = getAboutStory(locale);
  return {
    intro: getAboutIntro(locale),
    story: staticStory ? { title: staticStory.title, body: staticStory.body } : null,
    principles: getAboutPrinciples(locale),
    brandNodes: getAboutBrandNodes(locale),
    team: getAboutTeam(locale),
    culture: getAboutCulture(locale),
  };
}
