import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout";
import { InsightsFilter } from "@/components/insights/InsightsFilter";
import { collectPostTags, getAllPosts } from "@/content/posts";
import { getSiteUrl } from "@/content/site";
import {
  Container,
  Eyebrow,
  Heading,
  Text,
} from "@/components/ui";
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
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const base = buildPageMetadata({
    locale,
    path: "/insights",
    title: t("pages.insights.title"),
    description: t("pages.insights.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
  });

  return {
    ...base,
    alternates: {
      ...base.alternates,
      types: {
        "application/rss+xml": `${siteUrl}/insights/rss.xml`,
      },
    },
  };
}

function InsightsIndexFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="h-10 w-48 animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-4 h-5 max-w-xl animate-pulse rounded-pill bg-blue-soft" />
      </Container>
    </div>
  );
}

async function InsightsIndexContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Insights");
  const breadcrumbT = await getTranslations("Breadcrumb");
  const posts = await getAllPosts(locale);
  const tags = collectPostTags(posts);

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <Breadcrumbs
          label={breadcrumbT("label")}
          items={[
            { label: breadcrumbT("home"), href: "/" },
            { label: t("list.title") },
          ]}
        />
        <Eyebrow className="mt-6">{t("list.eyebrow")}</Eyebrow>
        <Heading as={1} className="mt-3 max-w-[15ch]">
          {t("list.title")}
        </Heading>
        <Text variant="muted" className="mt-3 max-w-2xl">
          {t("list.lead")}
        </Text>

        <div className="mt-10">
          <InsightsFilter
            posts={posts}
            tags={tags}
            labels={{
              all: t("filter.all"),
              tagsLabel: t("filter.tags"),
              searchLabel: t("filter.search"),
              searchPlaceholder: t("filter.searchPlaceholder"),
              empty: t("empty"),
              emptyFiltered: t("emptyFiltered"),
              loadMore: t("loadMore"),
              featured: t("featured"),
            }}
          />
        </div>
      </Container>
    </div>
  );
}

export default function InsightsIndexPage({ params }: Props) {
  return (
    <Suspense fallback={<InsightsIndexFallback />}>
      <InsightsIndexContent params={params} />
    </Suspense>
  );
}
