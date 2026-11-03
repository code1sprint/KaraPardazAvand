import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  FaqSection,
  FeaturedProjects,
  HeroSection,
  InsightsTeaser,
  ProcessSection,
  ServicesSection,
  TrustStrip,
  WhySection,
} from "@/components/sections";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return buildPageMetadata({
    locale,
    path: "/",
    title: t("pages.home.title"),
    description: t("pages.home.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
    absoluteTitle: true,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <TrustStrip />
      <WhySection />
      <FeaturedProjects />
      <ProcessSection showDetailsLink />
      <InsightsTeaser />
      <FaqSection limit={4} showViewAll />
    </>
  );
}
