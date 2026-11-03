import { getLocale, getTranslations } from "next-intl/server";
import { getEngagementModels } from "@/content/process";
import type { AppLocale } from "@/i18n/routing";
import { Reveal } from "@/components/layout/Reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow, Heading, Text } from "@/components/ui";
import { Tile } from "@/components/visuals/Tile";

export async function EngagementModels() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("ProcessPage");
  const models = getEngagementModels(locale);

  if (models.length === 0) return null;

  return (
    <Section id="engagement-models" aria-labelledby="engagement-models-heading">
      <Container>
        <Reveal>
          <div className="mb-8 max-w-2xl md:mb-10">
            <Eyebrow>{t("models.eyebrow")}</Eyebrow>
            <Heading as={2} id="engagement-models-heading">
              {t("models.title")}
            </Heading>
            <Text variant="muted" className="mt-3">
              {t("models.lead")}
            </Text>
          </div>
        </Reveal>

        <div className="grid grid-cols-6 gap-4">
          {models.map((model, index) => (
            <Tile
              key={model.id}
              span={2}
              dark={index === 1}
              title={model.title}
              description={model.description}
              className="min-h-[220px]"
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
