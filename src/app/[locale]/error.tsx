"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button, ButtonLink, Container, Heading, Text } from "@/components/ui";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations("Error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col justify-center py-16 sm:py-24">
      <Container narrow>
        <p className="font-mono text-sm text-muted">{t("code")}</p>
        <Heading as={1} className="mt-3 max-w-[14ch]">
          {t("title")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-lg">
          {t("lead")}
        </Text>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button type="button" onClick={reset}>
            {t("retry")}
          </Button>
          <ButtonLink href="/contact" variant="secondary">
            {t("contact")}
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
