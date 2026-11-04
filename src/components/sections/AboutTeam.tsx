import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { getResolvedAboutData } from "@/lib/about-data";
import type { AppLocale } from "@/i18n/routing";
import { Reveal } from "@/components/layout/Reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow, Heading, Text } from "@/components/ui";

export async function AboutTeam() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("About");
  const aboutData = await getResolvedAboutData(locale);
  const team = aboutData.team;

  if (team.length === 0) return null;

  return (
    <Section id="team" aria-labelledby="about-team-heading">
      <Container>
        <Reveal>
          <div className="mb-8 max-w-2xl md:mb-10">
            <Eyebrow>{t("team.eyebrow")}</Eyebrow>
            <Heading as={2} id="about-team-heading">
              {t("team.title")}
            </Heading>
            <Text variant="muted" className="mt-3">
              {t("team.lead")}
            </Text>
          </div>
        </Reveal>

        <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <li
              key={member.id}
              className="flex flex-col gap-3 rounded-tile border border-line bg-panel p-5"
            >
              {member.photo ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-node)] bg-bg">
                  <Image
                    src={member.photo}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              ) : (
                <div
                  aria-hidden
                  className="aspect-square w-full rounded-[var(--radius-node)] border border-line bg-bg"
                />
              )}
              <div>
                <p className="m-0 text-lg font-extrabold text-text">
                  {member.name}
                </p>
                <Text variant="muted" className="mt-1 text-sm sm:text-sm">
                  {member.role}
                </Text>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
