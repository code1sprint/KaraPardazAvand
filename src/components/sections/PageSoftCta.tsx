import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export type PageSoftCtaProps = {
  title: string;
  lead: string;
  buttonLabel: string;
  href?: string;
  headingId?: string;
};

/**
 * Quiet page-level CTA row. Footer keeps the navy Band CTA.
 */
export function PageSoftCta({
  title,
  lead,
  buttonLabel,
  href = "/contact",
  headingId = "page-soft-cta",
}: PageSoftCtaProps) {
  return (
    <Section
      aria-labelledby={headingId}
      className="pb-[length:var(--section-pad-y)] pt-0"
    >
      <Container>
        <div className="flex flex-col items-start gap-4 rounded-tile border border-line bg-panel px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="max-w-xl">
            <Heading as={2} id={headingId} className="text-xl sm:text-2xl">
              {title}
            </Heading>
            <Text variant="muted" className="mt-2">
              {lead}
            </Text>
          </div>
          <ButtonLink href={href} size="md" className="shrink-0">
            {buttonLabel}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
