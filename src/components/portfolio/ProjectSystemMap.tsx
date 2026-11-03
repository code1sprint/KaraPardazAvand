"use client";

import type { ProjectSystemMap as ProjectSystemMapData } from "@/content/project-meta";
import type { AppLocale } from "@/i18n/routing";
import { AppWindow } from "@/components/visuals/AppWindow";
import { ConsoleLog } from "@/components/sections/ConsoleLog";
import {
  SystemMapDiagram,
  type SystemMapNodes,
} from "@/components/sections/SystemMapDiagram";

export type ProjectSystemMapProps = {
  locale: AppLocale;
  map: ProjectSystemMapData;
  mapLabel: string;
  animationKey: string;
  className?: string;
};

function toLocalizedNodes(
  nodes: ProjectSystemMapData["nodes"],
): SystemMapNodes {
  return {
    inputTop: { fa: nodes.inputTop, en: nodes.inputTop },
    inputBottom: { fa: nodes.inputBottom, en: nodes.inputBottom },
    core: { fa: nodes.core, en: nodes.core },
    outputTop: { fa: nodes.outputTop, en: nodes.outputTop },
    outputBottom: { fa: nodes.outputBottom, en: nodes.outputBottom },
  };
}

/** Case-study AppWindow + system map from project frontmatter nodes. */
export function ProjectSystemMap({
  locale,
  map,
  mapLabel,
  animationKey,
  className,
}: ProjectSystemMapProps) {
  return (
    <AppWindow
      title={map.windowTitle ?? "kara://system-map"}
      className={className}
    >
      <div className="flex min-w-0 flex-col">
        <div className="px-[18px] pt-3.5">
          <SystemMapDiagram
            locale={locale}
            nodes={toLocalizedNodes(map.nodes)}
            mapLabel={mapLabel}
            animationKey={animationKey}
            layout={map.layout ?? "hub"}
          />
        </div>
        <p className="min-h-[3.4em] px-[22px] pb-3 text-start text-sm leading-[var(--leading-body)] text-win-desc">
          <b className="font-bold text-win-text">{map.descriptionLead}</b>{" "}
          {map.description}
        </p>
        <ConsoleLog
          surface="window"
          lines={[...map.logs]}
          animationKey={animationKey}
        />
      </div>
    </AppWindow>
  );
}
