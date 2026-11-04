import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs, Container, PageHero } from "@/components/layout";
import { PortfolioFilter } from "@/components/portfolio/PortfolioFilter";
import { Text } from "@/components/ui";
import {
  collectProjectSectors,
  collectProjectServiceSlugs,
  getAllProjects,
} from "@/content/projects";
import {
  getServiceBySlug,
  pickLocalized,
} from "@/content/services";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return buildPageMetadata({
    locale,
    path: "/portfolio",
    title: t("pages.portfolio.title"),
    description: t("pages.portfolio.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
  });
}

function PortfolioIndexFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="h-10 w-56 animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-4 h-5 max-w-xl animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-10 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 animate-pulse rounded-pill bg-blue-soft"
            />
          ))}
        </div>
      </Container>
    </div>
  );
}

async function PortfolioIndexContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Portfolio");
  const breadcrumbT = await getTranslations("Breadcrumb");
  const appLocale = (await getLocale()) as AppLocale;
  const projects = await getAllProjects();

  const serviceOptions = collectProjectServiceSlugs(projects).map((slug) => {
    const service = getServiceBySlug(slug);
    return {
      slug,
      label: service ? pickLocalized(service.title, appLocale) : slug,
    };
  });

  const sectorOptions = collectProjectSectors(projects).map((sector) => ({
    slug: sector,
    label: sector,
  }));

  return (
    <PageHero
      breadcrumbs={
        <Breadcrumbs
          label={breadcrumbT("label")}
          items={[
            { label: breadcrumbT("home"), href: "/" },
            { label: t("list.title") },
          ]}
        />
      }
      eyebrow={t("list.eyebrow")}
      title={t("list.title")}
      lead={t("list.lead")}
    >
      <Suspense
        fallback={
          <Text variant="muted" role="status">
            {t("empty")}
          </Text>
        }
      >
        <PortfolioFilter
          projects={projects}
          services={serviceOptions}
          sectors={sectorOptions}
          labels={{
            all: t("filter.all"),
            serviceFilterLabel: t("filter.service"),
            sectorFilterLabel: t("filter.sector"),
            empty: t("empty"),
            emptyFiltered: t("emptyFiltered"),
            emptyCta: t("emptyCta"),
            viewCaseStudy: t("viewCaseStudy"),
          }}
        />
      </Suspense>
    </PageHero>
  );
}

export default function PortfolioIndexPage({ params }: Props) {
  return (
    <Suspense fallback={<PortfolioIndexFallback />}>
      <PortfolioIndexContent params={params} />
    </Suspense>
  );
}
