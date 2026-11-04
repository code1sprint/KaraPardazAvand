import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout";
import { Reveal } from "@/components/layout/Reveal";
import { Section } from "@/components/layout/Section";
import { ServiceClosingCta } from "@/components/sections/ServiceClosingCta";
import { ServiceSteps } from "@/components/sections/ServiceSteps";
import { ServiceSystemMap } from "@/components/sections/ServiceSystemMap";
import { RelatedProjects } from "@/components/sections/RelatedProjects";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Accordion,
  ButtonLink,
  Chip,
  Container,
  Eyebrow,
  Heading,
  Text,
} from "@/components/ui";
import { Tile } from "@/components/visuals/Tile";
import {
  getServiceBySlug,
  pickLocalized,
  services,
} from "@/content/services";
import { getServiceDetail } from "@/lib/services";
import { getSiteUrl } from "@/content/site";
import type { AppLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { absoluteUrl, buildPageMetadata, isAppLocale } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  const t = await getTranslations({ locale, namespace: "Meta" });

  if (!service || !isAppLocale(locale)) {
    return buildPageMetadata({
      locale,
      path: `/services/${slug}`,
      title: t("pages.services.title"),
      description: t("pages.services.description"),
      siteName: t("siteName"),
      imageAlt: t("ogImageAlt"),
      noIndex: true,
    });
  }

  const title = pickLocalized(service.title, locale);
  const description = pickLocalized(service.outcome, locale);

  return buildPageMetadata({
    locale,
    path: `/services/${slug}`,
    title,
    description,
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
  });
}

function ServiceDetailFallback() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="h-8 w-48 animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
        <div className="mt-6 h-12 max-w-2xl animate-pulse rounded-[var(--radius-button)] bg-accent-soft" />
      </Container>
    </div>
  );
}

