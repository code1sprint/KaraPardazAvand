import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs, PageHero } from "@/components/layout";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { CommunicationRows } from "@/components/sections/CommunicationRows";
import { EngagementModels } from "@/components/sections/EngagementModels";
import { FaqSection } from "@/components/sections/FaqSection";
import { ProcessVerticalTrack } from "@/components/sections/ProcessVerticalTrack";
import {
  Container,
  Heading,
} from "@/components/ui";
import { getResolvedProcessData } from "@/lib/process-data";
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
    path: "/process",
    title: t("pages.process.title"),
    description: t("pages.process.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
  });
}

function ProcessFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="h-10 w-56 animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
        <div className="mt-4 h-5 max-w-xl animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
      </Container>
    </div>
  );
}

async function ProcessContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const appLocale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Process");
  const pageT = await getTranslations("ProcessPage");
  const breadcrumbT = await getTranslations("Breadcrumb");
  const processData = await getResolvedProcessData(appLocale);
  const steps = processData.steps;
  const hero = processData.hero;
  const guide = processData.guide;

  return (
    <>
      <PageHero
        id="process-hero"
        headingId="process-hero-heading"
        breadcrumbs={
          <Breadcrumbs
            label={breadcrumbT("label")}
            items={[
              { label: breadcrumbT("home"), href: "/" },
              { label: pageT("breadcrumb") },
            ]}
          />
        }
        eyebrow={pageT("eyebrow")}
        title={
          <>
            {hero?.titleBefore || pageT("titleBefore")}
            <em className="text-gradient-brand not-italic">
              {hero?.titleGradient || pageT("titleGradient")}
            </em>
            {hero?.titleAfter || pageT("titleAfter")}
          </>
        }
        lead={hero?.lead || pageT("lead")}
      />

      {steps.length > 0 ? (
        <Section id="steps" aria-labelledby="process-steps-heading">
          <Container>
            <Reveal>
              <div className="mb-8 max-w-2xl md:mb-10">
                <Heading as={2} id="process-steps-heading">
                  {pageT("stepsTitle")}
                </Heading>
              </div>
            </Reveal>
            <ProcessVerticalTrack
              steps={steps.map((step) => ({
                ...step,
                ariaLabel: t("stepAria", {
                  number: step.number,
                  title: step.title,
                }),
              }))}
              deliverablesLabel={t("deliverables")}
              clientLabel={t("clientInvolvement")}
              durationLabel={pageT("duration")}
            />
          </Container>
        </Section>
      ) : null}

      <EngagementModels />
      <CommunicationRows />

      {guide && guide.html ? (
        <Section id="process-guide" aria-labelledby="process-guide-heading">
          <Container>
            <Reveal>
              <div className="rounded-2xl border border-line bg-panel p-6 sm:p-10">
                <Heading
                  as={2}
                  id="process-guide-heading"
                  className="text-2xl sm:text-3xl"
                >
                  {guide.title}
                </Heading>
                <div
                  className="prose prose-slate mt-6 max-w-none text-text text-start leading-relaxed font-normal [&_p]:mb-4 [&_p]:leading-relaxed [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:font-black [&>*:last-child]:!mb-0"
                  dangerouslySetInnerHTML={{ __html: guide.html }}
                />
              </div>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <FaqSection
        id="process-faq"
        itemIds={["duration", "process", "support", "modernize"]}
        emitJsonLd={false}
        showViewAll
      />
    </>
  );
}

export default function ProcessPage({ params }: Props) {
  return (
    <Suspense fallback={<ProcessFallback />}>
      <ProcessContent params={params} />
    </Suspense>
  );
}
