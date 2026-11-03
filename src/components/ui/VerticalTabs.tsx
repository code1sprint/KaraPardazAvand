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

export type VerticalTabItem = {
  id: string;
  label: string;
  panel?: ReactNode;
};

export type VerticalTabsProps = {
  items: VerticalTabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (id: string) => void;
  className?: string;
  listClassName?: string;
  /** Accessible name for the tablist (required for axe). */
  label: string;
  /** Dark product-surface styling (AppWindow sidebar). */
  surface?: "page" | "window";
  /** When false, only the tablist is rendered (panel owned by parent). */
  renderPanels?: boolean;
  /** Shared panel id when `renderPanels` is false (aria-controls). */
  panelId?: string;
};

function readDir(el: HTMLElement): "rtl" | "ltr" {
  return el.ownerDocument.documentElement.dir === "rtl" ? "rtl" : "ltr";
}

export function VerticalTabs({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
  listClassName,
  label,
  surface = "page",
  renderPanels = true,
  panelId,
}: VerticalTabsProps) {
  const reactId = useId();
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? items[0]?.id ?? "",
  );
  const activeId = isControlled ? value : uncontrolled;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const setActive = useCallback(
    (id: string) => {
      if (!isControlled) setUncontrolled(id);
      onValueChange?.(id);
    },
    [isControlled, onValueChange],
  );

  const focusTab = useCallback((index: number) => {
    tabRefs.current[index]?.focus();
  }, []);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = items.findIndex((item) => item.id === activeId);
      if (currentIndex < 0) return;

      const dir = readDir(event.currentTarget);
      /* Vertical: ArrowUp/Down always; horizontal keys respect RTL for mobile row. */
      let nextIndex = currentIndex;
      if (event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % items.length;
      } else if (event.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + items.length) % items.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex =
          dir === "rtl"
            ? (currentIndex + 1) % items.length
            : (currentIndex - 1 + items.length) % items.length;
      } else if (event.key === "ArrowRight") {
        nextIndex =
          dir === "rtl"
            ? (currentIndex - 1 + items.length) % items.length
            : (currentIndex + 1) % items.length;
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
      setActive(next.id);
      focusTab(nextIndex);
    },
    [activeId, focusTab, items, setActive],
  );

  if (items.length === 0) return null;

  const isWindow = surface === "window";

  return (
    <div
      className={cn(
        renderPanels ? "flex flex-col gap-4 md:flex-row" : undefined,
        className,
      )}
    >
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="vertical"
        className={cn(
          "flex gap-1 overflow-x-auto md:flex-col md:overflow-visible",
          isWindow
            ? "border-b border-win-line p-3.5 md:border-b-0 md:border-e"
            : "rounded-tile border border-line bg-panel p-2",
          listClassName,
        )}
        onKeyDown={onKeyDown}
      >
        {items.map((item, index) => {
          const selected = item.id === activeId;
          const tabId = `${reactId}-vtab-${item.id}`;
          const generatedPanelId = `${reactId}-vpanel-${item.id}`;
          const controlsId = renderPanels
            ? generatedPanelId
            : panelId;

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
              aria-controls={controlsId}
              tabIndex={selected ? 0 : -1}
              className={cn(
                "inline-flex shrink-0 items-center gap-2.5 rounded-[var(--radius-node)] px-3 py-2.5 text-start text-sm transition-colors",
                isWindow
                  ? selected
                    ? "bg-sky-soft font-bold text-win-text"
                    : "text-win-muted hover:text-win-text"
                  : selected
                    ? "bg-blue-soft font-bold text-text"
                    : "text-muted hover:bg-blue-soft hover:text-text",
              )}
              onClick={() => setActive(item.id)}
            >
              <TriMarker invisible={!selected} />
              {item.label}
            </button>
          );
        })}
      </div>

      {renderPanels
        ? items.map((item) => {
            const selected = item.id === activeId;
            const tabId = `${reactId}-vtab-${item.id}`;
            const panelId = `${reactId}-vpanel-${item.id}`;

            return (
              <div
                key={item.id}
                role="tabpanel"
                id={panelId}
                aria-labelledby={tabId}
                hidden={!selected}
                className="min-w-0 flex-1"
              >
                {selected ? item.panel : null}
              </div>
            );
          })
        : null}
    </div>
  );
}
