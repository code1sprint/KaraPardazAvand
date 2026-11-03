import { TriMarker } from "@/components/ui/TriMarker";
import { Text } from "@/components/ui/Text";
import type { ServiceStep } from "@/lib/content";
import { pickLocalized } from "@/content/services";
import type { AppLocale } from "@/i18n/routing";

export type ServiceStepsProps = {
  steps: readonly ServiceStep[];
  locale: AppLocale;
};

/** Four service-specific process steps as plain numbered rows. */
export function ServiceSteps({ steps, locale }: ServiceStepsProps) {
  return (
    <ol className="m-0 flex list-none flex-col gap-4 p-0">
      {steps.map((step, index) => (
        <li
          key={`${index}-${pickLocalized(step.title, locale)}`}
          className="flex gap-4 rounded-tile border border-line bg-panel p-5 sm:p-6"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-bg font-mono text-xs font-bold text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="m-0 inline-flex items-center gap-2 text-base font-bold text-text">
              <TriMarker />
              {pickLocalized(step.title, locale)}
            </p>
            <Text variant="muted" className="mt-2">
              {pickLocalized(step.description, locale)}
            </Text>
          </div>
        </li>
      ))}
    </ol>
  );
}
