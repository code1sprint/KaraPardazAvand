import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { Band, Container, Reveal, Section } from "@/components/layout";
import {
  Accordion,
  Breadcrumb,
  Button,
  Chip,
  Eyebrow,
  Field,
  Heading,
  Input,
  Pill,
  Prose,
  Select,
  Tabs,
  Text,
  Textarea,
  TriMarker,
  VerticalTabs,
} from "@/components/ui";
import {
  AppWindow,
  CodeBlock,
  FloatingShapes,
  LogoTile,
  Marquee,
  Tile,
} from "@/components/visuals";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return buildPageMetadata({
    locale,
    path: "/design",
    title: t("pages.design.title"),
    description: t("pages.design.description"),
    siteName: t("siteName"),
    imageAlt: t("ogImageAlt"),
    noIndex: true,
  });
}

export default async function DesignPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("DesignPage");

  const colorSwatches = [
    ["bg", "bg-bg", "border border-line"],
    ["panel", "bg-panel", "border border-line"],
    ["navy", "bg-navy", ""],
    ["navy-2", "bg-navy-2", ""],
    ["blue", "bg-blue", ""],
    ["sky", "bg-sky", ""],
    ["orange", "bg-orange", ""],
    ["amber", "bg-amber", ""],
    ["ok", "bg-ok", ""],
    ["win-bg", "bg-win-bg", ""],
    ["win-deep", "bg-win-deep", ""],
  ] as const;

  return (
    <div className="relative flex-1 overflow-hidden pb-20">
      <FloatingShapes className="opacity-40" />

      <Section className="border-b border-line bg-panel/80 py-10 sm:py-12">
        <Container>
          <div className="flex max-w-2xl flex-col gap-3">
            <Pill>{t("eyebrow")}</Pill>
            <Heading as={1}>{t("title")}</Heading>
            <Text variant="muted">{t("lead")}</Text>
          </div>
        </Container>
      </Section>

      <Section>
        <Container className="flex flex-col gap-16">
          <GalleryBlock title={t("sections.colors")}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {colorSwatches.map(([name, swatch, extra]) => (
                <div
                  key={name}
                  className="flex flex-col gap-3 rounded-tile border border-line bg-panel p-4"
                >
                  <div
                    className={`h-16 w-full rounded-[var(--radius-node)] ${swatch} ${extra}`}
                    aria-hidden
                  />
                  <Text variant="caption" className="font-mono">
                    {name}
                  </Text>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Text variant="caption">text / muted / line</Text>
              <span className="inline-block size-4 rounded-[var(--radius-node)] bg-text" />
              <span className="inline-block size-4 rounded-[var(--radius-node)] bg-muted" />
              <span className="inline-block size-4 rounded-[var(--radius-node)] border border-line bg-panel" />
              <TriMarker />
            </div>
          </GalleryBlock>

          <GalleryBlock title={t("sections.typography")}>
            <div className="flex flex-col gap-4">
              <Eyebrow>{t("type.eyebrow")}</Eyebrow>
              <Heading as={1}>
                {t("type.h1")}{" "}
                <em className="text-gradient-brand not-italic">
                  {t("type.h1Gradient")}
                </em>
              </Heading>
              <Heading as={2}>{t("type.h2")}</Heading>
              <Heading as={3}>{t("type.h3")}</Heading>
              <Text>{t("type.body")}</Text>
              <Text variant="muted">{t("type.muted")}</Text>
              <Text variant="mono">{t("type.mono")}</Text>
            </div>
          </GalleryBlock>

          <GalleryBlock title={t("sections.buttons")}>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">{t("buttons.primary")}</Button>
              <Button variant="secondary">{t("buttons.secondary")}</Button>
              <Button variant="primary" size="sm">
                {t("buttons.small")}
              </Button>
              <Button variant="ghost">{t("buttons.ghost")}</Button>
              <Button variant="primary" disabled>
                {t("buttons.disabled")}
              </Button>
            </div>
          </GalleryBlock>

          <GalleryBlock title={t("sections.chips")}>
            <div className="flex flex-wrap gap-3">
              <Chip>{t("chips.soft")}</Chip>
              <Chip tone="panel">{t("chips.panel")}</Chip>
              <Chip tone="ok">{t("chips.ok")}</Chip>
              <Chip tone="muted">{t("chips.muted")}</Chip>
              <Pill marker={false}>{t("chips.pill")}</Pill>
            </div>
          </GalleryBlock>

          <GalleryBlock title={t("sections.breadcrumb")}>
            <Breadcrumb
              label={t("breadcrumb.label")}
              items={[
                { label: t("breadcrumb.home"), href: "/" },
                { label: t("breadcrumb.design"), href: "/design" },
                { label: t("breadcrumb.here") },
              ]}
            />
          </GalleryBlock>

          <GalleryBlock title={t("sections.forms")}>
            <div className="grid max-w-xl gap-6">
              <Field id="design-name" label={t("forms.name")} hint={t("forms.nameHint")}>
                <Input placeholder={t("forms.namePlaceholder")} />
              </Field>
              <Field id="design-role" label={t("forms.role")}>
                <Select defaultValue="">
                  <option value="" disabled>
                    {t("forms.rolePlaceholder")}
                  </option>
                  <option value="ops">{t("forms.roleOps")}</option>
                  <option value="cto">{t("forms.roleCto")}</option>
                </Select>
              </Field>
              <Field
                id="design-message"
                label={t("forms.message")}
                error={t("forms.messageError")}
              >
                <Textarea placeholder={t("forms.messagePlaceholder")} rows={4} />
              </Field>
            </div>
          </GalleryBlock>

          <GalleryBlock title={t("sections.tabs")}>
            <Tabs
              label={t("tabs.label")}
              items={[
                {
                  id: "overview",
                  label: t("tabs.overview"),
                  panel: <Text variant="muted">{t("tabs.overviewPanel")}</Text>,
                },
                {
                  id: "tokens",
                  label: t("tabs.tokens"),
                  panel: <Text variant="muted">{t("tabs.tokensPanel")}</Text>,
                },
                {
                  id: "a11y",
                  label: t("tabs.a11y"),
                  panel: <Text variant="muted">{t("tabs.a11yPanel")}</Text>,
                },
              ]}
            />
          </GalleryBlock>

          <GalleryBlock title={t("sections.verticalTabs")}>
            <VerticalTabs
              label={t("verticalTabs.label")}
              items={[
                {
                  id: "crm",
                  label: t("verticalTabs.crm"),
                  panel: <Text variant="muted">{t("verticalTabs.crmPanel")}</Text>,
                },
                {
                  id: "erp",
                  label: t("verticalTabs.erp"),
                  panel: <Text variant="muted">{t("verticalTabs.erpPanel")}</Text>,
                },
                {
                  id: "rag",
                  label: t("verticalTabs.rag"),
                  panel: <Text variant="muted">{t("verticalTabs.ragPanel")}</Text>,
                },
              ]}
            />
          </GalleryBlock>

          <GalleryBlock title={t("sections.accordion")}>
            <Accordion
              items={[
                {
                  id: "one",
                  title: t("accordion.oneTitle"),
                  content: <Text variant="muted">{t("accordion.oneBody")}</Text>,
                },
                {
                  id: "two",
                  title: t("accordion.twoTitle"),
                  content: <Text variant="muted">{t("accordion.twoBody")}</Text>,
                },
                {
                  id: "three",
                  title: t("accordion.threeTitle"),
                  content: (
                    <Text variant="muted">{t("accordion.threeBody")}</Text>
                  ),
                },
              ]}
            />
          </GalleryBlock>

          <GalleryBlock title={t("sections.prose")}>
            <Prose>
              <h2>{t("prose.heading")}</h2>
              <p>{t("prose.body")}</p>
              <ul>
                <li>{t("prose.li1")}</li>
                <li>{t("prose.li2")}</li>
              </ul>
              <pre>
                <code>{t("type.mono")}</code>
              </pre>
            </Prose>
          </GalleryBlock>

          <GalleryBlock title={t("sections.tiles")}>
            <div className="grid grid-cols-6 gap-4">
              <Tile
                span={4}
                title={t("tiles.crmTitle")}
                description={t("tiles.crmBody")}
                visual={
                  <div className="grid grid-cols-3 gap-2.5">
                    {["A", "B", "C"].map((col) => (
                      <div
                        key={col}
                        className="grid gap-2 rounded-[var(--radius-control)] bg-blue-soft p-2.5"
                      >
                        <span className="text-[11px] font-medium text-muted">
                          {col}
                        </span>
                        <span className="block h-[26px] rounded-[7px] border border-line bg-panel" />
                        <span className="block h-[26px] rounded-[7px] border border-orange bg-orange-soft" />
                      </div>
                    ))}
                  </div>
                }
              />
              <Tile
                span={2}
                dark
                title={t("tiles.aiTitle")}
                description={t("tiles.aiBody")}
                visual={
                  <div className="grid gap-2 text-[13px]">
                    <div className="max-w-[88%] justify-self-start rounded-[14px] bg-sky-soft/40 px-3.5 py-2">
                      {t("tiles.chatUser")}
                    </div>
                    <div className="max-w-[88%] justify-self-end rounded-[14px] bg-win-bg px-3.5 py-2 text-win-text">
                      {t("tiles.chatAgent")}
                    </div>
                  </div>
                }
              />
            </div>
          </GalleryBlock>

          <GalleryBlock title={t("sections.appWindow")}>
            <Reveal>
              <AppWindow
                title="kara://design-lab"
                sidebar={
                  <VerticalTabs
                    surface="window"
                    renderPanels={false}
                    label={t("verticalTabs.label")}
                    listClassName="h-full"
                    items={[
                      { id: "crm", label: t("verticalTabs.crm") },
                      { id: "erp", label: t("verticalTabs.erp") },
                      { id: "rag", label: t("verticalTabs.rag") },
                    ]}
                  />
                }
                console={
                  <div className="space-y-0 px-[22px] py-3.5">
                    <div>
                      <span className="text-ok">ok</span> — {t("appWindow.log1")}
                    </div>
                    <div>
                      <span className="text-ok">ok</span> — {t("appWindow.log2")}
                    </div>
                  </div>
                }
              >
                <div className="flex flex-col gap-4 p-5">
                  <div className="flex items-center gap-3">
                    <LogoTile size={36} />
                    <Text className="text-win-muted">{t("appWindow.main")}</Text>
                  </div>
                  <CodeBlock label={t("sections.code")}>
                    {`POST /api/systems\n{ "status": "healthy" }`}
                  </CodeBlock>
                </div>
              </AppWindow>
            </Reveal>
          </GalleryBlock>

          <GalleryBlock title={t("sections.code")}>
            <CodeBlock>{`import { Band } from "@/components/layout";\n\nexport function Demo() {\n  return <Band glow>{/* … */}</Band>;\n}`}</CodeBlock>
          </GalleryBlock>

          <GalleryBlock title={t("sections.marquee")}>
            <Marquee caption={t("marquee.caption")}>
              {[
                "Next.js",
                "TypeScript",
                "PostgreSQL",
                "RAG",
                "CRM",
                "ERP",
                "Dashboards",
              ].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </Marquee>
          </GalleryBlock>
        </Container>
      </Section>

      <Band glow className="mt-8">
        <div className="relative max-w-2xl text-center md:mx-auto">
          <Eyebrow className="justify-center text-sky">{t("band.eyebrow")}</Eyebrow>
          <Heading as={2} className="text-on-brand">
            {t("band.title")}
          </Heading>
          <Text className="mx-auto mt-3 max-w-[54ch] text-band-muted">
            {t("band.body")}
          </Text>
          <div className="mt-8 flex justify-center">
            <Button variant="primary">{t("band.cta")}</Button>
          </div>
        </div>
      </Band>
    </div>
  );
}

function GalleryBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Heading as={2} className="text-[clamp(1.5rem,3vw,2rem)]">
        {title}
      </Heading>
      {children}
    </div>
  );
}
