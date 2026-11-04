import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs, Container, PageHero, Reveal, Section } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { ServicesBento } from "@/components/sections/ServicesBento";
import { ServiceSelector } from "@/components/sections/ServiceSelector";
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
    path: "/services",
    title: t("pages.services.title"),
    description: t("pages.services.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
  });
}

function ServicesIndexFallback() {
  return (
    <div className="pt-[length:var(--hero-top)]">
      <Container>
        <div className="h-10 w-48 animate-pulse rounded-[var(--radius-button)] bg-blue-soft" />
        <div className="mt-4 h-5 max-w-xl animate-pulse rounded-[var(--radius-button)] bg-blue-soft" />
      </Container>
    </div>
  );
}

async function ServicesIndexContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Services");
  const breadcrumbT = await getTranslations("Breadcrumb");
  const appLocale = (await getLocale()) as AppLocale;

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            label={breadcrumbT("label")}
            items={[
              { label: breadcrumbT("home"), href: "/" },
              { label: t("page.title") },
            ]}
          />
        }
        title={t("page.title")}
        lead={t("page.lead")}
      />

      <Section id="services-bento" aria-labelledby="services-bento-heading">
        <Container className="flex flex-col gap-12 sm:gap-16">
          <div className="flex flex-col gap-6">
            <Reveal>
              <div className="flex max-w-2xl flex-col gap-2">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <Heading as={2} id="services-bento-heading">
                  {t("title")}
                </Heading>
              </div>
            </Reveal>
            <ServicesBento locale={appLocale} />
          </div>

          <ServiceSelector />
        </Container>
      </Section>
    </>
  );
}

export default function ServicesIndexPage({ params }: Props) {
  return (
    <Suspense fallback={<ServicesIndexFallback />}>
      <ServicesIndexContent params={params} />
    </Suspense>
  );
}
