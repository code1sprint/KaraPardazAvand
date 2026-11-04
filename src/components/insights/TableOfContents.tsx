"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/mdx";
import { Text } from "@/components/ui";
import { cn } from "@/lib/cn";

export type TableOfContentsProps = {
  items: TocItem[];
  label: string;
  className?: string;
};

export function TableOfContents({ items, label, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop,
          );
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "0px 0px -65% 0px",
        threshold: [0, 0.25, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={cn("text-start", className)}>
      <Text variant="caption" as="p" className="mb-3 font-medium text-text">
        {label}
      </Text>
      <ol className="flex flex-col gap-2 border-s border-line ps-4">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={cn(item.depth === 3 && "ps-3")}
            >
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative text-sm transition-colors",
                  isActive
                    ? "font-medium text-blue before:absolute before:inset-y-0 before:-start-4 before:w-0.5 before:bg-orange"
                    : "text-muted hover:text-blue",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
