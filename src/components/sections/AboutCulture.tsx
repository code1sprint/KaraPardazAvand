import { getLocale, getTranslations } from "next-intl/server";
import { getResolvedAboutData } from "@/lib/about-data";
import type { AppLocale } from "@/i18n/routing";
import { Reveal } from "@/components/layout/Reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow, Heading, Text, TriMarker } from "@/components/ui";

export async function AboutCulture() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("About");
  const aboutData = await getResolvedAboutData(locale);
  const items = aboutData.culture;

  if (items.length === 0) return null;

  return (
    <Section id="culture" aria-labelledby="about-culture-heading">
      <Container>
        <Reveal>
          <div className="mb-8 max-w-2xl md:mb-10">
            <Eyebrow>{t("culture.eyebrow")}</Eyebrow>
            <Heading as={2} id="about-culture-heading">
              {t("culture.title")}
            </Heading>
            <Text variant="muted" className="mt-3">
              {t("culture.lead")}
            </Text>
          </div>
        </Reveal>

        <ul className="m-0 grid list-none gap-8 p-0 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-2 text-start">
              <div className="flex items-start gap-2.5">
                <TriMarker className="mt-1.5" />
                <Heading as={3} className="text-lg font-semibold sm:text-xl">
                  {item.title}
                </Heading>
              </div>
              <Text variant="muted" className="ps-[22px]">
                {item.body}
              </Text>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
