import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { CommunicationRows } from "@/components/sections/CommunicationRows";
import { EngagementModels } from "@/components/sections/EngagementModels";
import { FaqSection } from "@/components/sections/FaqSection";
import { PageSoftCta } from "@/components/sections/PageSoftCta";
import { ProcessVerticalTrack } from "@/components/sections/ProcessVerticalTrack";
import {
  Container,
  Eyebrow,
  Heading,
  Text,
} from "@/components/ui";
import { getProcessSteps } from "@/content/process";
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
  const steps = getProcessSteps(appLocale);

  return (
    <div className="[--section-pad-y:var(--section-pad-y-dense)] min-[900px]:[--section-pad-y:var(--section-pad-y-dense-lg)]">
      <Section
        aria-labelledby="process-hero-heading"
        className="pb-0 pt-12 sm:pt-16"
      >
        <Container>
          <Breadcrumbs
            label={breadcrumbT("label")}
            items={[
              { label: breadcrumbT("home"), href: "/" },
              { label: pageT("breadcrumb") },
            ]}
          />
          <Eyebrow className="mt-6">{pageT("eyebrow")}</Eyebrow>
          <Heading
            as={1}
            id="process-hero-heading"
            className="mt-3 max-w-[15ch]"
          >
            {pageT("titleBefore")}
            <em className="text-gradient-brand not-italic">
              {pageT("titleGradient")}
            </em>
            {pageT("titleAfter")}
          </Heading>
          <Text variant="muted" className="mt-4 max-w-2xl">
            {pageT("lead")}
          </Text>
        </Container>
      </Section>

      {steps.length > 0 ? (
        <Section id="steps" aria-labelledby="process-steps-heading">
          <Container>
            <Reveal>
              <div className="mb-8 max-w-2xl md:mb-10">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <Heading as={2} id="process-steps-heading">
                  {pageT("stepsTitle")}
                </Heading>
                <Text variant="muted" className="mt-3">
                  {pageT("stepsLead")}
                </Text>
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

      <FaqSection
        id="process-faq"
        itemIds={["duration", "process", "support", "modernize"]}
        emitJsonLd={false}
        showViewAll
      />

      <PageSoftCta
        headingId="process-soft-cta"
        title={pageT("ctaTitle")}
        lead={pageT("ctaLead")}
        buttonLabel={pageT("ctaButton")}
      />
    </div>
  );
}

export default function ProcessPage({ params }: Props) {
  return (
    <Suspense fallback={<ProcessFallback />}>
      <ProcessContent params={params} />
    </Suspense>
  );
}
