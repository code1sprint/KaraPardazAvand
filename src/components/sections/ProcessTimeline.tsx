"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ResolvedProcessStep } from "@/content/process";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";

export type ProcessTimelineStep = ResolvedProcessStep & {
  ariaLabel: string;
};

export type ProcessTimelineProps = {
  steps: ProcessTimelineStep[];
  deliverablesLabel: string;
  clientLabel: string;
  /** Shown only when a step has a resolved duration (not TODO_REAL_DATA). */
  durationLabel?: string;
};

export function ProcessTimeline({
  steps,
  deliverablesLabel,
  clientLabel,
  durationLabel,
}: ProcessTimelineProps) {
  const reactId = useId();
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(
    steps[0]?.id ?? null,
  );

  function toggle(id: string) {
    setActiveId((current) => (current === id ? null : id));
  }

  if (steps.length === 0) return null;

  const panelTransition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <ol
      className={cn(
        "relative m-0 flex list-none flex-col gap-4 p-0",
        "md:flex-row md:items-start md:gap-3",
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-3 start-[0.6875rem] w-px bg-line md:hidden"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute start-0 end-0 top-[15px] hidden h-0.5 bg-[linear-gradient(90deg,var(--navy-2),var(--sky))] opacity-25 md:block"
      />

      {steps.map((step) => {
        const active = step.id === activeId;
        const panelId = `${reactId}-panel-${step.id}`;
        const triggerId = `${reactId}-trigger-${step.id}`;

        return (
          <li
            key={step.id}
            className={cn(
              "relative flex min-w-0 flex-1 flex-col ps-8 md:ps-0",
              active ? "md:basis-[1.55fr]" : "md:basis-[0.9fr]",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "relative z-[1] mb-4 hidden size-8 items-center justify-center self-center rounded-full border-2 bg-bg text-xs font-bold transition-[border-color,color,box-shadow,background-color] duration-200 md:flex",
                active
                  ? "border-orange bg-panel text-orange shadow-[0_0_0_6px_var(--orange-soft)]"
                  : "border-line text-muted",
              )}
            >
              {step.number}
            </span>

            <span
              aria-hidden
              className={cn(
                "absolute start-0 top-4 flex size-8 items-center justify-center rounded-full border-2 bg-bg text-xs font-bold transition-[border-color,color,box-shadow,background-color] duration-200 md:hidden",
                active
                  ? "border-orange bg-panel text-orange shadow-[0_0_0_6px_var(--orange-soft)]"
                  : "border-line text-muted",
              )}
            >
              {step.number}
            </span>

            <div
              className={cn(
                "flex min-w-0 flex-col overflow-hidden rounded-tile border bg-panel transition-[border-color] duration-200",
                active ? "border-orange" : "border-line",
              )}
            >
              <button
                type="button"
                id={triggerId}
                aria-expanded={active}
                aria-controls={panelId}
                className="flex w-full flex-col gap-2 p-4 text-start"
                onClick={() => toggle(step.id)}
              >
                <span className="font-mono text-xs text-muted">
                  {String(step.number).padStart(2, "0")}
                </span>
                <span className="text-base font-semibold leading-[var(--leading-heading)] text-text">
                  {step.title}
                </span>
                <Text as="span" variant="muted" className="text-sm sm:text-sm">
                  {step.purpose}
                </Text>
              </button>

              <AnimatePresence initial={false}>
                {active ? (
                  <motion.div
                    key={panelId}
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={
                      reduceMotion ? undefined : { height: 0, opacity: 0 }
                    }
                    transition={panelTransition}
                    className="overflow-hidden border-t border-line"
                  >
                    <div className="space-y-4 px-4 pb-4">
                      <div>
                        <p className="mb-2 text-sm font-medium text-text">
                          {deliverablesLabel}
                        </p>
                        <ul className="m-0 list-none space-y-1.5 p-0">
                          {step.deliverables.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-sm leading-[var(--leading-body)] text-muted"
                            >
                              <span
                                aria-hidden
                                className="mt-2 size-1.5 shrink-0 rounded-full bg-orange"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-medium text-text">
                          {clientLabel}
                        </p>
                        <Text variant="muted" className="text-sm sm:text-sm">
                          {step.clientInvolvement}
                        </Text>
                      </div>
                      {step.duration && durationLabel ? (
                        <div>
                          <p className="mb-1 text-sm font-medium text-text">
                            {durationLabel}
                          </p>
                          <Text variant="muted" className="text-sm sm:text-sm">
                            {step.duration}
                          </Text>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
