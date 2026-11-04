import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { Container } from "@/components/ui";
import { getLegalDoc as getMdxLegalDoc } from "@/content/legal";
import { compileMdxSource } from "@/lib/mdx";
import {
  getResolvedLegalDoc,
  getAllLegalSlugs,
} from "@/lib/legal-data";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllLegalSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const pageKey = slug === "privacy" ? "privacy" : "terms";
  const doc = await getResolvedLegalDoc(slug, locale as AppLocale);

  return buildPageMetadata({
    locale,
    path: `/${slug}`,
    title: doc?.title ?? t(`pages.${pageKey}.title`),
    description: doc?.summary || t(`pages.${pageKey}.description`),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
    noIndex: true,
  });
}

function LegalFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container narrow>
        <div className="h-10 w-48 animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-4 h-5 max-w-md animate-pulse rounded-pill bg-blue-soft" />
      </Container>
    </div>
  );
}

async function LegalContent({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const doc = await getResolvedLegalDoc(slug, locale as AppLocale);
  if (!doc) {
    notFound();
  }

  const t = await getTranslations("Legal");
  const breadcrumbT = await getTranslations("Breadcrumb");

  const crumbLabel =
    slug === "privacy"
      ? t("privacyTitle")
      : slug === "terms"
        ? t("termsTitle")
        : doc.title;

  if (doc.html) {
    return (
      <LegalDocument
        title={doc.title}
        summary={doc.summary}
        updatedIso={doc.updatedIso}
        updatedLabel={
          doc.updatedIso ? t("updated", { date: doc.updatedIso }) : ""
        }
        tocLabel={t("toc")}
        toc={doc.toc}
        breadcrumbLabel={breadcrumbT("label")}
        homeLabel={breadcrumbT("home")}
        crumbLabel={crumbLabel}
      >
        <div
          className="prose prose-slate max-w-none text-text text-start leading-relaxed font-normal [&_p]:mb-4 [&_p]:leading-relaxed [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:mb-4 [&_li]:mb-1.5"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </LegalDocument>
    );
  }

  // Fallback to MDX compilation if HTML is not populated
  const mdxDoc = await getMdxLegalDoc(slug);
  if (!mdxDoc) {
    notFound();
  }

  const { content, toc } = await compileMdxSource(mdxDoc.content);

  return (
    <LegalDocument
      title={doc.title}
      summary={doc.summary}
      updatedIso={doc.updatedIso}
      updatedLabel={
        doc.updatedIso ? t("updated", { date: doc.updatedIso }) : ""
      }
      tocLabel={t("toc")}
      toc={toc}
      breadcrumbLabel={breadcrumbT("label")}
      homeLabel={breadcrumbT("home")}
      crumbLabel={crumbLabel}
    >
      {content}
    </LegalDocument>
  );
}

export default function LegalPage({ params }: Props) {
  return (
    <Suspense fallback={<LegalFallback />}>
      <LegalContent params={params} />
    </Suspense>
  );
}
