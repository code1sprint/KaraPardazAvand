import { getLocale, getTranslations } from "next-intl/server";
import { getProcessSteps } from "@/content/process";
import type { AppLocale } from "@/i18n/routing";
import { Reveal } from "@/components/layout/Reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading, Link, Text } from "@/components/ui";
import { ProcessTimeline } from "./ProcessTimeline";

export type ProcessSectionProps = {
  /** Override the default lead (e.g. service-specific process variant). */
  leadOverride?: string;
  titleOverride?: string;
  headingAs?: 2 | 3;
  id?: string;
  /** Show link to full /process page (home). */
  showDetailsLink?: boolean;
};

export async function ProcessSection({
  leadOverride,
  titleOverride,
  headingAs = 2,
  id = "process",
  showDetailsLink = false,
}: ProcessSectionProps = {}) {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Process");
  const steps = getProcessSteps(locale);

  if (steps.length === 0) return null;

  return (
    <Section id={id} aria-labelledby={`${id}-heading`}>
      <Container>
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
            <div className="flex max-w-2xl flex-col gap-3">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <Heading as={headingAs} id={`${id}-heading`}>
                {titleOverride ?? t("title")}
              </Heading>
              <Text variant="muted">{leadOverride ?? t("lead")}</Text>
            </div>
            {showDetailsLink ? (
              <Link href="/process" variant="default">
                {t("detailsLink")}
              </Link>
            ) : null}
          </div>
        </Reveal>

        <ProcessTimeline
          steps={steps.map((step) => ({
            ...step,
            ariaLabel: t("stepAria", {
              number: step.number,
              title: step.title,
            }),
          }))}
          deliverablesLabel={t("deliverables")}
          clientLabel={t("clientInvolvement")}
          durationLabel={t("duration")}
        />
      </Container>
    </Section>
  );
}
