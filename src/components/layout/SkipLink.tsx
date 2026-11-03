"use client";

import { useTranslations } from "next-intl";

const MAIN_ID = "main-content";

export function SkipLink() {
  const t = useTranslations("A11y");

  return (
    <a
      href={`#${MAIN_ID}`}
      className="bg-blue text-on-brand focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:inline-flex focus:h-[length:var(--control-height)] focus:items-center focus:rounded-pill focus:px-5 focus:text-base focus:font-medium focus:outline-none sr-only focus:not-sr-only"
    >
      {t("skipToContent")}
    </a>
  );
}

export { MAIN_ID };
