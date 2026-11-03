import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ForceErrorClient } from "@/components/system/ForceErrorClient";
import { Container, Heading, Text } from "@/components/ui";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * QA helper for Phase 11: renders a control that throws so
 * `[locale]/error.tsx` (retry + contact) can be exercised.
 */
export default async function ForceErrorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ForceError");

  return (
    <div className="flex flex-1 flex-col justify-center py-16 sm:py-24">
      <Container narrow>
        <Heading as={1}>{t("title")}</Heading>
        <Text variant="muted" className="mt-3 max-w-lg">
          {t("lead")}
        </Text>
        <div className="mt-8">
          <ForceErrorClient label={t("trigger")} />
        </div>
      </Container>
    </div>
  );
}
