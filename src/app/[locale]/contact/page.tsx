import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout";
import {
  ContactDetails,
  getAlternateContactChannel,
} from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  Container,
  Eyebrow,
  Heading,
  Section,
  Text,
} from "@/components/ui";
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
    path: "/contact",
    title: t("pages.contact.title"),
    description: t("pages.contact.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
  });
}

function ContactFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="h-10 w-40 animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
        <div className="mt-4 h-5 max-w-md animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
      </Container>
    </div>
  );
}

async function ContactContent({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");
  const breadcrumbT = await getTranslations("Breadcrumb");
  const alternate = getAlternateContactChannel();
  const alternateLabel = alternate
    ? t(`details.channels.${alternate.kind}`)
    : null;

  return (
    <>
      <Section
        aria-labelledby="contact-hero-heading"
        className="pb-0 pt-12 sm:pt-16"
      >
        <Container>
          <Breadcrumbs
            label={breadcrumbT("label")}
            items={[
              { label: breadcrumbT("home"), href: "/" },
              { label: t("page.title") },
            ]}
          />
          <Eyebrow className="mt-6">{t("page.eyebrow")}</Eyebrow>
          <Heading
            as={1}
            id="contact-hero-heading"
            className="mt-3 max-w-[16ch] text-[clamp(2rem,4.5vw,3rem)]"
          >
            {t("page.titleBefore")}
            <em className="text-gradient-brand not-italic">
              {t("page.titleGradient")}
            </em>
            {t("page.titleAfter")}
          </Heading>
          <Text variant="muted" className="mt-4 max-w-2xl">
            {t("page.lead")}
          </Text>
        </Container>
      </Section>

      <Section aria-labelledby="contact-form-heading" className="pt-10 sm:pt-12">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Heading as={2} id="contact-form-heading" className="text-xl sm:text-2xl">
                {t("page.formTitle")}
              </Heading>
              <Text variant="muted" className="mt-2">
                {t("page.formLead")}
              </Text>
              <div className="relative mt-8">
                <ContactForm
                  idPrefix="page-contact"
                  alternateChannelHref={alternate?.href ?? null}
                  alternateChannelLabel={alternateLabel}
                />
              </div>
            </div>
            <div className="lg:col-span-5">
              <ContactDetails />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}

export default function ContactPage({ params }: Props) {
  return (
    <Suspense fallback={<ContactFallback />}>
      <ContactContent params={params} />
    </Suspense>
  );
}
