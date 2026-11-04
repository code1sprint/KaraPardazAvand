"use client";

import type { ServiceSystemMap as ServiceSystemMapData } from "@/lib/content";
import type { AppLocale } from "@/i18n/routing";
import { AppWindow } from "@/components/visuals/AppWindow";
import { ConsoleLog } from "./ConsoleLog";
import { SystemMapDiagram } from "./SystemMapDiagram";

export type ServiceSystemMapProps = {
  locale: AppLocale;
  map: ServiceSystemMapData;
  mapLabel: string;
  animationKey: string;
  className?: string;
};

function pickLocalized(
  value: { fa: string; en: string },
  locale: AppLocale,
): string {
  return value[locale] ?? value.fa;
}

/** Single-service AppWindow + system map for `/services/[slug]`. */
export function ServiceSystemMap({
  locale,
  map,
  mapLabel,
  animationKey,
  className,
}: ServiceSystemMapProps) {
  const logs = map.logs.map((line) => pickLocalized(line, locale));
  const descriptionLead = pickLocalized(map.descriptionLead, locale);
  const description = pickLocalized(map.description, locale);

  return (
    <AppWindow
      title={map.windowTitle ?? "kara://system-map"}
      className={className}
    >
      <div className="flex min-w-0 flex-col">
        <div className="px-[18px] pt-3.5">
          <SystemMapDiagram
            locale={locale}
            nodes={map.nodes}
            mapLabel={mapLabel}
            animationKey={animationKey}
            layout={map.layout ?? "hub"}
          />
        </div>
        <p className="px-[22px] pb-3 text-start text-sm leading-[var(--leading-body)] text-win-desc">
          <b className="font-bold text-win-text">{descriptionLead}</b>{" "}
          {description}
        </p>
        <ConsoleLog
          surface="window"
          lines={logs}
          animationKey={animationKey}
        />
      </div>
    </AppWindow>
  );
}
