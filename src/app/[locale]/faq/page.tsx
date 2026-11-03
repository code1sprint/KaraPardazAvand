import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout";
import { FaqIndex } from "@/components/faq/FaqIndex";
import { PageSoftCta } from "@/components/sections/PageSoftCta";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Container,
  Eyebrow,
  Heading,
  Section,
  Text,
} from "@/components/ui";
import { resolveFaqItems, resolveFaqTopics } from "@/content/faq";
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
    path: "/faq",
    title: t("pages.faq.title"),
    description: t("pages.faq.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
  });
}

function FaqFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="h-10 w-48 animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
        <div className="mt-4 h-5 max-w-xl animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
      </Container>
    </div>
  );
}

async function FaqContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appLocale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Faq");
  const breadcrumbT = await getTranslations("Breadcrumb");
  const topics = resolveFaqTopics(appLocale);
  const allItems = resolveFaqItems(appLocale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Section
        aria-labelledby="faq-hero-heading"
        className="pb-0 pt-12 sm:pt-16"
      >
        <Container>
          <Breadcrumbs
            label={breadcrumbT("label")}
            items={[
              { label: breadcrumbT("home"), href: "/" },
              { label: t("page.breadcrumb") },
            ]}
          />
          <Eyebrow className="mt-6">{t("page.eyebrow")}</Eyebrow>
          <Heading
            as={1}
            id="faq-hero-heading"
            className="mt-3 max-w-[18ch] text-[clamp(2rem,4.5vw,3rem)]"
          >
            {t("page.titleBefore")}
            <em className="text-gradient-brand not-italic">
              {t("page.titleGradient")}
            </em>
            {t("page.titleAfter")}
          </Heading>
          <Text variant="muted" className="mt-4 max-w-2xl">
            {t("page.lead")}
          </Text>
        </Container>
      </Section>

      <Section aria-labelledby="faq-list-heading" className="pt-10 sm:pt-12">
        <Container>
          <h2 id="faq-list-heading" className="sr-only">
            {t("page.listHeading")}
          </h2>
          <FaqIndex topics={topics} />
        </Container>
      </Section>

      <PageSoftCta
        headingId="faq-soft-cta"
        title={t("page.ctaTitle")}
        lead={t("page.ctaLead")}
        buttonLabel={t("page.ctaButton")}
      />

      {allItems.length > 0 ? <JsonLd data={jsonLd} /> : null}
    </>
  );
}

export default function FaqPage({ params }: Props) {
  return (
    <Suspense fallback={<FaqFallback />}>
      <FaqContent params={params} />
    </Suspense>
  );
}
