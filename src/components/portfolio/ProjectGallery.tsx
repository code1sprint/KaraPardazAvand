import Image from "next/image";
import type { ProjectGalleryItem } from "@/content/project-meta";
import { cn } from "@/lib/cn";

export type ProjectGalleryProps = {
  items: readonly ProjectGalleryItem[];
  label: string;
  className?: string;
};

/**
 * Case-study gallery — fixed aspect frames + captions; no layout shift.
 */
export function ProjectGallery({
  items,
  label,
  className,
}: ProjectGalleryProps) {
  if (items.length === 0) return null;

  return (
    <ul
      aria-label={label}
      className={cn(
        "grid gap-6 sm:grid-cols-2",
        className,
      )}
    >
      {items.map((item) => (
        <li key={`${item.src}-${item.caption}`}>
          <figure className="flex flex-col gap-3">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-tile border border-line bg-panel">
              <Image
                src={item.src}
                alt={item.alt ?? item.caption}
                fill
                sizes="(max-width: 640px) 100vw, 28rem"
                className="object-cover"
              />
            </div>
            <figcaption className="text-sm text-muted">{item.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
