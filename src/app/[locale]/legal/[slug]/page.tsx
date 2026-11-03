import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { Container } from "@/components/ui";
import {
  getLegalDoc,
  getLegalSlugs,
  isLegalSlug,
} from "@/content/legal";
import { compileMdxSource } from "@/lib/mdx";
import { routing } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const slugs = getLegalSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const pageKey = slug === "privacy" ? "privacy" : "terms";
  const doc = isLegalSlug(slug) ? await getLegalDoc(slug) : null;

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

  if (!isLegalSlug(slug)) {
    notFound();
  }

  const doc = await getLegalDoc(slug);
  if (!doc) {
    notFound();
  }

  const t = await getTranslations("Legal");
  const breadcrumbT = await getTranslations("Breadcrumb");
  const { content, toc } = await compileMdxSource(doc.content);

  const crumbLabel =
    slug === "privacy" ? t("privacyTitle") : t("termsTitle");

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