async function ServiceDetailContent({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const service = await getServiceDetail(slug);
  if (!service) {
    notFound();
  }

  const appLocale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Services");
  const breadcrumbT = await getTranslations("Breadcrumb");
  const title = pickLocalized(service.title, appLocale);
  const outcome = pickLocalized(service.outcome, appLocale);

  const faqItems = service.faqs.map((faq) => ({
    id: faq.id,
    title: pickLocalized(faq.question, appLocale),
    content: (
      <Text variant="muted" as="div">
        {pickLocalized(faq.answer, appLocale)}
      </Text>
    ),
  }));

  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const serviceUrl = absoluteUrl(appLocale, `/services/${service.slug}`);
  const orgId = `${siteUrl}/#organization`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: outcome,
    url: serviceUrl,
    provider: { "@id": orgId },
    serviceType: title,
    inLanguage: appLocale === "fa" ? "fa-IR" : "en-US",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: pickLocalized(faq.question, appLocale),
      acceptedAnswer: {
        "@type": "Answer",
        text: pickLocalized(faq.answer, appLocale),
      },
    })),
  };

  const deliverableCount = service.deliverables.length;
  function deliverableSpan(index: number): 2 | 3 | 6 {
    if (deliverableCount <= 4) return 3;
    if (deliverableCount === 5) return index < 3 ? 2 : 3;
    return 2;
  }

  return (
    <div className="[--section-pad-y:var(--section-pad-y-dense)] min-[900px]:[--section-pad-y:var(--section-pad-y-dense-lg)]">
      <JsonLd data={serviceJsonLd} />
      <Section aria-labelledby="service-hero-heading" className="pt-12 sm:pt-16">
        <Container className="flex flex-col gap-10">
          <div className="flex max-w-2xl flex-col gap-4">
            <Breadcrumbs
              label={breadcrumbT("label")}
              items={[
                { label: breadcrumbT("home"), href: "/" },
                { label: t("page.title"), href: "/services" },
                { label: title },
              ]}
            />
            <Heading as={1} id="service-hero-heading">
              {title}
            </Heading>
            <Text variant="muted" className="max-w-2xl text-[clamp(16px,1.5vw,18px)]">
              {outcome}
            </Text>
            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href={`/contact?service=${encodeURIComponent(service.slug)}`}
                variant="primary"
              >
                {t("detail.heroCtaPrimary")}
              </ButtonLink>
              <ButtonLink href="#service-process" variant="secondary">
                {t("detail.heroCtaSecondary")}
              </ButtonLink>
            </div>
          </div>

          <ServiceSystemMap
            locale={appLocale}
            map={service.systemMap}
            mapLabel={t("detail.mapLabel", { service: title })}
            animationKey={service.slug}
          />
        </Container>
      </Section>

      <Section aria-labelledby="service-audience-heading">
        <Container>
          <Reveal>
            <Eyebrow>{t("detail.audienceEyebrow")}</Eyebrow>
            <Heading as={2} id="service-audience-heading" className="mt-2">
              {t("detail.audienceTitle")}
            </Heading>
          </Reveal>
          <ul className="mt-8 m-0 flex list-none flex-col gap-3 p-0">
            {service.audience.map((row) => {
              const label = pickLocalized(row, appLocale);
              return (
                <li
                  key={label}
                  className="border-b border-line py-4 text-base leading-[var(--leading-body)] text-text last:border-b-0 last:pb-0"
                >
                  {label}
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section aria-labelledby="service-deliverables-heading">
        <Container className="flex flex-col gap-8">
          <Reveal>
            <Eyebrow>{t("detail.deliverablesEyebrow")}</Eyebrow>
            <Heading as={2} id="service-deliverables-heading" className="mt-2">
              {t("deliverables")}
            </Heading>
          </Reveal>
          <div className="grid grid-cols-6 gap-4">
            {service.deliverables.map((item, index) => (
              <Tile
                key={pickLocalized(item.title, appLocale)}
                span={deliverableSpan(index)}
                title={pickLocalized(item.title, appLocale)}
                description={pickLocalized(item.description, appLocale)}
                className="min-h-[180px]"
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section id="service-process" aria-labelledby="service-process-heading">
        <Container className="flex flex-col gap-8">
          <Reveal>
            <Eyebrow>{t("detail.processEyebrow")}</Eyebrow>
            <Heading as={2} id="service-process-heading" className="mt-2">
              {t("detail.processTitle")}
            </Heading>
          </Reveal>
          <ServiceSteps steps={service.steps} locale={appLocale} />
        </Container>
      </Section>

      <Section aria-labelledby="service-stack-heading">
        <Container className="flex flex-col gap-8">
          <Reveal>
            <Eyebrow>{t("detail.stackEyebrow")}</Eyebrow>
            <Heading as={2} id="service-stack-heading" className="mt-2">
              {t("stack")}
            </Heading>
          </Reveal>
          <div className="flex flex-col gap-6">
            {service.stack.map((group) => (
              <div key={pickLocalized(group.label, appLocale)}>
                <Text as="p" variant="caption" className="mb-3 font-semibold text-text">
                  {pickLocalized(group.label, appLocale)}
                </Text>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {group.items.map((tech) => (
                    <li key={tech}>
                      <Chip tone="panel">{tech}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <RelatedProjects
        serviceSlug={service.slug}
        relatedSlugs={service.relatedProjects}
      />

      {service.deepDiveHtml && (
        <Section id="service-deep-dive" aria-labelledby="service-deep-dive-heading">
          <Container narrow>
            <Reveal>
              <Eyebrow>{appLocale === "fa" ? "تحلیل فنی و معماری" : "Technical Deep-Dive"}</Eyebrow>
              <Heading as={2} id="service-deep-dive-heading" className="mt-2">
                {appLocale === "fa"
                  ? "ملاحظات معماری و جزییات پیاده‌سازی"
                  : "Architecture & Implementation Notes"}
              </Heading>
            </Reveal>
            <div
              className="prose prose-slate max-w-none mt-8 text-text [&>*:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: service.deepDiveHtml }}
            />
          </Container>
        </Section>
      )}

      <Section id="service-faq" aria-labelledby="service-faq-heading">
        <Container narrow>
          <Reveal>
            <Eyebrow>{t("detail.faqEyebrow")}</Eyebrow>
            <Heading as={2} id="service-faq-heading" className="mt-2">
              {t("detail.faqTitle")}
            </Heading>
          </Reveal>
          <div className="mt-8">
            <Accordion items={faqItems} />
          </div>
        </Container>
        <JsonLd data={faqJsonLd} />
      </Section>

      <ServiceClosingCta serviceSlug={service.slug} serviceTitle={title} />
    </div>
  );
}

export default function ServiceDetailPage({ params }: Props) {
  return (
    <Suspense fallback={<ServiceDetailFallback />}>
      <ServiceDetailContent params={params} />
    </Suspense>
  );
}
