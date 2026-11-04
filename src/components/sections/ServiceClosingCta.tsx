import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export type ServiceClosingCtaProps = {
  /** Service slug for `/contact?service=<slug>`. */
  serviceSlug: string;
  serviceTitle: string;
};

/**
 * Soft page-level nudge with service pre-selected.
 * Footer keeps the navy Band CTA without duplicating it here.
 */
export async function ServiceClosingCta({
  serviceSlug,
  serviceTitle,
}: ServiceClosingCtaProps) {
  const t = await getTranslations("Services.detail");

  return (
    <Section aria-labelledby="service-cta-heading" className="pb-12 sm:pb-16">
      <Container>
        <div className="flex flex-col items-start gap-4 rounded-tile border border-line bg-panel px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="max-w-xl">
            <Heading as={2} id="service-cta-heading" className="text-xl sm:text-2xl">
              {t("ctaTitle")}
            </Heading>
            <Text variant="muted" className="mt-2">
              {t("ctaLead", { service: serviceTitle })}
            </Text>
          </div>
          <ButtonLink
            href={`/contact?service=${encodeURIComponent(serviceSlug)}`}
            size="md"
            className="shrink-0"
          >
            {t("ctaButton")}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
