import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { Container } from "@/components/ui";
import { getLegalDoc as getMdxLegalDoc } from "@/content/legal";
import { compileMdxSource } from "@/lib/mdx";
import { getResolvedLegalDoc } from "@/lib/legal-data";
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
  const doc = await getResolvedLegalDoc("terms", locale as AppLocale);

  return buildPageMetadata({
    locale,
    path: "/terms",
    title: doc?.title ?? t("pages.terms.title"),
    description: doc?.summary || t("pages.terms.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
  });
}

function TermsFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container narrow>
        <div className="h-10 w-48 animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-4 h-5 max-w-md animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-10 h-40 animate-pulse rounded-tile bg-blue-soft" />
      </Container>
    </div>
  );
}

async function TermsContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const doc = await getResolvedLegalDoc("terms", locale as AppLocale);
  if (!doc) {
    notFound();
  }

  const t = await getTranslations("Legal");
  const breadcrumbT = await getTranslations("Breadcrumb");

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
        crumbLabel={t("termsTitle")}
      >
        <div
          className="prose prose-slate max-w-none text-text text-start leading-relaxed font-normal [&_p]:mb-4 [&_p]:leading-relaxed [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:mb-4 [&_li]:mb-1.5"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </LegalDocument>
    );
  }

  const mdxDoc = await getMdxLegalDoc("terms");
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
      crumbLabel={t("termsTitle")}
    >
      {content}
    </LegalDocument>
  );
}

export default function TermsPage({ params }: Props) {
  return (
    <Suspense fallback={<TermsFallback />}>
      <TermsContent params={params} />
    </Suspense>
  );
}
