"use client";

import { useDeferredValue, useMemo, useState, useTransition } from "react";
import { PostRow } from "@/components/insights/PostRow";
import { Button, Input, Text } from "@/components/ui";
import type { PostMeta } from "@/content/posts";
import { cn } from "@/lib/cn";

const PAGE_SIZE = 12;

export type InsightsFilterProps = {
  posts: PostMeta[];
  tags: string[];
  labels: {
    all: string;
    tagsLabel: string;
    searchLabel: string;
    searchPlaceholder: string;
    empty: string;
    emptyFiltered: string;
    loadMore: string;
    featured: string;
  };
};

export function InsightsFilter({ posts, tags, labels }: InsightsFilterProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const featured = posts[0] ?? null;
  const hasFilters =
    activeTag != null || deferredQuery.trim().length > 0;

  const filtered = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase();
    return posts.filter((post) => {
      if (activeTag && !post.tags.includes(activeTag)) return false;
      if (!needle) return true;
      return (
        post.title.toLowerCase().includes(needle) ||
        post.summary.toLowerCase().includes(needle)
      );
    });
  }, [posts, activeTag, deferredQuery]);

  const listPosts = useMemo(() => {
    if (hasFilters || !featured) return filtered;
    return filtered.filter((post) => post.slug !== featured.slug);
  }, [filtered, featured, hasFilters]);

  const visible = listPosts.slice(0, visibleCount);
  const canLoadMore = visibleCount < listPosts.length;

  const showEmpty = posts.length === 0 || filtered.length === 0;
  const emptyMessage =
    posts.length === 0 ? labels.empty : labels.emptyFiltered;

  const selectTag = (tag: string | null) => {
    startTransition(() => {
      setActiveTag(tag);
      setVisibleCount(PAGE_SIZE);
    });
  };

  return (
    <div className={cn(isPending && "opacity-80")}>
      {tags.length > 0 ? (
        <div
          role="toolbar"
          aria-label={labels.tagsLabel}
          className="flex flex-wrap gap-2"
        >
          <FilterChip
            pressed={activeTag == null}
            onClick={() => selectTag(null)}
            label={labels.all}
          />
          {tags.map((tag) => (
            <FilterChip
              key={tag}
              pressed={activeTag === tag}
              onClick={() => selectTag(tag)}
              label={tag}
            />
          ))}
        </div>
      ) : null}

      <div className={cn(tags.length > 0 ? "mt-4" : undefined)}>
        <label className="sr-only" htmlFor="insights-search">
          {labels.searchLabel}
        </label>
        <Input
          id="insights-search"
          type="search"
          value={query}
          onChange={(event) => {
            const next = event.target.value;
            setQuery(next);
            startTransition(() => setVisibleCount(PAGE_SIZE));
          }}
          placeholder={labels.searchPlaceholder}
          autoComplete="off"
        />
      </div>

      {showEmpty ? (
        <Text variant="muted" className="mt-10" role="status">
          {emptyMessage}
        </Text>
      ) : (
        <div className="mt-8 border-t border-line">
          {!hasFilters && featured ? (
            <div>
              <Text
                variant="caption"
                as="p"
                className="pt-6 font-medium text-text"
              >
                {labels.featured}
              </Text>
              <PostRow post={featured} featured />
            </div>
          ) : null}

          {visible.map((post) => (
            <PostRow key={post.slug} post={post} />
          ))}

          {canLoadMore ? (
            <div className="flex justify-center py-8">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  startTransition(() =>
                    setVisibleCount((count) => count + PAGE_SIZE),
                  )
                }
              >
                {labels.loadMore}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  pressed,
  onClick,
  label,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center rounded-pill border px-4 text-sm font-medium transition-colors",
        pressed
          ? "border-blue bg-blue-soft text-blue"
          : "border-line bg-panel text-text hover:bg-blue-soft",
      )}
    >
      {label}
    </button>
  );
}
