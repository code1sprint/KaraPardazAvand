import type { ReactNode } from "react";
import { Container } from "./Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";

export type PageHeroProps = {
  id?: string;
  headingId?: string;
  breadcrumbs?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  containerClassName?: string;
  children?: ReactNode;
};

/**
 * Standard hero primitive for inner pages.
 * Top padding is --hero-top (below sticky floating nav).
 * Bottom whitespace to first section is owned by <main> flex gap.
 * Inner H1 uses clamp(32px, 4.6vw, 56px) with locale-aware line-height and text-wrap: balance.
 */
export function PageHero({
  id,
  headingId,
  breadcrumbs,
  eyebrow,
  title,
  lead,
  className,
  containerClassName,
  children,
}: PageHeroProps) {
  const finalHeadingId = headingId || (id ? `${id}-heading` : undefined);

  return (
    <header
      id={id}
      aria-labelledby={finalHeadingId}
      className={cn("w-full", className)}
      style={{ paddingTop: "var(--hero-top)" }}
    >
      <Container className={containerClassName}>
        {breadcrumbs ? <div className="mb-6">{breadcrumbs}</div> : null}
        {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
        <Heading
          as={1}
          id={finalHeadingId}
          inner
          className="max-w-4xl"
        >
          {title}
        </Heading>
        {lead ? (
          <Text
            variant="muted"
            className="mt-4 max-w-4xl text-base leading-[var(--leading-body)] sm:text-lg"
          >
            {lead}
          </Text>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </header>
  );
}
