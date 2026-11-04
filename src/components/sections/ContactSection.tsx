import { getTranslations } from "next-intl/server";
import { getAlternateContactChannel } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container, Heading, Section, Text } from "@/components/ui";

export async function ContactSection() {
  const t = await getTranslations("Contact");
  const alternate = getAlternateContactChannel();
  const alternateLabel = alternate
    ? t(`details.channels.${alternate.kind}`)
    : null;

  return (
    <Section id="contact" aria-labelledby="contact-heading">
      <Container>
        <Heading as={2} id="contact-heading">
          {t("section.title")}
        </Heading>
        <Text variant="muted" className="mt-3">
          {t("section.lead")}
        </Text>
        <div className="relative mt-8">
          <ContactForm
            idPrefix="home-contact"
            compact
            alternateChannelHref={alternate?.href ?? null}
            alternateChannelLabel={alternateLabel}
          />
        </div>
      </Container>
    </Section>
  );
}
