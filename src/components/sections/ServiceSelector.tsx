"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/components/ui/Link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { TriMarker } from "@/components/ui/TriMarker";
import {
  pickLocalized,
  services,
  type Service,
} from "@/content/services";
import {
  recommendServices,
  type SelectorAnswers,
  type SelectorProblem,
  type SelectorSystemState,
  type SelectorTeamSize,
} from "@/content/services/selector";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

type Option<T extends string> = { value: T; labelKey: string };

const PROBLEMS: Option<SelectorProblem>[] = [
  { value: "sales", labelKey: "problems.sales" },
  { value: "operations", labelKey: "problems.operations" },
  { value: "knowledge", labelKey: "problems.knowledge" },
  { value: "metrics", labelKey: "problems.metrics" },
  { value: "web", labelKey: "problems.web" },
  { value: "custom", labelKey: "problems.custom" },
];

const TEAM_SIZES: Option<SelectorTeamSize>[] = [
  { value: "small", labelKey: "team.small" },
  { value: "medium", labelKey: "team.medium" },
  { value: "large", labelKey: "team.large" },
];

const SYSTEM_STATES: Option<SelectorSystemState>[] = [
  { value: "existing", labelKey: "system.existing" },
  { value: "new", labelKey: "system.new" },
  { value: "unsure", labelKey: "system.unsure" },
];

export function ServiceSelector() {
  const t = useTranslations("Services.selector");
  const locale = useLocale() as AppLocale;
  const [answers, setAnswers] = useState<SelectorAnswers>({
    problem: null,
    teamSize: null,
    systemState: null,
  });

  const recommended = useMemo(() => {
    const slugs = recommendServices(answers);
    return slugs
      .map((slug) => services.find((service) => service.slug === slug))
      .filter((service): service is Service => Boolean(service));
  }, [answers]);

  const answeredCount = [
    answers.problem,
    answers.teamSize,
    answers.systemState,
  ].filter(Boolean).length;

  return (
    <section
      aria-labelledby="service-selector-heading"
      className="rounded-tile border border-line bg-panel p-6 sm:p-8"
    >
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <Heading as={2} id="service-selector-heading" className="mt-2">
        {t("title")}
      </Heading>
      <Text variant="muted" className="mt-3 max-w-2xl">
        {t("lead")}
      </Text>

      <div className="mt-8 flex flex-col gap-8">
        <QuestionGroup
          legend={t("q1")}
          options={PROBLEMS}
          value={answers.problem}
          onChange={(problem) => setAnswers((prev) => ({ ...prev, problem }))}
          t={t}
        />
        <QuestionGroup
          legend={t("q2")}
          options={TEAM_SIZES}
          value={answers.teamSize}
          onChange={(teamSize) => setAnswers((prev) => ({ ...prev, teamSize }))}
          t={t}
        />
        <QuestionGroup
          legend={t("q3")}
          options={SYSTEM_STATES}
          value={answers.systemState}
          onChange={(systemState) =>
            setAnswers((prev) => ({ ...prev, systemState }))
          }
          t={t}
        />
      </div>

      <div className="mt-8 border-t border-line pt-6" aria-live="polite">
        {answeredCount === 0 ? (
          <Text variant="muted">{t("hint")}</Text>
        ) : recommended.length === 0 ? (
          <Text variant="muted">{t("empty")}</Text>
        ) : (
          <div className="flex flex-col gap-4">
            <Text className="font-semibold text-text">{t("result")}</Text>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {recommended.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex flex-col gap-1 rounded-[var(--radius-control)] border border-line bg-bg px-4 py-3 no-underline transition-colors hover:border-tile-hover-line"
                  >
                    <span className="inline-flex items-center gap-2 text-base font-bold text-text">
                      <TriMarker />
                      {pickLocalized(service.title, locale)}
                    </span>
                    <span className="text-sm text-muted">
                      {pickLocalized(service.outcome, locale)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Text variant="caption" className="text-muted">
              {t("privacy")}
            </Text>
          </div>
        )}
      </div>
    </section>
  );
}

function QuestionGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  t,
}: {
  legend: string;
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  t: ReturnType<typeof useTranslations<"Services.selector">>;
}) {
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-3 text-sm font-semibold text-text">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              className={cn(
                "inline-flex items-center gap-2 rounded-pill border px-3.5 py-2 text-sm transition-colors",
                selected
                  ? "border-blue bg-blue-soft font-semibold text-text"
                  : "border-line bg-panel text-muted hover:border-tile-hover-line hover:text-text",
              )}
              onClick={() => onChange(option.value)}
            >
              <TriMarker invisible={!selected} />
              {t(option.labelKey as never)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
