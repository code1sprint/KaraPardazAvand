import { getTranslations } from "next-intl/server";
import { ProjectRow } from "@/components/portfolio/ProjectRow";
import {
  Container,
  Heading,
  Link,
  Section,
  Text,
} from "@/components/ui";
import { getAllProjects, getProjectsByService } from "@/content/projects";

export type RelatedProjectsProps = {
  serviceSlug: string;
  /** Prefer explicit slugs from the service file; fall back to project.services[]. */
  relatedSlugs?: readonly string[];
};

/**
 * Related case studies for a service detail page.
 * Hidden entirely when nothing published matches.
 */
export async function RelatedProjects({
  serviceSlug,
  relatedSlugs,
}: RelatedProjectsProps) {
  const t = await getTranslations("Services");
  const portfolioT = await getTranslations("Portfolio");

  const projects =
    relatedSlugs && relatedSlugs.length > 0
      ? (await getAllProjects()).filter((project) =>
          relatedSlugs.includes(project.slug),
        )
      : await getProjectsByService(serviceSlug);

  if (projects.length === 0) {
    return null;
  }

  return (
    <Section id="related-projects" aria-labelledby="related-projects-heading">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <Heading
              as={2}
              id="related-projects-heading"
              className="text-2xl sm:text-3xl"
            >
              {t("detail.relatedTitle")}
            </Heading>
            <Text variant="muted" className="mt-3">
              {t("detail.relatedLead")}
            </Text>
          </div>
          <Link href="/portfolio" variant="default">
            {portfolioT("featured.viewAll")}
          </Link>
        </div>

        <div className="mt-8 border-t border-line">
          {projects.map((project) => (
            <ProjectRow
              key={project.slug}
              project={project}
              viewLabel={portfolioT("viewCaseStudy")}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
