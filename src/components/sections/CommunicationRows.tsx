import { getLocale, getTranslations } from "next-intl/server";
import { getCommunicationRows } from "@/content/process";
import type { AppLocale } from "@/i18n/routing";
import { Reveal } from "@/components/layout/Reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow, Heading, Text } from "@/components/ui";

export async function CommunicationRows() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("ProcessPage");
  const rows = getCommunicationRows(locale);

  if (rows.length === 0) return null;

  return (
    <Section id="communication" aria-labelledby="communication-heading">
      <Container narrow>
        <Reveal>
          <div className="mb-8 max-w-2xl">
            <Eyebrow>{t("communication.eyebrow")}</Eyebrow>
            <Heading as={2} id="communication-heading">
              {t("communication.title")}
            </Heading>
            <Text variant="muted" className="mt-3">
              {t("communication.lead")}
            </Text>
          </div>
        </Reveal>

        <ul className="m-0 list-none divide-y divide-line border-y border-line p-0">
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
            >
              <p className="m-0 shrink-0 text-base font-semibold text-text sm:w-48">
                {row.label}
              </p>
              <Text variant="muted" className="m-0 max-w-xl sm:text-end">
                {row.value}
              </Text>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
