import { cn } from "@/lib/cn";

export type BentoSceneImageProps = {
  src: string;
  className?: string;
};

/** Decorative service scene — title on the tile already names the service. */
export function BentoSceneImage({ src, className }: BentoSceneImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG scenes; avoid next/image raster pipeline
    <img
      src={src}
      alt=""
      aria-hidden
      draggable={false}
      className={cn(
        "pointer-events-none h-[140px] w-full rounded-[var(--radius-control)] object-cover object-center md:h-[160px]",
        className,
      )}
    />
  );
}
