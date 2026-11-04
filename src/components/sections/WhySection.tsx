import { getLocale, getTranslations } from "next-intl/server";
import { Band } from "@/components/layout/Band";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { TriMarker } from "@/components/ui/TriMarker";
import { getResolvedHomeData } from "@/lib/home-data";
import { cn } from "@/lib/cn";
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
  const homeData = await getResolvedHomeData(locale);
  const statements = homeData.whyStatements;

  if (statements.length === 0) return null;

  const onBand = surface === "band";

  const body = (
    <Reveal>
      <div className="flex flex-col gap-10 lg:gap-12">
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

        <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {statements.map((statement, idx) => (
            <li
              key={statement.id}
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-[22px] p-6 text-start sm:p-7",
                "transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                onBand
                  ? "border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] motion-safe:hover:-translate-y-1 motion-safe:hover:border-white/20 motion-safe:hover:bg-white/[0.07] motion-safe:hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)]"
                  : "border border-line bg-panel shadow-sm motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-md",
              )}
            >
              {onBand ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              ) : null}

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "font-mono text-xs font-semibold tracking-wider",
                      onBand ? "text-sky-300/80" : "text-blue",
                    )}
                  >
                    0{idx + 1}
                  </span>
                  <TriMarker />
                </div>

                <Heading
                  as={3}
                  className={cn(
                    "text-lg font-bold sm:text-xl",
                    onBand ? "text-on-brand" : "text-text",
                  )}
                >
                  {statement.title}
                </Heading>

                <Text
                  variant="muted"
                  className={cn(
                    "text-sm leading-relaxed",
                    onBand ? "text-band-muted" : "text-muted",
                  )}
                >
                  {statement.body}
                </Text>
              </div>
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
