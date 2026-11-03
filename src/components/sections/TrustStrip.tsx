import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Text } from "@/components/ui/Text";
import { getResolvedStats } from "@/content/stats";

/** Real stats only — returns null when every value is still TODO_REAL_DATA. */
export async function TrustStrip() {
  const resolved = getResolvedStats();
  if (resolved.length === 0) return null;

  const t = await getTranslations("Trust");

  return (
    <Section
      aria-label={t("label")}
      className="border-y border-line py-8 sm:py-10"
    >
      <Container>
        <ul className="m-0 flex list-none flex-wrap items-baseline justify-between gap-x-8 gap-y-4 p-0">
          {resolved.map((stat) => (
            <li key={stat.id} className="flex min-w-0 flex-col gap-1">
              <Text
                as="span"
                className="font-mono text-2xl font-semibold tabular-nums text-text sm:text-3xl"
              >
                {stat.value}
              </Text>
              <Text as="span" variant="caption">
                {t(stat.id)}
              </Text>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
