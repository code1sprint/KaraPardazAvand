import { getTranslations } from "next-intl/server";
import { getLatestPosts } from "@/content/posts";
import { PostRow } from "@/components/insights/PostRow";
import { Reveal } from "@/components/layout/Reveal";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow, Heading, Link, Text } from "@/components/ui";

/** Latest 3 posts as rows — hidden entirely when there are no posts. */
export async function InsightsTeaser() {
  const t = await getTranslations("Insights");
  const posts = await getLatestPosts(3);

  if (posts.length === 0) {
    return null;
  }

  return (
    <Section id="insights" aria-labelledby="insights-heading">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <Eyebrow>{t("teaser.eyebrow")}</Eyebrow>
              <Heading as={2} id="insights-heading">
                {t("teaser.title")}
              </Heading>
              <Text variant="muted" className="mt-3">
                {t("teaser.lead")}
              </Text>
            </div>
            <Link href="/insights" variant="default">
              {t("teaser.viewAll")}
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 border-t border-line">
          {posts.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
