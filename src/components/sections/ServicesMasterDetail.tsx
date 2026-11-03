"use client";

import {
  useCallback,
  useId,
  useRef,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import { ServicesDetailPane } from "@/components/sections/ServicesDetailPane";
import {
  getServiceBySlug,
  pickLocalized,
  services,
  type Service,
} from "@/content/services";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const SECTION_HASH = "services";
const DEFAULT_SLUG = services[0]!.slug;

export type ServicesMasterDetailProps = {
  locale: AppLocale;
  labels: {
    listLabel: string;
    deliverables: string;
    stack: string;
    detailLink: string;
  };
  /** Service title heading level — 2 on `/services`, 3 under home section H2. */
  titleAs?: 2 | 3;
};

function readHashSlug(): string | null {
  if (typeof window === "undefined") return null;
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw || raw === SECTION_HASH) return null;
  return getServiceBySlug(raw) ? raw : null;
}

function subscribeToHash(onStoreChange: () => void) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getClientSelectedSlug() {
  return readHashSlug() ?? DEFAULT_SLUG;
}

function getServerSelectedSlug() {
  return DEFAULT_SLUG;
}

function selectServiceHash(slug: string) {
  if (typeof window === "undefined") return;
  const next = `#${slug}`;
  if (window.location.hash === next) return;
  const url = `${window.location.pathname}${window.location.search}${next}`;
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event("hashchange"));
}

export function ServicesMasterDetail({
  locale,
  labels,
  titleAs = 3,
}: ServicesMasterDetailProps) {
  const reactId = useId();
  const selectedSlug = useSyncExternalStore(
    subscribeToHash,
    getClientSelectedSlug,
    getServerSelectedSlug,
  );
  const listRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected =
    services.find((service) => service.slug === selectedSlug) ?? services[0]!;

  const onListKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = services.findIndex((s) => s.slug === selectedSlug);
      if (currentIndex < 0) return;

      let nextIndex = currentIndex;
      if (event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % services.length;
      } else if (event.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + services.length) % services.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = services.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      const next = services[nextIndex];
      if (!next) return;
      selectServiceHash(next.slug);
      listRefs.current[nextIndex]?.focus();
    },
    [selectedSlug],
  );

  return (
    <>
      {/* Desktop / tablet master-detail */}
      <div className="hidden gap-6 md:grid md:grid-cols-12">
        <div
          role="tablist"
          aria-label={labels.listLabel}
          aria-orientation="vertical"
          className="flex flex-col gap-1 md:col-span-4"
          onKeyDown={onListKeyDown}
        >
          {services.map((service, index) => {
            const active = service.slug === selected.slug;
            const tabId = `${reactId}-tab-${service.slug}`;
            const panelId = `${reactId}-panel-${service.slug}`;

            return (
              <button
                key={service.slug}
                ref={(el) => {
                  listRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={tabId}
                aria-selected={active}
                aria-controls={panelId}
                tabIndex={active ? 0 : -1}
                className={cn(
                  "rounded-[var(--radius-button)] border px-4 py-3 text-start text-sm font-medium transition-colors",
                  active
                    ? "border-line bg-panel text-text"
                    : "border-transparent text-muted hover:bg-accent-soft hover:text-text",
                )}
                onClick={() => selectServiceHash(service.slug)}
              >
                {pickLocalized(service.title, locale)}
              </button>
            );
          })}
        </div>

        <div className="md:col-span-8">
          {/* Stacked panels keep pane height stable across selection */}
          <div className="grid rounded-[var(--radius-card)] border border-line bg-panel p-6 sm:p-8">
            {services.map((service) => {
              const active = service.slug === selected.slug;
              const tabId = `${reactId}-tab-${service.slug}`;
              const panelId = `${reactId}-panel-${service.slug}`;

              return (
                <div
                  key={service.slug}
                  role="tabpanel"
                  id={panelId}
                  aria-labelledby={tabId}
                  aria-hidden={!active}
                  inert={!active ? true : undefined}
                  className={cn(
                    "col-start-1 row-start-1",
                    active ? "visible" : "invisible",
                  )}
                >
                  <ServicesDetailPane
                    service={service}
                    locale={locale}
                    labels={labels}
                    titleAs={titleAs}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile accordion */}
      <div className="flex flex-col gap-2 md:hidden">
        {services.map((service) => (
          <MobileServiceItem
            key={service.slug}
            service={service}
            locale={locale}
            open={service.slug === selected.slug}
            labels={labels}
            titleAs={titleAs}
            onToggle={() => selectServiceHash(service.slug)}
          />
        ))}
      </div>
    </>
  );
}

type MobileServiceItemProps = {
  service: Service;
  locale: AppLocale;
  open: boolean;
  labels: ServicesMasterDetailProps["labels"];
  titleAs: 2 | 3;
  onToggle: () => void;
};

function MobileServiceItem({
  service,
  locale,
  open,
  labels,
  titleAs,
  onToggle,
}: MobileServiceItemProps) {
  const reactId = useId();
  const headerId = `${reactId}-header`;
  const panelId = `${reactId}-panel`;
  const TitleTag = titleAs === 2 ? "h2" : "h3";

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-panel">
      <TitleTag className="m-0 text-base font-medium">
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-[length:var(--control-height)] w-full items-center justify-between gap-4 px-5 py-3 text-start text-base font-medium text-text"
          onClick={onToggle}
        >
          <span>{pickLocalized(service.title, locale)}</span>
          <svg
            aria-hidden
            viewBox="0 0 12 8"
            className={cn(
              "size-3 shrink-0 text-muted transition-transform duration-200 motion-reduce:transition-none",
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
      </TitleTag>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!open}
        className="border-t border-line px-5 py-4"
      >
        {open ? (
          <ServicesDetailPane
            service={service}
            locale={locale}
            labels={labels}
            titleAs={titleAs}
          />
        ) : null}
      </div>
    </div>
  );
}
