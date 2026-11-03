import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout";
import { ProjectCover } from "@/components/portfolio/ProjectCover";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { ProjectSystemMap } from "@/components/portfolio/ProjectSystemMap";
import {
  ButtonLink,
  Chip,
  Container,
  Heading,
  Link,
  Prose,
  Text,
} from "@/components/ui";
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjectSlugs,
  getSourcedResults,
} from "@/content/projects";
import {
  getServiceBySlug,
  pickLocalized,
} from "@/content/services";
import type { AppLocale } from "@/i18n/routing";
import { compileMdxSource } from "@/lib/mdx";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  // Cache Components requires ≥1 result. When only drafts exist they are
  // stripped in production builds, so use a reserved slug that always 404s.
  const effectiveSlugs = slugs.length > 0 ? slugs : ["__none__"];
  return routing.locales.flatMap((locale) =>
    effectiveSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const project = await getProjectBySlug(slug);

  if (!project) {
    return buildPageMetadata({
      locale,
      path: `/portfolio/${slug}`,
      title: t("pages.portfolio.title"),
      description: t("pages.portfolio.description"),
      siteName: t("siteName"),
      imageAlt: t("ogImageAlt"),
      noIndex: true,
    });
  }

  return buildPageMetadata({
    locale,
    path: `/portfolio/${slug}`,
    title: project.meta.title,
    description: project.meta.problem,
    siteName: t("siteName"),
    imageAlt: project.meta.title,
    type: "article",
  });
}

function CaseStudyFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="h-8 w-40 animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-6 h-12 max-w-2xl animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-4 aspect-[16/10] max-w-3xl animate-pulse rounded-tile bg-blue-soft" />
      </Container>
    </div>
  );
}

async function CaseStudyContent({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = await getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const appLocale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Portfolio");
  const breadcrumbT = await getTranslations("Breadcrumb");
  const sourcedResults = getSourcedResults(project.meta.results);
  const { previous, next } = await getAdjacentProjects(slug);
  const { content } = await compileMdxSource(project.content);

  const serviceLabels = project.meta.services.map((serviceSlug) => {
    const service = getServiceBySlug(serviceSlug);
    return service ? pickLocalized(service.title, appLocale) : serviceSlug;
  });

  return (
    <div className="py-12 sm:py-16">
      <Container narrow>
        <Breadcrumbs
          label={breadcrumbT("label")}
          items={[
            { label: breadcrumbT("home"), href: "/" },
            { label: t("list.title"), href: "/portfolio" },
            { label: project.meta.title },
          ]}
        />

        <Heading as={1} className="max-w-[18ch]">
          {project.meta.title}
        </Heading>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label={t("detail.meta")}>
          <li>
            <Chip tone="soft">{project.meta.sector}</Chip>
          </li>
          {serviceLabels.map((label) => (
            <li key={label}>
              <Chip tone="panel">{label}</Chip>
            </li>
          ))}
          <li>
            <Chip tone="muted">
              {t("detail.year")}: {project.meta.year}
            </Chip>
          </li>
          <li>
            <Chip tone="muted">
              {t("detail.role")}: {project.meta.role}
            </Chip>
          </li>
        </ul>

        <div className="mt-8">
          <ProjectCover
            src={project.meta.cover}
            alt={project.meta.title}
            sizes="(max-width: 768px) 100vw, 48rem"
            priority
          />
        </div>

        <section className="mt-12" aria-labelledby="case-problem">
          <Heading as={2} id="case-problem" className="text-2xl sm:text-3xl">
            {t("detail.problem")}
          </Heading>
          <Prose className="mt-3">
            <p>{project.meta.problem}</p>
          </Prose>
        </section>

        <section className="mt-10" aria-labelledby="case-solution">
          <Heading as={2} id="case-solution" className="text-2xl sm:text-3xl">
            {t("detail.solution")}
          </Heading>
          <Prose className="mt-3">
            <p>{project.meta.solution}</p>
          </Prose>
        </section>

        <section className="mt-12" aria-labelledby="case-architecture">
          <Heading
            as={2}
            id="case-architecture"
            className="text-2xl sm:text-3xl"
          >
            {t("detail.architecture")}
          </Heading>
          <div className="mt-6">
            <ProjectSystemMap
              locale={appLocale}
              map={project.meta.systemMap}
              mapLabel={t("detail.architectureMap")}
              animationKey={project.meta.slug}
            />
          </div>
        </section>

        {sourcedResults.length > 0 ? (
          <section className="mt-12" aria-labelledby="case-results">
            <Heading as={2} id="case-results" className="text-2xl sm:text-3xl">
              {t("detail.results")}
            </Heading>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {sourcedResults.map((result) => (
                <li
                  key={`${result.label}-${result.value}`}
                  className="border-s-2 border-sky ps-5"
                >
                  <p className="text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-none tracking-[-0.025em] text-text">
                    {result.value}
                  </p>
                  <p className="mt-3 text-sm font-medium text-text">
                    {result.label}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {t("detail.source")}: {result.source}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.meta.stack.length > 0 ? (
          <section className="mt-12" aria-labelledby="case-stack">
            <Heading as={2} id="case-stack" className="text-2xl sm:text-3xl">
              {t("detail.stack")}
            </Heading>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.meta.stack.map((item) => (
                <li key={item}>
                  <Chip tone="panel">{item}</Chip>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.meta.gallery.length > 0 ? (
          <section className="mt-12" aria-labelledby="case-gallery">
            <Heading as={2} id="case-gallery" className="text-2xl sm:text-3xl">
              {t("detail.gallery")}
            </Heading>
            <ProjectGallery
              className="mt-6"
              items={project.meta.gallery}
              label={t("detail.gallery")}
            />
          </section>
        ) : null}

        {project.content.trim() ? (
          <section className="mt-10" aria-label={t("detail.notes")}>
            <Prose>
              <article className="min-w-0 text-start">{content}</article>
            </Prose>
          </section>
        ) : null}

        {previous || next ? (
          <nav
            className="mt-14 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:justify-between"
            aria-label={t("detail.adjacent")}
          >
            {previous ? (
              <Link
                href={`/portfolio/${previous.slug}`}
                variant="default"
                className="max-w-sm text-start"
              >
                <span className="block text-sm text-muted">
                  {t("detail.previous")}
                </span>
                <span className="mt-1 block font-medium text-text">
                  {previous.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/portfolio/${next.slug}`}
                variant="default"
                className="max-w-sm text-start sm:text-end"
              >
                <span className="block text-sm text-muted">
                  {t("detail.next")}
                </span>
                <span className="mt-1 block font-medium text-text">
                  {next.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}

        <section
          className="mt-14 border-t border-line pt-10"
          aria-labelledby="case-cta"
        >
          <Heading as={2} id="case-cta" className="text-2xl sm:text-3xl">
            {t("detail.ctaTitle")}
          </Heading>
          <Text variant="muted" className="mt-3 max-w-xl">
            {t("detail.ctaLead")}
          </Text>
          <div className="mt-6">
            <ButtonLink href="/contact" variant="primary">
              {t("detail.ctaButton")}
            </ButtonLink>
          </div>
        </section>
      </Container>
    </div>
  );
}

export default function CaseStudyPage({ params }: Props) {
  return (
    <Suspense fallback={<CaseStudyFallback />}>
      <CaseStudyContent params={params} />
    </Suspense>
  );
}
