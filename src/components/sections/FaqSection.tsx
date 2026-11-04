import { getLocale, getTranslations } from "next-intl/server";
import { getFaqByIds, resolveFaqItems } from "@/content/faq";
import { Reveal } from "@/components/layout/Reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Accordion,
  Eyebrow,
  Heading,
  Link,
  Text,
} from "@/components/ui";
import type { AppLocale } from "@/i18n/routing";

export type FaqSectionProps = {
  /** When set, only these FAQ ids are shown (service detail subset). */
  itemIds?: readonly string[];
  /** Cap items (home preview uses 4). */
  limit?: number;
  /** Emit FAQPage JSON-LD. Default true when items remain. */
  emitJsonLd?: boolean;
  headingAs?: 1 | 2 | 3;
  /** Optional section id override. */
  id?: string;
  /** Link to full /faq page. */
  showViewAll?: boolean;
  /** When false, render an empty status instead of hiding (FAQ index). */
  hideWhenEmpty?: boolean;
};

export async function FaqSection({
  itemIds,
  limit,
  emitJsonLd = true,
  headingAs = 2,
  id = "faq",
  showViewAll = false,
  hideWhenEmpty = true,
}: FaqSectionProps = {}) {
  const t = await getTranslations("Faq");
  const locale = (await getLocale()) as AppLocale;

  let items =
    itemIds && itemIds.length > 0
      ? getFaqByIds(itemIds, locale)
      : resolveFaqItems(locale);

  if (typeof limit === "number" && limit >= 0) {
    items = items.slice(0, limit);
  }

  if (items.length === 0 && hideWhenEmpty) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <Section id={id} aria-labelledby={`${id}-heading`}>
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              {headingAs !== 1 ? <Eyebrow>{t("eyebrow")}</Eyebrow> : null}
              <Heading as={headingAs} id={`${id}-heading`}>
                {t("title")}
              </Heading>
              <Text variant="muted" className="mt-3">
                {t("lead")}
              </Text>
            </div>
            {showViewAll ? (
              <Link href="/faq" variant="default">
                {t("viewAll")}
              </Link>
            ) : null}
          </div>
        </Reveal>

        {items.length === 0 ? (
          <Text variant="muted" className="mt-8" role="status">
            {t("empty")}
          </Text>
        ) : (
          <div className="mt-8">
            <Accordion
              items={items.map((item) => ({
                id: item.id,
                title: item.question,
                content: (
                  <Text variant="muted" as="div">
                    {item.answer}
                  </Text>
                ),
              }))}
            />
          </div>
        )}
      </Container>

      {emitJsonLd && items.length > 0 ? <JsonLd data={jsonLd} /> : null}
    </Section>
  );
}
