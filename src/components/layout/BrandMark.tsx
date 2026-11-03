import Image from "next/image";
import { brandAssets, logoWidthForHeight } from "@/lib/brand";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  /** Display height in px; width follows the SVG aspect ratio. */
  size?: number;
  priority?: boolean;
};

/**
 * Brand mark from `/public/brand/logo.svg` (decorative).
 * Pair with visible brand name text for a11y.
 */
export function BrandMark({ className, size = 32, priority = false }: Props) {
  const width = logoWidthForHeight(size);

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center", className)}
      aria-hidden
      style={{ height: size }}
    >
      <Image
        src={brandAssets.logo}
        alt=""
        width={width}
        height={size}
        sizes={`${width}px`}
        priority={priority}
        className="h-full w-auto max-w-none"
      />
    </span>
  );
}
