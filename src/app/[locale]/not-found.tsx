import { getTranslations } from "next-intl/server";
import { FloatingShapes } from "@/components/visuals/FloatingShapes";
import { ButtonLink, Container, Heading, Text } from "@/components/ui";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="relative flex flex-1 flex-col justify-center overflow-hidden py-16 sm:py-24">
      <FloatingShapes hideOnMobile={false} className="opacity-80" />
      <Container narrow className="relative">
        <p className="font-mono text-sm text-muted">{t("code")}</p>
        <Heading as={1} className="mt-3 max-w-[12ch]">
          {t("title")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-lg">
          {t("lead")}
        </Text>
        <ul className="mt-10 flex list-none flex-wrap gap-3 p-0">
          <li>
            <ButtonLink href="/services" variant="primary">
              {t("services")}
            </ButtonLink>
          </li>
          <li>
            <ButtonLink href="/portfolio" variant="secondary">
              {t("portfolio")}
            </ButtonLink>
          </li>
          <li>
            <ButtonLink href="/contact" variant="ghost">
              {t("contact")}
            </ButtonLink>
          </li>
        </ul>
      </Container>
    </div>
  );
}
