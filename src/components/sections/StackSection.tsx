import { getLocale, getTranslations } from "next-intl/server";
import { getStackGroups } from "@/content/stack";
import type { AppLocale } from "@/i18n/routing";
import { Badge, Container, Heading, Section, Tabs, Text } from "@/components/ui";

export async function StackSection() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Stack");
  const groups = getStackGroups(locale);

  return (
    <Section id="stack" aria-labelledby="stack-heading">
      <Container>
        <div className="mb-8 flex max-w-2xl flex-col gap-3 md:mb-10">
          <p className="text-sm font-medium text-accent">{t("eyebrow")}</p>
          <Heading as={2} id="stack-heading">
            {t("title")}
          </Heading>
          <Text variant="muted">{t("lead")}</Text>
        </div>

        <Tabs
          label={t("tabsLabel")}
          defaultValue={groups[0]?.id}
          items={groups.map((group) => ({
            id: group.id,
            label: group.label,
            panel: (
              <div className="flex flex-col gap-4">
                <p className="sr-only">{t("selectedGroup", { group: group.label })}</p>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Badge tone="neutral">{item}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          }))}
        />
      </Container>
    </Section>
  );
}
