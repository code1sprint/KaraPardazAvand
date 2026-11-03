"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

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

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="sm"
        className="min-h-11 min-w-11 px-3 lg:hidden"
        aria-expanded={open}
        aria-controls={titleId}
        aria-haspopup="dialog"
        onClick={() => onOpenChange(!open)}
      >
        {open ? t("nav.closeMenu") : t("nav.openMenu")}
      </Button>

      <div
        className={cn(
          "fixed inset-0 z-[var(--drawer-z)] lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
        {...(!open ? { inert: true } : {})}
      >
        <div
          ref={panelRef}
          id={titleId}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.menuLabel")}
          className={cn(
            "absolute inset-0 flex flex-col bg-bg pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] transition-opacity duration-[var(--motion-hover)]",
            open ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
            <p className="text-base font-semibold text-text">
              {t("nav.menuLabel")}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="min-h-11 min-w-11 px-3"
              onClick={close}
            >
              {t("nav.closeMenu")}
            </Button>
          </div>
          <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-5 py-6">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
