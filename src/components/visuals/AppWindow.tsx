import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AppWindowProps = HTMLAttributes<HTMLDivElement> & {
  /** Mono title centered in the title bar. */
  title?: string;
  sidebar?: ReactNode;
  children: ReactNode;
  console?: ReactNode;
  /** Max width constraint; default matches preview (1040px). */
  maxWidthClassName?: string;
};

/**
 * Dark product surface: title bar, optional sidebar, main, optional console.
 * Slots are plain flow content — no focus trap.
 */
export function AppWindow({
  title = "kara://system-map",
  sidebar,
  children,
  console: consoleSlot,
  maxWidthClassName = "max-w-[1040px]",
  className,
  ...props
}: AppWindowProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden rounded-window border border-win-line bg-win-bg text-start text-win-text shadow-[var(--shadow-window)]",
        maxWidthClassName,
        className,
      )}
      {...props}
    >
      {/* Title bar stays LTR so window dots stay on the physical left in fa/en. */}
      <div className="flex items-center gap-2 border-b border-win-line px-[18px] py-3.5 text-xs text-win-muted [direction:ltr]">
        <span aria-hidden className="size-[11px] rounded-full bg-win-dot" />
        <span aria-hidden className="size-[11px] rounded-full bg-win-dot" />
        <span aria-hidden className="size-[11px] rounded-full bg-win-dot" />
        <span className="mx-auto font-mono">{title}</span>
      </div>

      <div
        className={cn(
          "grid min-w-0",
          sidebar ? "md:grid-cols-[200px_1fr]" : "grid-cols-1",
        )}
      >
        {sidebar ? (
          <aside className="min-w-0 border-b border-win-line md:border-b-0 md:border-e">
            {sidebar}
          </aside>
        ) : null}
        <div className="min-w-0">{children}</div>
      </div>

      {consoleSlot ? (
        <div className="border-t border-win-line bg-win-deep font-mono text-xs leading-[1.9] text-win-muted [direction:ltr] text-start">
          {consoleSlot}
        </div>
      ) : null}
    </div>
  );
}
