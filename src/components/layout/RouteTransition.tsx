"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { MAIN_ID } from "./SkipLink";

/**
 * Applies a brief fade class on `<main>` after client navigations.
 * Renders nothing — keeps page content as a server tree (better LCP/CLS).
 * Wrap in Suspense (uses usePathname).
 */
export function RouteTransition() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const main = document.getElementById(MAIN_ID);
    if (!main) return;
    main.classList.remove("animate-route-fade");
    // Force restart of the CSS animation.
    void main.offsetWidth;
    main.classList.add("animate-route-fade");
    const id = window.setTimeout(() => {
      main.classList.remove("animate-route-fade");
    }, 320);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
