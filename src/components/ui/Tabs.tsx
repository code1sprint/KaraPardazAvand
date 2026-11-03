"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { TriMarker } from "./TriMarker";

export type TabItem = {
  id: string;
  label: string;
  panel: ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
  /** Accessible name for the tablist (required for axe). */
  label: string;
  /** Show TriMarker on the selected tab. */
  withMarker?: boolean;
};

function readDir(el: HTMLElement): "rtl" | "ltr" {
  return el.ownerDocument.documentElement.dir === "rtl" ? "rtl" : "ltr";
}

export function Tabs({
  items,
  defaultValue,
  className,
  label,
  withMarker = true,
}: TabsProps) {
  const reactId = useId();
  const [activeId, setActiveId] = useState(
    defaultValue ?? items[0]?.id ?? "",
  );
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = useCallback((index: number) => {
    tabRefs.current[index]?.focus();
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = items.findIndex((item) => item.id === activeId);
      if (currentIndex < 0) return;

      const dir = readDir(event.currentTarget);
      const nextKey = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
      const prevKey = dir === "rtl" ? "ArrowRight" : "ArrowLeft";

      let nextIndex = currentIndex;
      if (event.key === nextKey) {
        nextIndex = (currentIndex + 1) % items.length;
      } else if (event.key === prevKey) {
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = items.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      const next = items[nextIndex];
      if (!next) return;
      setActiveId(next.id);
      focusTab(nextIndex);
    },
    [activeId, focusTab, items],
  );

  if (items.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        className="flex flex-wrap gap-2 border-b border-line"
        onKeyDown={onKeyDown}
      >
        {items.map((item, index) => {
          const selected = item.id === activeId;
          const tabId = `${reactId}-tab-${item.id}`;
          const panelId = `${reactId}-panel-${item.id}`;

          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={tabId}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              className={cn(
                "relative -mb-px inline-flex items-center gap-2 rounded-t-[var(--radius-control)] px-4 py-3 text-sm font-medium transition-colors",
                selected
                  ? "border border-b-panel border-line bg-panel font-bold text-text"
                  : "border border-transparent text-muted hover:text-text",
              )}
              onClick={() => setActiveId(item.id)}
            >
              {withMarker ? <TriMarker invisible={!selected} /> : null}
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const selected = item.id === activeId;
        const tabId = `${reactId}-tab-${item.id}`;
        const panelId = `${reactId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            hidden={!selected}
            className="rounded-tile border border-line bg-panel p-5"
          >
            {selected ? item.panel : null}
          </div>
        );
      })}
    </div>
  );
}
