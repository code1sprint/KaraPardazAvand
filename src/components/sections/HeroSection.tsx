import { getLocale, getTranslations } from "next-intl/server";
import { SystemMap } from "@/components/sections/SystemMap";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Heading } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { Text } from "@/components/ui/Text";
import { FloatingShapes } from "@/components/visuals/FloatingShapes";
import { Marquee } from "@/components/visuals/Marquee";
import { heroTech } from "@/content/systems";
import type { AppLocale } from "@/i18n/routing";

export async function HeroSection() {
  const t = await getTranslations("Hero");
  const locale = (await getLocale()) as AppLocale;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-10 pt-[length:var(--nav-block-height)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[120px] h-[760px] bg-[radial-gradient(40%_50%_at_50%_0,var(--hero-glow-sky),transparent),radial-gradient(30%_40%_at_12%_30%,var(--hero-glow-blue),transparent),radial-gradient(28%_36%_at_85%_20%,var(--hero-glow-orange),transparent)]"
      />

      <FloatingShapes />

      <Container className="relative text-center">
        <Pill className="mb-7">{t("pill")}</Pill>

        <Heading
          as={1}
          id="hero-heading"
          className="mx-auto mb-6 max-w-[15ch] text-center"
        >
          {t("titleBefore")}
          <em className="text-gradient-brand not-italic">{t("titleGradient")}</em>
          {t("titleAfter")}
        </Heading>

        <Text
          variant="muted"
          className="mx-auto mb-9 max-w-[56ch] text-center text-[clamp(16px,1.6vw,19px)]"
        >
          {t("lead")}
        </Text>

        <div className="relative flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/contact" variant="primary">
            {t("ctaPrimary")}
          </ButtonLink>
          <ButtonLink href="/services" variant="secondary">
            {t("ctaSecondary")}
          </ButtonLink>
        </div>

        <SystemMap
          locale={locale}
          tabsLabel={t("tabsLabel")}
          mapLabel={t("mapLabel")}
          windowTitle={t("windowTitle")}
          className="mt-[72px]"
        />

        <Marquee caption={t("marqueeCaption")} className="mt-16">
          {heroTech.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </Marquee>
      </Container>
    </section>
  );
}
