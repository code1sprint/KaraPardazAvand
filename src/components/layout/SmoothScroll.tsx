"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Global smooth scrolling provider for public-facing pages via Lenis.
 * - Excludes admin panel (`/admin`) to avoid interfering with rich text editors and dashboard tables.
 * - Respects `prefers-reduced-motion: reduce`.
 * - Preserves native touch momentum on touch devices (`syncTouch: false`).
 * - Handles offset for the sticky floating navbar on anchor clicks.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Completely disable/destroy on admin routes
    const isAdmin = pathname.startsWith("/admin");
    if (isAdmin) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        window.__lenis = undefined;
      }
      return;
    }

    // Respect user motion accessibility preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        window.__lenis = undefined;
      }
      return;
    }

    // Initialize Lenis for public routes
    if (!lenisRef.current) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.5,
        infinite: false,
        syncTouch: false,
        autoRaf: true,
        anchors: {
          offset: -90,
        },
        prevent: (node) => {
          return Boolean(node.closest?.(".admin-root, [data-lenis-prevent]"));
        },
      });

      lenisRef.current = lenis;
      window.__lenis = lenis;

      const onMotionChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          lenis.destroy();
          lenisRef.current = null;
          window.__lenis = undefined;
        }
      };

      mediaQuery.addEventListener("change", onMotionChange);

      return () => {
        mediaQuery.removeEventListener("change", onMotionChange);
        lenis.destroy();
        lenisRef.current = null;
        window.__lenis = undefined;
      };
    }
  }, [pathname]);

  // Reset scroll to top upon navigating between pages (unless navigation targets a hash)
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    if (typeof window !== "undefined" && window.location.hash) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}
