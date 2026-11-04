import type { HTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type TileSpan = 2 | 3 | 4 | 6;

export type TileProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  /** Dark navy gradient variant (bento accent tile). */
  dark?: boolean;
  /** Optional title / body above the visual slot. */
  title?: string;
  description?: string;
  /** Visual / mini-UI slot pinned to the bottom. */
  visual?: ReactNode;
  /** Bento column span on a 6-col grid (mobile always full). */
  span?: TileSpan;
  /** When set, the whole tile is one focusable link (overlay). */
  href?: string;
  /** Accessible name for the overlay link; defaults to title. */
  linkLabel?: string;
};

const spanClass: Record<TileSpan, string> = {
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  6: "md:col-span-6",
};

/** Bento tile with hover lift — 1px border, shadow only on hover. */
export function Tile({
  children,
  dark = false,
  title,
  description,
  visual,
  span = 2,
  href,
  linkLabel,
  className,
  ...props
}: TileProps) {
  return (
    <article
      className={cn(
        "relative col-span-6 flex flex-col overflow-hidden rounded-tile border p-7 transition-[transform,border-color,box-shadow] duration-[var(--motion-tile)]",
        "hover:-translate-y-1 hover:border-tile-hover-line hover:shadow-[var(--shadow-tile-hover)]",
        dark
          ? "border-transparent bg-[linear-gradient(150deg,var(--tile-dark-from),var(--tile-dark-to))] text-on-brand"
          : "border-line bg-panel text-text",
        spanClass[span],
        className,
      )}
      {...props}
    >
      {href ? (
        <Link
          href={href}
          className="absolute inset-0 z-10 rounded-tile focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          aria-label={linkLabel ?? title}
        />
      ) : null}
      {title ? (
        <h3 className="m-0 mb-1.5 text-[21px] font-extrabold">{title}</h3>
      ) : null}
      {description ? (
        <p
          className={cn(
            "m-0 max-w-[34ch] text-[14.5px]",
            dark ? "text-band-muted" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
      {children}
      {visual ? <div className="mt-auto pt-[22px]">{visual}</div> : null}
    </article>
  );
}
