"use client";

import { Suspense, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/components/ui/Link";
import { consultCta } from "@/content/site";
import { cn } from "@/lib/cn";
import { BrandMark } from "./BrandMark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

function LanguageSwitcherFallback() {
  return (
    <div
      className="inline-flex h-11 w-[6.5rem] items-center rounded-pill border border-line bg-panel/80 p-1"
      aria-hidden
    />
  );
}

function NavLinksFallback({
  orientation = "horizontal",
}: {
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      className={cn(
        orientation === "horizontal"
          ? "h-11 w-[min(28rem,50vw)]"
          : "flex h-40 flex-col gap-2",
      )}
      aria-hidden
    />
  );
}

/** Sticky centered glass pill navbar (v3). */
export function FloatingNav() {
  const t = useTranslations("Layout");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 2);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onResize() {
      /* Horizontal pill links start at lg — keep drawer closed once that layout wins. */
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={cn(
        "sticky z-[var(--header-z)] h-[length:var(--nav-block-height)] px-3",
        "top-[max(0px,env(safe-area-inset-top))]",
        "pt-[length:var(--nav-offset-top)]",
      )}
    >
      <div
        className={cn(
          "mx-auto flex h-[length:var(--nav-pill-height)] max-w-[length:var(--nav-max)] items-center gap-3",
          "rounded-pill border bg-[var(--nav-glass)]",
          "py-[length:var(--nav-pad-y)] ps-[length:var(--nav-pad-inline-start)] pe-[length:var(--nav-pad-inline-end)]",
          "backdrop-blur-[length:var(--nav-blur)] supports-[backdrop-filter]:bg-[var(--nav-glass)]",
          "shadow-[var(--shadow-nav)] transition-[border-color,box-shadow] duration-[var(--motion-hover)]",
          scrolled ? "border-line" : "border-line/60",
        )}
      >
        <Link
          href="/"
          variant="nav"
          className="flex shrink-0 items-center gap-2.5 ps-3.5 whitespace-nowrap no-underline hover:no-underline"
          aria-label={t("brand.homeAria")}
        >
          <BrandMark priority size={26} />
          <span className="truncate text-sm font-black leading-tight text-text sm:text-[15px]">
            {t("brand.name")}
          </span>
        </Link>

        <nav
          className="ms-auto hidden shrink-0 lg:block"
          aria-label={t("nav.primaryLabel")}
        >
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-2 lg:ms-0">
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <Suspense fallback={<LanguageSwitcherFallback />}>
              <LanguageSwitcher className="border-line/80 bg-panel/70" />
            </Suspense>
            <ButtonLink href={consultCta.href} size="sm">
              {t("nav.consult")}
            </ButtonLink>
          </div>

          <MobileNav open={menuOpen} onOpenChange={setMenuOpen}>
            <nav aria-label={t("nav.primaryLabel")}>
              <Suspense
                fallback={<NavLinksFallback orientation="vertical" />}
              >
                <NavLinks
                  orientation="vertical"
                  onNavigate={() => setMenuOpen(false)}
                />
              </Suspense>
            </nav>
            <div className="flex flex-col gap-4 border-t border-line pt-6">
              <ButtonLink
                href={consultCta.href}
                size="sm"
                className="min-h-12 w-full"
                onClick={() => setMenuOpen(false)}
              >
                {t("nav.consult")}
              </ButtonLink>
              <Suspense fallback={<LanguageSwitcherFallback />}>
                <LanguageSwitcher
                  className="self-start"
                  onNavigate={() => setMenuOpen(false)}
                />
              </Suspense>
            </div>
          </MobileNav>
        </div>
      </div>
    </header>
  );
}

/** @deprecated Use FloatingNav — kept as alias during Phase 3 migration. */
export const SiteHeader = FloatingNav;
