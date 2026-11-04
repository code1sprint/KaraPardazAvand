import Image from "next/image";
import { Chip, Heading, Link, Text } from "@/components/ui";
import type { PostMeta } from "@/content/posts";

export type RelatedPostsProps = {
  posts: PostMeta[];
  title: string;
  lead?: string;
};

export function RelatedPosts({ posts, title, lead }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-line pt-12" aria-labelledby="related-posts-heading">
      <div className="flex flex-col gap-1 text-start">
        <Heading as={2} id="related-posts-heading" className="text-2xl sm:text-3xl font-black">
          {title}
        </Heading>
        {lead ? (
          <Text variant="muted" className="mt-1 max-w-2xl text-base">
            {lead}
          </Text>
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="group relative flex flex-col justify-between overflow-hidden rounded-tile border border-line bg-panel p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue/40 hover:shadow-md"
          >
            <div>
              {post.cover ? (
                <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-bg">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-gradient-to-br from-bg via-blue-soft/30 to-bg flex items-center justify-center">
                  <div className="h-1.5 w-8 rounded-full bg-blue/30" />
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-muted">
                <time dateTime={post.dateIso}>{post.dateIso}</time>
                <span>•</span>
                <span>{post.readingTime}</span>
              </div>

              <h3 className="mt-2 text-lg font-bold leading-snug text-text transition-colors group-hover:text-blue">
                <Link
                  href={`/insights/${post.slug}`}
                  variant="nav"
                  className="hover:text-blue before:absolute before:inset-0"
                >
                  {post.title}
                </Link>
              </h3>

              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
                {post.summary}
              </p>
            </div>

            {post.tags.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-1.5 pt-3 border-t border-line/60">
                {post.tags.slice(0, 3).map((tag) => (
                  <Chip key={tag} tone="panel" className="text-[11px] py-0.5 px-2">
                    {tag}
                  </Chip>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
