import { getLocale, getTranslations } from "next-intl/server";
import { getAboutBrandNodes } from "@/content/about";
import { getParentBrandUrl } from "@/content/site";
import type { AppLocale } from "@/i18n/routing";
import { Reveal } from "@/components/layout/Reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow, Heading, Text } from "@/components/ui";

export async function AboutBrandDiagram() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("About");
  const nodes = getAboutBrandNodes(locale);
  const parentUrl = getParentBrandUrl();

  if (nodes.length === 0) return null;

  const parent = nodes.find((node) => node.id === "code1sprint");
  const kara = nodes.find((node) => node.id === "kara");

  return (
    <Section id="brands" aria-labelledby="about-brands-heading">
      <Container>
        <Reveal>
          <div className="mb-8 max-w-2xl md:mb-10">
            <Eyebrow>{t("brands.eyebrow")}</Eyebrow>
            <Heading as={2} id="about-brands-heading">
              {t("brands.title")}
            </Heading>
            <Text variant="muted" className="mt-3">
              {t("brands.lead")}
            </Text>
          </div>
        </Reveal>

        <div
          className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-6"
          role="group"
          aria-label={t("brands.diagramLabel")}
        >
          {parent ? (
            <div className="flex min-h-[140px] flex-1 flex-col justify-center rounded-[var(--radius-node)] border border-line bg-panel p-5 sm:max-w-sm">
              <p className="m-0 font-mono text-xs text-muted">
                {t("brands.parentLabel")}
              </p>
              <p className="m-0 mt-2 text-lg font-extrabold text-text">
                {parent.name}
              </p>
              <Text variant="muted" className="mt-2 text-sm sm:text-sm">
                {parent.focus}
              </Text>
            </div>
          ) : null}

          <div
            aria-hidden
            className="flex items-center justify-center px-2"
          >
            <span className="hidden h-px w-10 bg-line sm:block" />
            <span className="font-mono text-xs text-muted sm:px-2">
              {t("brands.connector")}
            </span>
            <span className="hidden h-px w-10 bg-line sm:block" />
          </div>

          {kara ? (
            <div className="flex min-h-[140px] flex-1 flex-col justify-center rounded-[var(--radius-node)] border border-line bg-panel p-5 sm:max-w-sm">
              <p className="m-0 font-mono text-xs text-muted">
                {t("brands.sisterLabel")}
              </p>
              <p className="m-0 mt-2 text-lg font-extrabold text-text">
                {kara.name}
              </p>
              <Text variant="muted" className="mt-2 text-sm sm:text-sm">
                {kara.focus}
              </Text>
            </div>
          ) : null}
        </div>

        <p className="mt-6">
          <a
            href={parentUrl}
            className="rounded-sm text-blue underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("parentLink")}
          </a>
        </p>
      </Container>
    </Section>
  );
}
