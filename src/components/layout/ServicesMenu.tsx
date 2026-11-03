"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/components/ui/Link";
import { TriMarker } from "@/components/ui/TriMarker";
import { pickLocalized, services } from "@/content/services";
import { usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { isNavActive } from "@/lib/nav";

type Props = {
  className?: string;
  /** Compact trigger for the pill nav; larger for the mobile drawer. */
  density?: "nav" | "drawer";
  onNavigate?: () => void;
};

export function ServicesMenu({
  className,
  density = "nav",
  onNavigate,
}: Props) {
  const t = useTranslations("Layout.nav");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const active = isNavActive(pathname, "/services");

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const focusMenuItem = useCallback((index: number) => {
    const menu = rootRef.current?.querySelector<HTMLElement>('[role="menu"]');
    if (!menu) return;
    const items = Array.from(
      menu.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    items[index]?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    }

    // Focus first item when menu opens (desktop / drawer alike).
    queueMicrotask(() => focusMenuItem(0));

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close, focusMenuItem]);

  const onMenuKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      const menu = event.currentTarget;
      const items = Array.from(
        menu.querySelectorAll<HTMLElement>('[role="menuitem"]'),
      );
      if (items.length === 0) return;

      const currentIndex = items.findIndex((el) => el === document.activeElement);
      let nextIndex = currentIndex;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % items.length;
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        nextIndex =
          currentIndex < 0
            ? items.length - 1
            : (currentIndex - 1 + items.length) % items.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        nextIndex = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        nextIndex = items.length - 1;
      } else {
        return;
      }

      items[nextIndex]?.focus();
    },
    [],
  );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-pill text-sm font-medium transition-colors",
          density === "nav"
            ? "px-2 py-2 text-muted hover:text-text"
            : "w-full justify-start px-3 py-3 text-base text-text",
          active && "text-text",
        )}
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <TriMarker invisible={!active} />
        <span>{t("services")}</span>
        <span
          aria-hidden
          className={cn(
            "ms-0.5 inline-block text-[10px] text-muted transition-transform",
            open && "rotate-180",
          )}
        >
          ▾
        </span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t("servicesMenu")}
          onKeyDown={onMenuKeyDown}
          className={cn(
            "z-[calc(var(--header-z)+1)] min-w-[14rem] rounded-[var(--radius-tile)] border border-line bg-panel p-2 shadow-[var(--shadow-nav)]",
            density === "nav"
              ? "absolute start-0 top-[calc(100%+0.5rem)]"
              : "relative mt-1",
          )}
        >
          <MenuLink href="/services" onNavigate={onNavigate} close={close}>
            {t("allServices")}
          </MenuLink>
          {services.map((service) => (
            <MenuLink
              key={service.slug}
              href={`/services/${service.slug}`}
              onNavigate={onNavigate}
              close={close}
            >
              {pickLocalized(service.title, locale)}
            </MenuLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  href,
  children,
  onNavigate,
  close,
}: {
  href: string;
  children: ReactNode;
  onNavigate?: () => void;
  close: () => void;
}) {
  const pathname = usePathname();
  const active = isNavActive(pathname, href);

  return (
    <Link
      href={href}
      role="menuitem"
      variant="quiet"
      className={cn(
        "w-full justify-start gap-2 rounded-[var(--radius-control)] px-3 py-2.5 text-sm no-underline",
        active && "bg-blue-soft text-text",
      )}
      aria-current={active ? "page" : undefined}
      onClick={() => {
        close();
        onNavigate?.();
      }}
    >
      <TriMarker invisible={!active} />
      {children}
    </Link>
  );
}
