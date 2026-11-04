import Image from "next/image";
import { brandAssets } from "@/lib/brand";
import { cn } from "@/lib/cn";

export type ProjectCoverProps = {
  src: string;
  alt: string;
  /** next/image sizes attribute — required for stable layout. */
  sizes: string;
  className?: string;
  priority?: boolean;
};

/**
 * Fixed 16/10 brand frame so cover swaps never shift layout.
 * Subtle watermark-style white logo without background.
 */
export function ProjectCover({
  src,
  alt,
  sizes,
  className,
  priority = false,
}: ProjectCoverProps) {
  return (
    <div
      className={cn(
        "relative aspect-[16/10] w-full overflow-hidden rounded-tile border border-line bg-panel",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-0 border border-line/80" />
      <div className="pointer-events-none absolute bottom-3.5 start-3.5 select-none opacity-45 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-opacity duration-300 hover:opacity-75">
        <Image
          src={brandAssets.logoWhite}
          alt=""
          width={65}
          height={26}
          className="h-6 w-auto object-contain"
        />
      </div>
    </div>
  );
}
