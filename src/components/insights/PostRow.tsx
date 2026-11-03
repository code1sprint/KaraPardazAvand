import { Chip, Heading, Link, Text } from "@/components/ui";
import type { PostMeta } from "@/content/posts";
import { cn } from "@/lib/cn";

export type PostRowProps = {
  post: PostMeta;
  /** Larger featured treatment at the top of the list. */
  featured?: boolean;
  className?: string;
};

export function PostRow({ post, featured = false, className }: PostRowProps) {
  return (
    <article
      className={cn(
        "border-b border-line",
        featured ? "py-8 sm:py-10" : "py-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <time dateTime={post.dateIso} className="text-sm text-muted">
          {post.dateIso}
        </time>
        <Text variant="caption" as="span">
          {post.readingTime}
        </Text>
      </div>
      <Heading
        as={featured ? 2 : 3}
        className={cn(
          "mt-2",
          featured
            ? "text-[length:var(--h2-size)] tracking-[var(--h2-tracking)]"
            : "text-xl sm:text-2xl",
        )}
      >
        <Link
          href={`/insights/${post.slug}`}
          variant="nav"
          className="hover:text-blue"
        >
          {post.title}
        </Link>
      </Heading>
      <Text
        variant="muted"
        className={cn("mt-2 max-w-2xl", featured && "text-base sm:text-lg")}
      >
        {post.summary}
      </Text>
      {post.tags.length > 0 ? (
        <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Chip tone="panel">{tag}</Chip>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
