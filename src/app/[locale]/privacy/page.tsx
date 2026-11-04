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
  const doc = await getResolvedLegalDoc("privacy", locale as AppLocale);

  return buildPageMetadata({
    locale,
    path: "/privacy",
    title: doc?.title ?? t("pages.privacy.title"),
    description: doc?.summary || t("pages.privacy.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
  });
}

function PrivacyFallback() {
  return (
    <div className="pt-[length:var(--hero-top)]">
      <Container prose>
        <div className="h-10 w-48 animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-4 h-5 max-w-md animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-10 h-40 animate-pulse rounded-tile bg-blue-soft" />
      </Container>
    </div>
  );
}

async function PrivacyContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const doc = await getResolvedLegalDoc("privacy", locale as AppLocale);
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
        crumbLabel={t("privacyTitle")}
      >
        <div
          className="prose prose-slate max-w-none text-text text-start leading-relaxed font-normal [&_p]:mb-4 [&_p]:leading-relaxed [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:mb-4 [&_li]:mb-1.5 [&>*:last-child]:!mb-0"
          dangerouslySetInnerHTML={{ __html: doc.html }}
        />
      </LegalDocument>
    );
  }

  const mdxDoc = await getMdxLegalDoc("privacy");
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
      crumbLabel={t("privacyTitle")}
    >
      {content}
    </LegalDocument>
  );
}

export default function PrivacyPage({ params }: Props) {
  return (
    <Suspense fallback={<PrivacyFallback />}>
      <PrivacyContent params={params} />
    </Suspense>
  );
}
