import { getLocale, getTranslations } from "next-intl/server";
import { Reveal } from "@/components/layout/Reveal";
import { ServicesBento } from "@/components/sections/ServicesBento";
import { ServiceSelector } from "@/components/sections/ServiceSelector";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/layout/Section";
import { Text } from "@/components/ui/Text";
import type { AppLocale } from "@/i18n/routing";

export type ServicesSectionProps = {
  /** Compact overview route: H1 + bento + selector. */
  asPage?: boolean;
};

export async function ServicesSection({ asPage = false }: ServicesSectionProps) {
  const t = await getTranslations("Services");
  const locale = (await getLocale()) as AppLocale;

  if (asPage) {
    return (
      <Section aria-labelledby="services-heading" className="py-0">
        <Container className="flex flex-col gap-12 sm:gap-16">
          <div className="flex max-w-2xl flex-col gap-3">
            <Heading as={1} id="services-heading">
              {t("page.title")}
            </Heading>
            <Text variant="muted">{t("page.lead")}</Text>
          </div>

          <div className="flex flex-col gap-6">
            <Reveal>
              <div className="flex max-w-2xl flex-col gap-2">
                <Eyebrow>{t("eyebrow")}</Eyebrow>
                <Heading as={2}>{t("title")}</Heading>
              </div>
            </Reveal>
            <ServicesBento locale={locale} />
          </div>

          <ServiceSelector />
        </Container>
      </Section>
    );
  }

  return (
    <Section id="services" aria-labelledby="services-heading">
      <Container className="flex flex-col gap-8">
        <Reveal>
          <div className="flex max-w-2xl flex-col gap-3">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <Heading as={2} id="services-heading">
              {t("title")}
            </Heading>
            <Text variant="muted">{t("lead")}</Text>
          </div>
        </Reveal>

        <ServicesBento locale={locale} />
      </Container>
    </Section>
  );
}
