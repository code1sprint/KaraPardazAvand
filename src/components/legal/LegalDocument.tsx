import { Breadcrumbs } from "@/components/layout";
import { TableOfContents } from "@/components/insights/TableOfContents";
import { Container, Heading, Text } from "@/components/ui";
import type { TocItem } from "@/lib/mdx";
import type { ReactNode } from "react";

export type LegalDocumentProps = {
  title: string;
  summary?: string;
  updatedIso?: string;
  updatedLabel: string;
  tocLabel: string;
  toc: TocItem[];
  breadcrumbLabel: string;
  homeLabel: string;
  crumbLabel: string;
  children: ReactNode;
};

/** Shared layout for /privacy, /terms, and legacy /legal/[slug]. */
export function LegalDocument({
  title,
  summary,
  updatedIso,
  updatedLabel,
  tocLabel,
  toc,
  breadcrumbLabel,
  homeLabel,
  crumbLabel,
  children,
}: LegalDocumentProps) {
  return (
    <div className="pt-[length:var(--hero-top)]">
      <Container>
        <Breadcrumbs
          label={breadcrumbLabel}
          items={[
            { label: homeLabel, href: "/" },
            { label: crumbLabel },
          ]}
        />
        <Heading as={1} inner className="mt-2 max-w-[20ch]">
          {title}
        </Heading>
        {summary ? (
          <Text variant="muted" className="mt-3 max-w-2xl">
            {summary}
          </Text>
        ) : null}
        {updatedIso ? (
          <Text variant="caption" className="mt-2">
            {updatedLabel}
          </Text>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <article className="min-w-0 text-start">{children}</article>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <TableOfContents items={toc} label={tocLabel} />
          </aside>
        </div>
      </Container>
    </div>
  );
}
