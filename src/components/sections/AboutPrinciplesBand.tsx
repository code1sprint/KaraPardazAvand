import { getLocale, getTranslations } from "next-intl/server";
import { getResolvedAboutData } from "@/lib/about-data";
import type { AppLocale } from "@/i18n/routing";
import { Band } from "@/components/layout/Band";
import { Reveal } from "@/components/layout/Reveal";
import { Eyebrow, Heading, Text, TriMarker } from "@/components/ui";

export async function AboutPrinciplesBand() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("About");
  const aboutData = await getResolvedAboutData(locale);
  const principles = aboutData.principles;

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

          <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item, idx) => (
              <li
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] p-6 text-start shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-safe:hover:-translate-y-1 motion-safe:hover:border-white/20 motion-safe:hover:bg-white/[0.07] motion-safe:hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold tracking-wider text-sky-300/80">
                      0{idx + 1}
                    </span>
                    <TriMarker />
                  </div>
                  <Heading as={3} className="text-lg font-bold text-on-brand">
                    {item.title}
                  </Heading>
                  <Text
                    variant="muted"
                    className="text-sm leading-relaxed text-band-muted"
                  >
                    {item.body}
                  </Text>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Band>
  );
}
