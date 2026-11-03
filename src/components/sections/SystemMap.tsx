"use client";

import { useId, useState } from "react";
import {
  pickLocalized,
  systems,
  type SystemDefinition,
} from "@/content/systems";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { VerticalTabs } from "@/components/ui/VerticalTabs";
import { AppWindow } from "@/components/visuals/AppWindow";
import { ConsoleLog } from "./ConsoleLog";
import { SystemMapDiagram } from "./SystemMapDiagram";

export type SystemMapProps = {
  locale: AppLocale;
  tabsLabel: string;
  mapLabel: string;
  windowTitle?: string;
  className?: string;
};

export function SystemMap({
  locale,
  tabsLabel,
  mapLabel,
  windowTitle = "kara / systems",
  className,
}: SystemMapProps) {
  const reactId = useId();
  const panelId = `${reactId}-system-panel`;
  const [activeId, setActiveId] = useState<SystemDefinition["id"]>(
    systems[0]?.id ?? "crm",
  );

  const active = systems.find((s) => s.id === activeId) ?? systems[0];
  if (!active) return null;

  const tabItems = systems.map((system) => ({
    id: system.id,
    label: pickLocalized(system.tabLabel, locale),
  }));

  const descriptionLead = pickLocalized(active.descriptionLead, locale);
  const description = pickLocalized(active.description, locale);
  const logs = active.logs.map((line) => pickLocalized(line, locale));
  const activeLabel = pickLocalized(active.tabLabel, locale);

  return (
    <AppWindow
      title={windowTitle}
      className={cn(className)}
      sidebar={
        <VerticalTabs
          surface="window"
          renderPanels={false}
          panelId={panelId}
          label={tabsLabel}
          value={activeId}
          onValueChange={(id) => setActiveId(id as SystemDefinition["id"])}
          listClassName="h-full border-0 md:border-0"
          items={tabItems}
        />
      }
    >
      <div
        role="tabpanel"
        id={panelId}
        aria-label={activeLabel}
        className="flex min-w-0 flex-col"
      >
        <div className="px-[18px] pt-3.5">
          <SystemMapDiagram
            locale={locale}
            nodes={active.nodes}
            mapLabel={mapLabel}
            animationKey={active.id}
            layout={active.layout}
          />
        </div>

        <p className="min-h-[3.4em] px-[22px] pb-3 text-start text-sm leading-[var(--leading-body)] text-win-desc">
          <b className="font-bold text-win-text">{descriptionLead}</b>{" "}
          {description}
        </p>

        <ConsoleLog
          surface="window"
          lines={logs}
          animationKey={active.id}
        />
      </div>
    </AppWindow>
  );
}
