"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/components/ui/Link";
import { TriMarker } from "@/components/ui/TriMarker";
import { primaryNav } from "@/content/site";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { isNavActive } from "@/lib/nav";
import { ServicesMenu } from "./ServicesMenu";

type Props = {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
  orientation?: "horizontal" | "vertical";
  /** Show services as a dropdown (desktop) or expandable list (drawer). */
  withServicesMenu?: boolean;
};

export function NavLinks({
  className,
  linkClassName,
  onNavigate,
  orientation = "horizontal",
  withServicesMenu = true,
}: Props) {
  const t = useTranslations("Layout.nav");
  const pathname = usePathname();
  const density = orientation === "vertical" ? "drawer" : "nav";

  return (
    <ul
      className={cn(
        orientation === "horizontal"
          ? "flex flex-nowrap items-center gap-3 lg:gap-3.5 xl:gap-5"
          : "flex flex-col gap-1",
        className,
      )}
    >
      {primaryNav.map((item) => {
        if (item.id === "services" && withServicesMenu) {
          return (
            <li
              key={item.id}
              className={orientation === "vertical" ? "w-full" : "shrink-0"}
            >
              <ServicesMenu
                density={density}
                onNavigate={onNavigate}
              />
            </li>
          );
        }

        const active = isNavActive(pathname, item.href);

        return (
          <li
            key={item.id}
            className={orientation === "vertical" ? "w-full" : "shrink-0"}
          >
            <Link
              href={item.href}
              variant="nav"
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-pill text-sm font-medium no-underline hover:no-underline",
                orientation === "horizontal"
                  ? "text-muted hover:text-text"
                  : "w-full justify-start px-3 py-3 text-base text-text",
                active && "text-text",
                linkClassName,
              )}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <TriMarker invisible={!active} />
              {t(item.id)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
