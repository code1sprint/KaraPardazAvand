"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { TriMarker } from "./TriMarker";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
};

export type AccordionProps = {
  items: AccordionItem[];
  /** Allow multiple panels open at once. Default: false. */
  multiple?: boolean;
  defaultOpenIds?: string[];
  /** Sync open panel with `#itemId` and scroll into view. */
  deepLink?: boolean;
  className?: string;
};

function readHashId(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash.replace(/^#/, "").trim();
}

function subscribeToHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function writeHash(id: string | null) {
  if (typeof window === "undefined") return;
  const next =
    id === null
      ? `${window.location.pathname}${window.location.search}`
      : `#${id}`;
  if (id === null) {
    if (!window.location.hash) return;
    window.history.replaceState(null, "", next);
  } else if (window.location.hash === next) {
    return;
  } else {
    window.history.replaceState(null, "", next);
  }
  window.dispatchEvent(new Event("hashchange"));
}

export function Accordion({
  items,
  multiple = false,
  defaultOpenIds = [],
  deepLink = false,
  className,
}: AccordionProps) {
  const reactId = useId();
  const [manualOpenIds, setManualOpenIds] = useState<string[]>(defaultOpenIds);
  const headerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hashId = useSyncExternalStore(subscribeToHash, readHashId, () => "");

  const validHashId = useMemo(() => {
    if (!deepLink || !hashId) return "";
    return items.some((item) => item.id === hashId) ? hashId : "";
  }, [deepLink, hashId, items]);

  const openIds = useMemo(() => {
    if (!validHashId) return manualOpenIds;
    if (!multiple) return [validHashId];
    return manualOpenIds.includes(validHashId)
      ? manualOpenIds
      : [...manualOpenIds, validHashId];
  }, [manualOpenIds, multiple, validHashId]);

  useEffect(() => {
    if (!validHashId) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.getElementById(validHashId)?.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [validHashId]);

  function toggle(id: string) {
    const isOpen = openIds.includes(id);

    if (multiple) {
      const next = isOpen
        ? manualOpenIds.filter((x) => x !== id)
        : manualOpenIds.includes(id)
          ? manualOpenIds
          : [...manualOpenIds, id];
      setManualOpenIds(next);
      if (deepLink) {
        writeHash(isOpen ? (next[0] ?? null) : id);
      }
      return;
    }

    const next = isOpen ? [] : [id];
    setManualOpenIds(next);
    if (deepLink) {
      writeHash(isOpen ? null : id);
    }
  }

  const onHeaderKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex = index;
      if (event.key === "ArrowDown") {
        nextIndex = (index + 1) % items.length;
      } else if (event.key === "ArrowUp") {
        nextIndex = (index - 1 + items.length) % items.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = items.length - 1;
      } else {
        return;
      }
      event.preventDefault();
      headerRefs.current[nextIndex]?.focus();
    },
    [items.length],
  );

  if (items.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {items.map((item, index) => {
        const open = openIds.includes(item.id);
        const headerId = `${reactId}-header-${item.id}`;
        const panelId = `${reactId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            id={item.id}
            className="scroll-mt-28 overflow-hidden rounded-tile border border-line bg-panel"
          >
            <h3 className="m-0">
              <button
                ref={(el) => {
                  headerRefs.current[index] = el;
                }}
                type="button"
                id={headerId}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex h-[length:var(--control-height)] w-full items-center justify-between gap-4 px-5 text-start text-base font-medium text-text"
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => onHeaderKeyDown(event, index)}
              >
                <span className="inline-flex items-center gap-2.5">
                  <TriMarker invisible={!open} />
                  {item.title}
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 12 8"
                  className={cn(
                    "size-3 shrink-0 text-muted transition-transform duration-200",
                    open && "rotate-180",
                  )}
                  fill="none"
                >
                  <path
                    d="M1 1.5 6 6.5 11 1.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!open}
              className="border-t border-line px-5 py-4"
            >
              {open ? item.content : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
