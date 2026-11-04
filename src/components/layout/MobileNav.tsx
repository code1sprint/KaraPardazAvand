"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "./BrandMark";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const emptySubscribe = () => () => {};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

/** Full-screen mobile drawer with focus trap and Escape-to-close. */
export function MobileNav({ open, onOpenChange, children }: Props) {
  const t = useTranslations("Layout");
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    if (!panel) return;

    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );

    const first = focusables()[0];
    first?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === firstEl || !panel.contains(active)) {
          event.preventDefault();
          lastEl.focus();
        }
      } else if (active === lastEl) {
        event.preventDefault();
        firstEl.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      (previouslyFocused.current ?? trigger)?.focus();
    };
  }, [open, close]);

  const drawerContent = (
    <div
      className={cn(
        "fixed inset-0 z-[var(--drawer-z)] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
      inert={!open}
    >
      {/* Dimmed backdrop overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-navy/40 backdrop-blur-xs transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        id={titleId}
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menuLabel")}
        className={cn(
          "absolute inset-0 flex flex-col bg-bg pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] shadow-2xl transition-all duration-300 ease-out",
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0 pointer-events-none",
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <BrandMark size={24} />
            <span className="text-sm font-black leading-tight text-text">
              {t("brand.name")}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-10 px-3 text-text hover:bg-blue-soft"
            aria-label={t("nav.closeMenu")}
            onClick={close}
          >
            <span className="flex items-center gap-1.5">
              <svg
                className="size-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="text-xs font-bold">{t("nav.closeMenu")}</span>
            </span>
          </Button>
        </div>
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 py-6">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="sm"
        className="min-h-10 px-3 text-text hover:bg-blue-soft lg:hidden"
        aria-expanded={open}
        aria-controls={titleId}
        aria-haspopup="dialog"
        aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
        onClick={() => onOpenChange(!open)}
      >
        <span className="flex items-center gap-1.5">
          <svg
            className="size-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            aria-hidden="true"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
          <span className="text-xs font-bold text-text">
            {open ? t("nav.closeMenu") : t("nav.menuLabel")}
          </span>
        </span>
      </Button>

      {mounted ? createPortal(drawerContent, document.body) : null}
    </>
  );
}
