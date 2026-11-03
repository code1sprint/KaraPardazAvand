import { getLocale, getTranslations } from "next-intl/server";
import { Band } from "@/components/layout/Band";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { TriMarker } from "@/components/ui/TriMarker";
import { pickLocalized } from "@/content/services";
import { whyStatements } from "@/content/why";
import type { AppLocale } from "@/i18n/routing";

export type WhySectionProps = {
  headingAs?: 2 | 3;
  id?: string;
  titleOverride?: string;
  leadOverride?: string;
  /** Navy brand band (home default). Plain section for nested pages. */
  surface?: "band" | "plain";
};

export async function WhySection({
  headingAs = 2,
  id = "why",
  titleOverride,
  leadOverride,
  surface = "band",
}: WhySectionProps = {}) {
  const t = await getTranslations("Why");
  const locale = (await getLocale()) as AppLocale;

  if (whyStatements.length === 0) return null;

  const onBand = surface === "band";

  const body = (
    <Reveal>
      <div className="flex flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <Eyebrow className={onBand ? "text-amber" : undefined}>
            {t("eyebrow")}
          </Eyebrow>
          <Heading
            as={headingAs}
            id={`${id}-heading`}
            className={onBand ? "text-on-brand" : undefined}
          >
            {titleOverride ?? t("title")}
          </Heading>
          <Text
            variant="muted"
            className={onBand ? "text-band-muted" : undefined}
          >
            {leadOverride ?? t("lead")}
          </Text>
        </div>

        <ul className="m-0 grid list-none gap-10 p-0 sm:grid-cols-3">
          {whyStatements.map((statement) => (
            <li key={statement.id} className="flex flex-col gap-2 text-start">
              <div className="flex items-start gap-2.5">
                <TriMarker className="mt-1.5" />
                <Heading
                  as={3}
                  className={
                    onBand
                      ? "text-lg font-semibold text-on-brand sm:text-xl"
                      : "text-lg font-semibold sm:text-xl"
                  }
                >
                  {pickLocalized(statement.title, locale)}
                </Heading>
              </div>
              <Text
                variant="muted"
                className={onBand ? "ps-[22px] text-band-muted" : "ps-[22px]"}
              >
                {pickLocalized(statement.body, locale)}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );

  if (surface === "plain") {
    return (
      <Section id={id} aria-labelledby={`${id}-heading`}>
        <Container>{body}</Container>
      </Section>
    );
  }

  return (
    <Band id={id} aria-labelledby={`${id}-heading`}>
      {body}
    </Band>
  );
}
