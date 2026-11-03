"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { ResolvedFaqTopic } from "@/content/faq";
import { Accordion, Heading, Input, Text } from "@/components/ui";
import { cn } from "@/lib/cn";

export type FaqIndexProps = {
  topics: ResolvedFaqTopic[];
  className?: string;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function FaqIndex({ topics, className }: FaqIndexProps) {
  const t = useTranslations("Faq");
  const [query, setQuery] = useState("");

  const filteredTopics = useMemo(() => {
    const q = normalize(query);
    if (!q) return topics;

    return topics
      .map((topic) => ({
        ...topic,
        items: topic.items.filter((item) => {
          const haystack = normalize(`${item.question} ${item.answer}`);
          return haystack.includes(q);
        }),
      }))
      .filter((topic) => topic.items.length > 0);
  }, [query, topics]);

  const totalVisible = filteredTopics.reduce(
    (sum, topic) => sum + topic.items.length,
    0,
  );

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <div className="max-w-xl">
        <label htmlFor="faq-search" className="sr-only">
          {t("searchLabel")}
        </label>
        <Input
          id="faq-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchPlaceholder")}
          autoComplete="off"
          enterKeyHint="search"
        />
        <p className="mt-2 text-sm text-muted" aria-live="polite">
          {query.trim()
            ? t("searchResults", { count: totalVisible })
            : t("searchHint")}
        </p>
      </div>

      {filteredTopics.length === 0 ? (
        <Text variant="muted" role="status">
          {t("searchEmpty")}
        </Text>
      ) : (
        filteredTopics.map((topic) => (
          <section
            key={topic.id}
            aria-labelledby={`faq-topic-${topic.id}`}
            className="flex flex-col gap-4"
          >
            <Heading as={2} id={`faq-topic-${topic.id}`} className="text-xl sm:text-2xl">
              {topic.title}
            </Heading>
            <Accordion
              multiple
              deepLink
              items={topic.items.map((item) => ({
                id: item.id,
                title: item.question,
                content: (
                  <Text variant="muted" as="div">
                    {item.answer}
                  </Text>
                ),
              }))}
            />
          </section>
        ))
      )}
    </div>
  );
}
