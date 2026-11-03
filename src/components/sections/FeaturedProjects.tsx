import { getTranslations } from "next-intl/server";
import { ProjectRow } from "@/components/portfolio/ProjectRow";
import { Reveal } from "@/components/layout/Reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow, Heading, Link, Text } from "@/components/ui";
import {
  getAllProjects,
  getFeaturedProjects,
  type ProjectMeta,
} from "@/content/projects";

export type FeaturedProjectsProps = {
  /** Max featured rows (phase default: 3). */
  limit?: number;
};

async function getHomeProjects(limit: number): Promise<ProjectMeta[]> {
  const featured = await getFeaturedProjects(limit);
  if (featured.length > 0) return featured;
  const published = await getAllProjects();
  return published.slice(0, limit);
}

/**
 * Up to 3 horizontal project rows.
 * Hidden entirely when no published (or visible draft-in-dev) projects exist.
 */
export async function FeaturedProjects({ limit = 3 }: FeaturedProjectsProps) {
  const t = await getTranslations("Portfolio");
  const projects = await getHomeProjects(limit);

  if (projects.length === 0) {
    return null;
  }

  return (
    <Section id="portfolio" aria-labelledby="portfolio-heading">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <Eyebrow>{t("featured.eyebrow")}</Eyebrow>
              <Heading as={2} id="portfolio-heading">
                {t("featured.title")}
              </Heading>
              <Text variant="muted" className="mt-3">
                {t("featured.lead")}
              </Text>
            </div>
            <Link href="/portfolio" variant="default">
              {t("featured.viewAll")}
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 border-t border-line">
          {projects.map((project) => (
            <ProjectRow
              key={project.slug}
              project={project}
              viewLabel={t("viewCaseStudy")}
              large
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
