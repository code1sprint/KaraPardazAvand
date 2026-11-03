import { PostRow } from "@/components/insights/PostRow";
import { Heading, Text } from "@/components/ui";
import type { PostMeta } from "@/content/posts";

export type RelatedPostsProps = {
  posts: PostMeta[];
  title: string;
  lead?: string;
};

export function RelatedPosts({ posts, title, lead }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-14 border-t border-line pt-10" aria-labelledby="related-posts-heading">
      <Heading as={2} id="related-posts-heading" className="text-2xl sm:text-3xl">
        {title}
      </Heading>
      {lead ? (
        <Text variant="muted" className="mt-2 max-w-2xl">
          {lead}
        </Text>
      ) : null}
      <div className="mt-6 border-t border-line">
        {posts.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
