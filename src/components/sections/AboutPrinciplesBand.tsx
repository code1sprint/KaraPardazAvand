import { getLocale, getTranslations } from "next-intl/server";
import { getAboutPrinciples } from "@/content/about";
import type { AppLocale } from "@/i18n/routing";
import { Band } from "@/components/layout/Band";
import { Reveal } from "@/components/layout/Reveal";
import { Eyebrow, Heading, Text, TriMarker } from "@/components/ui";

export async function AboutPrinciplesBand() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("About");
  const principles = getAboutPrinciples(locale);

  if (principles.length === 0) return null;

  return (
    <Band id="principles" aria-labelledby="about-principles-heading">
      <Reveal>
        <div className="flex flex-col gap-10">
          <div className="flex max-w-2xl flex-col gap-3">
            <Eyebrow className="text-amber">{t("principles.eyebrow")}</Eyebrow>
            <Heading
              as={2}
              id="about-principles-heading"
              className="text-on-brand"
            >
              {t("principles.title")}
            </Heading>
            <Text variant="muted" className="text-band-muted">
              {t("principles.lead")}
            </Text>
          </div>

          <ul className="m-0 grid list-none gap-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item) => (
              <li key={item.id} className="flex flex-col gap-2 text-start">
                <div className="flex items-start gap-2.5">
                  <TriMarker className="mt-1.5" />
                  <Heading
                    as={3}
                    className="text-lg font-semibold text-on-brand sm:text-xl"
                  >
                    {item.title}
                  </Heading>
                </div>
                <Text variant="muted" className="ps-[22px] text-band-muted">
                  {item.body}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Band>
  );
}
