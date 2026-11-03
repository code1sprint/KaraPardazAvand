import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

export type BandProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Soft orange radial in the band (CTA-style). */
  glow?: boolean;
  /** Skip the inner Container wrapper. */
  bare?: boolean;
};

/**
 * Navy brand band with 135deg stripe texture and slanted edges.
 * Decorative only — does not trap focus or alter tab order.
 */
export function Band({
  children,
  glow = false,
  bare = false,
  className,
  ...props
}: BandProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(135deg,var(--navy),var(--navy-2))] text-on-brand",
        "py-[length:var(--band-pad-y)]",
        "[clip-path:polygon(0_var(--band-slant),100%_0,100%_calc(100%-var(--band-slant)),0_100%)]",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-band-stripe"
      />
      {glow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_55%_at_50%_0,var(--glow-sky),transparent),radial-gradient(24%_40%_at_80%_100%,var(--orange-soft),transparent)]"
        />
      ) : null}
      <div className="relative">{bare ? children : <Container>{children}</Container>}</div>
    </section>
  );
}
