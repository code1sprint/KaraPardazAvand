"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ResolvedProcessStep } from "@/content/process";
import { cn } from "@/lib/cn";
import { Text } from "@/components/ui";
import { TriMarker } from "@/components/ui/TriMarker";

export type ProcessVerticalTrackStep = ResolvedProcessStep & {
  ariaLabel: string;
};

export type ProcessVerticalTrackProps = {
  steps: ProcessVerticalTrackStep[];
  deliverablesLabel: string;
  clientLabel: string;
  durationLabel: string;
};

/**
 * Long-form vertical process track for /process.
 * Active step gets the orange ring; duration only renders when resolved.
 */
export function ProcessVerticalTrack({
  steps,
  deliverablesLabel,
  clientLabel,
  durationLabel,
}: ProcessVerticalTrackProps) {
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
    <ol className="relative m-0 flex list-none flex-col gap-0 p-0">
      <span
        aria-hidden
        className="absolute inset-y-4 start-[15px] w-px bg-line"
      />

      {steps.map((step) => {
        const active = step.id === activeId;
        const panelId = `${reactId}-panel-${step.id}`;
        const triggerId = `${reactId}-trigger-${step.id}`;

        return (
          <li key={step.id} className="relative flex gap-5 pb-6 last:pb-0">
            <span
              aria-hidden
              className={cn(
                "relative z-[1] mt-4 flex size-8 shrink-0 items-center justify-center rounded-full border-2 bg-bg text-xs font-bold transition-[border-color,color,box-shadow,background-color] duration-200",
                active
                  ? "border-orange bg-panel text-orange shadow-[0_0_0_6px_var(--orange-soft)]"
                  : "border-line text-muted",
              )}
            >
              {step.number}
            </span>

            <div
              className={cn(
                "min-w-0 flex-1 overflow-hidden rounded-tile border bg-panel transition-[border-color] duration-200",
                active ? "border-orange" : "border-line",
              )}
            >
              <button
                type="button"
                id={triggerId}
                aria-expanded={active}
                aria-controls={panelId}
                aria-label={step.ariaLabel}
                className="flex w-full flex-col gap-2 p-5 text-start sm:p-6"
                onClick={() => toggle(step.id)}
              >
                <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
                  <TriMarker invisible={!active} />
                  {String(step.number).padStart(2, "0")}
                </span>
                <span className="text-lg font-extrabold leading-[var(--leading-heading)] text-text sm:text-xl">
                  {step.title}
                </span>
                <Text as="span" variant="muted" className="text-sm sm:text-base">
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
                    <div className="space-y-5 px-5 pb-5 sm:px-6 sm:pb-6">
                      <div>
                        <p className="mb-2 text-sm font-medium text-text">
                          {deliverablesLabel}
                        </p>
                        <ul className="m-0 list-none space-y-2 p-0">
                          {step.deliverables.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2.5 text-sm leading-[var(--leading-body)] text-muted sm:text-base"
                            >
                              <TriMarker className="mt-1.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 text-sm font-medium text-text">
                          {clientLabel}
                        </p>
                        <Text variant="muted">{step.clientInvolvement}</Text>
                      </div>
                      {step.duration ? (
                        <div>
                          <p className="mb-1 text-sm font-medium text-text">
                            {durationLabel}
                          </p>
                          <Text variant="muted">{step.duration}</Text>
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
