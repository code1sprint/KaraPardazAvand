import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout";
import { Section } from "@/components/layout/Section";
import { AboutBrandDiagram } from "@/components/sections/AboutBrandDiagram";
import { AboutCulture } from "@/components/sections/AboutCulture";
import { AboutPrinciplesBand } from "@/components/sections/AboutPrinciplesBand";
import { AboutTeam } from "@/components/sections/AboutTeam";
import { PageSoftCta } from "@/components/sections/PageSoftCta";
import {
  Container,
  Eyebrow,
  Heading,
  Text,
} from "@/components/ui";
import { getResolvedAboutData } from "@/lib/about-data";
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
    path: "/about",
    title: t("pages.about.title"),
    description: t("pages.about.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
  });
}

function AboutFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="h-10 w-56 animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
        <div className="mt-4 h-5 max-w-xl animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
      </Container>
    </div>
  );
}

async function AboutContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appLocale = (await getLocale()) as AppLocale;
  const t = await getTranslations("About");
  const breadcrumbT = await getTranslations("Breadcrumb");
  const aboutData = await getResolvedAboutData(appLocale);
  const intro = aboutData.intro;
  const story = aboutData.story;

  return (
    <>
      <Section
        aria-labelledby="about-hero-heading"
        className="pb-0 pt-12 sm:pt-16"
      >
        <Container>
          <Breadcrumbs
            label={breadcrumbT("label")}
            items={[
              { label: breadcrumbT("home"), href: "/" },
              { label: t("breadcrumb") },
            ]}
          />
          <Eyebrow className="mt-6">{t("eyebrow")}</Eyebrow>
          <Heading
            as={1}
            id="about-hero-heading"
            className="mt-3 max-w-[18ch]"
          >
            {intro.title}
          </Heading>
          <Text variant="muted" className="mt-4 max-w-2xl">
            {intro.lead}
          </Text>

          {story ? (
            <section className="mt-12 max-w-3xl" aria-labelledby="about-story">
              <Heading as={2} id="about-story" className="text-2xl sm:text-3xl">
                {story.title}
              </Heading>
              {story.html ? (
                <div
                  className="prose prose-slate mt-6 max-w-none text-text text-start leading-relaxed font-normal [&_p]:mb-4 [&_p]:leading-relaxed [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:font-black"
                  dangerouslySetInnerHTML={{ __html: story.html }}
                />
              ) : (
                <Text className="mt-4">{story.body}</Text>
              )}
            </section>
          ) : null}
        </Container>
      </Section>

      <AboutPrinciplesBand />
      <AboutBrandDiagram />
      <AboutTeam />
      <AboutCulture />

      <PageSoftCta
        headingId="about-soft-cta"
        title={t("ctaTitle")}
        lead={t("ctaLead")}
        buttonLabel={t("ctaButton")}
      />
    </>
  );
}

export default function AboutPage({ params }: Props) {
  return (
    <Suspense fallback={<AboutFallback />}>
      <AboutContent params={params} />
    </Suspense>
  );
}
