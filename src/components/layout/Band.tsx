import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

export type BandProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  /** Soft orange radial in the band (CTA-style). */
  glow?: boolean;
  /** Skip the inner Container wrapper. */
  bare?: boolean;
  /** Whether to apply slanted edges (legacy). Defaults to false for modern horizontal bounds. */
  slanted?: boolean;
};

/**
 * Modern Navy brand band with subtle ambient lighting and micro-dot matrix.
 * Visual gap to neighbouring sections equals var(--gap-band-edge).
 * Inner padding equals var(--pad-band) (plus slant offset if slanted).
 */
export function Band({
  children,
  glow = false,
  bare = false,
  slanted = false,
  className,
  style,
  ...props
}: BandProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[linear-gradient(180deg,var(--win-deep),var(--navy))] text-on-brand",
        slanted
          ? "[clip-path:polygon(0_var(--band-slant),100%_0,100%_calc(100%-var(--band-slant)),0_100%)]"
          : "border-y border-white/[0.08]",
        className,
      )}
      style={{
        marginBlock: "calc(var(--gap-band-edge) - var(--gap-section))",
        paddingBlock: slanted
          ? "calc(var(--pad-band) + var(--band-slant))"
          : "var(--pad-band)",
        ...style,
      }}
      {...props}
    >
      {/* Micro dot matrix engineering pattern with smooth radial falloff */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-band-dots opacity-40 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_30%,transparent_90%)]"
      />

      {/* Top subtle light beam */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky/35 to-transparent"
      />

      {/* Base ambient blue radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_0%,rgba(29,109,209,0.18),transparent_80%)]"
      />

      {/* Optional CTA glow (sky + soft orange) */}
      {glow ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_50%_0,var(--glow-sky),transparent),radial-gradient(30%_40%_at_80%_100%,rgba(255,128,13,0.14),transparent)]"
        />
      ) : null}

      {/* Bottom subtle edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative">{bare ? children : <Container>{children}</Container>}</div>
    </section>
  );
}
