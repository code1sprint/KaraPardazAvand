import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout";
import { ServicesSection } from "@/components/sections";
import { Container } from "@/components/ui";
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
    <div className="py-12 sm:py-16">
      <Container>
        <div className="h-10 w-48 animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
        <div className="mt-4 h-5 max-w-xl animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
      </Container>
    </div>
  );
}

async function ServicesIndexContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Services");
  const breadcrumbT = await getTranslations("Breadcrumb");

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <Breadcrumbs
          label={breadcrumbT("label")}
          items={[
            { label: breadcrumbT("home"), href: "/" },
            { label: t("page.title") },
          ]}
        />
      </Container>
      <div className="mt-6">
        <ServicesSection asPage />
      </div>
    </div>
  );
}

export default function ServicesIndexPage({ params }: Props) {
  return (
    <Suspense fallback={<ServicesIndexFallback />}>
      <ServicesIndexContent params={params} />
    </Suspense>
  );
}
