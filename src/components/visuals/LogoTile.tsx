import Image from "next/image";
import type { HTMLAttributes } from "react";
import { brandAssets, logoWidthForHeight } from "@/lib/brand";
import { cn } from "@/lib/cn";

export type LogoTileProps = HTMLAttributes<HTMLDivElement> & {
  /** CSS pixel height of the logo mark (width follows aspect ratio). */
  size?: number;
  priority?: boolean;
};

/** White tile carrying the logo — for dark product surfaces. */
export function LogoTile({
  size = 40,
  priority = false,
  className,
  ...props
}: LogoTileProps) {
  const width = logoWidthForHeight(size);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-control)] bg-panel p-2.5 shadow-[var(--shadow-logo-tile)]",
        className,
      )}
      {...props}
    >
      <Image
        src={brandAssets.logo}
        alt=""
        width={width}
        height={size}
        priority={priority}
        className="h-auto w-auto max-w-none"
        style={{ height: size, width: "auto" }}
      />
    </div>
  );
}
