import Image from "next/image";
import { LogoTile } from "@/components/visuals/LogoTile";
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
 * Logo tile anchors the Kara Pardaz mark without inventing client logos.
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
      <div className="absolute bottom-3 start-3">
        <LogoTile size={22} className="rounded-lg p-1.5 shadow-none" />
      </div>
    </div>
  );
}
