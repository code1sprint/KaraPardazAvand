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
import { getResolvedHomeData } from "@/lib/home-data";
import type { AppLocale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const homeData = await getResolvedHomeData(locale as AppLocale);

  return buildPageMetadata({
    locale,
    path: "/",
    title: homeData.seo?.homeTitle || t("pages.home.title"),
    description: homeData.seo?.homeDescription || t("pages.home.description"),
    siteName: homeData.seo?.siteName || t("siteName"),
    imageAlt: homeData.seo?.ogImageAlt || t("ogImageAlt"),
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
