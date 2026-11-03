import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout";
import { AuthorBox } from "@/components/insights/AuthorBox";
import { ReadingProgress } from "@/components/insights/ReadingProgress";
import { RelatedPosts } from "@/components/insights/RelatedPosts";
import { TableOfContents } from "@/components/insights/TableOfContents";
import { PageSoftCta } from "@/components/sections/PageSoftCta";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Chip,
  Container,
  Heading,
  Prose,
  Text,
} from "@/components/ui";
import {
  getPostBySlug,
  getPostSlugs,
  getRelatedPosts,
} from "@/content/posts";
import { getSiteUrl } from "@/content/site";
import { brandAssets } from "@/lib/brand";
import { compileMdxSource } from "@/lib/mdx";
import { routing } from "@/i18n/routing";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const results = await Promise.all(
    routing.locales.map(async (locale) => {
      const slugs = await getPostSlugs(locale);
      const effectiveSlugs = slugs.length > 0 ? slugs : ["__none__"];
      return effectiveSlugs.map((slug) => ({ locale, slug }));
    }),
  );
  return results.flat();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const post = await getPostBySlug(slug, locale);
  const siteUrl = getSiteUrl().replace(/\/$/, "");

  if (!post) {
    return buildPageMetadata({
      locale,
      path: `/insights/${slug}`,
      title: t("pages.insights.title"),
      description: t("pages.insights.description"),
      siteName: t("siteName"),
      imageAlt: t("ogImageAlt"),
      noIndex: true,
    });
  }

  const imageUrl = post.meta.cover
    ? post.meta.cover.startsWith("http")
      ? post.meta.cover
      : `${siteUrl}${post.meta.cover.startsWith("/") ? "" : "/"}${post.meta.cover}`
    : undefined;

  const base = buildPageMetadata({
    locale,
    path: `/insights/${slug}`,
    title: post.meta.title,
    description: post.meta.summary,
    siteName: t("siteName"),
    imageAlt: post.meta.title,
    imageUrl,
    type: "article",
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.meta.dateIso,
      modifiedTime: post.meta.updatedIso ?? post.meta.dateIso,
      authors: [post.meta.author],
      tags: post.meta.tags,
    },
  };
}

function InsightPostFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="h-8 w-40 animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-6 h-12 max-w-2xl animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-4 h-20 max-w-xl animate-pulse rounded-pill bg-blue-soft" />
      </Container>
    </div>
  );
}

async function InsightPostContent({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(slug, locale);
  if (!post) {
    notFound();
  }

  const t = await getTranslations("Insights");
  const metaT = await getTranslations("Meta");
  const breadcrumbT = await getTranslations("Breadcrumb");

  let articleContent: React.ReactNode = null;
  let effectiveToc: Array<{ id: string; title: string; depth: 2 | 3 }> = [];

  if (post.contentHtml) {
    articleContent = (
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    );
    effectiveToc = (post.toc || []).map((item) => ({
      id: item.id,
      title: item.title,
      depth: (item.depth === 3 ? 3 : 2) as 2 | 3,
    }));
  } else {
    const compiled = await compileMdxSource(post.content);
    articleContent = compiled.content;
    effectiveToc = compiled.toc;
  }

  const related = await getRelatedPosts(slug, 3, locale);

  const canonical = absoluteUrl(locale, `/insights/${slug}`);
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const orgId = `${siteUrl}/#organization`;
  const logoUrl = `${siteUrl}${brandAssets.logo}`;
  const coverUrl = post.meta.cover
    ? post.meta.cover.startsWith("http")
      ? post.meta.cover
      : `${siteUrl}${post.meta.cover.startsWith("/") ? "" : "/"}${post.meta.cover}`
    : undefined;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.summary,
    datePublished: post.meta.dateIso,
    dateModified: post.meta.updatedIso ?? post.meta.dateIso,
    author: {
      "@type": "Organization",
      name: post.meta.author,
    },
    publisher: {
      "@type": "Organization",
      "@id": orgId,
      name: metaT("organizationName"),
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
    mainEntityOfPage: canonical,
    inLanguage: locale === "fa" ? "fa-IR" : "en-US",
    keywords: post.meta.tags.join(", "),
    ...(coverUrl ? { image: [coverUrl] } : {}),
  };

  return (
    <>
      <ReadingProgress label={t("detail.readingProgress")} />
      <JsonLd data={articleJsonLd} />

      <div className="py-12 sm:py-16">
        <Container>
          <Breadcrumbs
            label={breadcrumbT("label")}
            items={[
              { label: breadcrumbT("home"), href: "/" },
              { label: t("list.title"), href: "/insights" },
              { label: post.meta.title },
            ]}
          />

          <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <time dateTime={post.meta.dateIso} className="text-sm text-muted">
              {post.meta.dateIso}
            </time>
            {post.meta.updatedIso &&
            post.meta.updatedIso !== post.meta.dateIso ? (
              <Text variant="caption" as="span">
                {t("detail.updated", { date: post.meta.updatedIso })}
              </Text>
            ) : null}
            <Text variant="caption" as="span">
              {post.meta.readingTime}
            </Text>
          </div>

          <Heading as={1} className="mt-3 max-w-[20ch]">
            {post.meta.title}
          </Heading>
          <Text variant="muted" className="mt-4 max-w-2xl">
            {post.meta.summary}
          </Text>

          {post.meta.tags.length > 0 ? (
            <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
              {post.meta.tags.map((tag) => (
                <li key={tag}>
                  <Chip tone="panel">{tag}</Chip>
                </li>
              ))}
            </ul>
          ) : null}

          {post.meta.cover ? (
            <div className="relative mt-8 aspect-[16/9] max-w-3xl overflow-hidden rounded-tile border border-line bg-panel">
              <Image
                src={post.meta.cover}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 48rem"
                priority
              />
            </div>
          ) : null}

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <article id="insight-article" className="min-w-0">
              <Prose>{articleContent}</Prose>
              <AuthorBox
                author={post.meta.author}
                label={t("detail.author")}
              />
              <RelatedPosts
                posts={related}
                title={t("detail.related")}
                lead={t("detail.relatedLead")}
              />
            </article>
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <TableOfContents items={effectiveToc} label={t("detail.toc")} />
            </aside>
          </div>
        </Container>
      </div>

      <PageSoftCta
        headingId="insights-soft-cta"
        title={t("ctaTitle")}
        lead={t("ctaLead")}
        buttonLabel={t("ctaButton")}
      />
    </>
  );
}

export default function InsightPostPage({ params }: Props) {
  return (
    <Suspense fallback={<InsightPostFallback />}>
      <InsightPostContent params={params} />
    </Suspense>
  );
}
