import { getLocale, getTranslations } from "next-intl/server";
import { SystemMap } from "@/components/sections/SystemMap";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Heading } from "@/components/ui/Heading";
import { Pill } from "@/components/ui/Pill";
import { Text } from "@/components/ui/Text";
import { FloatingShapes } from "@/components/visuals/FloatingShapes";
import { Marquee } from "@/components/visuals/Marquee";
import { getResolvedHomeData } from "@/lib/home-data";
import type { AppLocale } from "@/i18n/routing";

export async function HeroSection() {
  const t = await getTranslations("Hero");
  const locale = (await getLocale()) as AppLocale;
  const homeData = await getResolvedHomeData(locale);
  const hero = homeData.hero;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden -mt-[length:var(--nav-block-height)] pt-[calc(var(--nav-block-height)+1.75rem)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[860px] bg-[radial-gradient(40%_50%_at_50%_0,var(--hero-glow-sky),transparent),radial-gradient(30%_40%_at_12%_30%,var(--hero-glow-blue),transparent),radial-gradient(28%_36%_at_85%_20%,var(--hero-glow-orange),transparent)]"
      />

      <FloatingShapes />

      <Container className="relative text-center">
        <Pill className="mb-7">{hero.pill || t("pill")}</Pill>

        <Heading
          as={1}
          id="hero-heading"
          className="mx-auto mb-6 max-w-[15ch] text-center"
        >
          {hero.titleBefore || t("titleBefore")}
          <em className="text-gradient-brand not-italic">
            {hero.titleGradient || t("titleGradient")}
          </em>
          {hero.titleAfter || t("titleAfter")}
        </Heading>

        <Text
          variant="muted"
          className="mx-auto mb-9 max-w-[56ch] text-center text-[clamp(16px,1.6vw,19px)]"
        >
          {hero.lead || t("lead")}
        </Text>

        <div className="relative flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={hero.ctaPrimary.href || "/contact"} variant="primary">
            {hero.ctaPrimary.label || t("ctaPrimary")}
          </ButtonLink>
          <ButtonLink href={hero.ctaSecondary.href || "/services"} variant="secondary">
            {hero.ctaSecondary.label || t("ctaSecondary")}
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
          {hero.techMarquee.map((name) => (
            <span key={name}>{name}</span>
          ))}
        </Marquee>
      </Container>
    </section>
  );
}
