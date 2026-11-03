import { Chip } from "@/components/ui/Chip";
import { Heading } from "@/components/ui/Heading";
import { Link } from "@/components/ui/Link";
import { Text } from "@/components/ui/Text";
import {
  pickLocalized,
  type Service,
} from "@/content/services";
import type { AppLocale } from "@/i18n/routing";

export type ServicesDetailPaneProps = {
  service: Service;
  locale: AppLocale;
  labels: {
    deliverables: string;
    stack: string;
    detailLink: string;
  };
  /** Heading level for the service title (home section → 3, services page → 2). */
  titleAs?: 2 | 3;
};

export function ServicesDetailPane({
  service,
  locale,
  labels,
  titleAs = 3,
}: ServicesDetailPaneProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Heading as={titleAs} className="text-xl sm:text-2xl">
          {pickLocalized(service.title, locale)}
        </Heading>
        <Text variant="muted">{pickLocalized(service.outcome, locale)}</Text>
      </div>

      <div className="flex flex-col gap-2">
        <Text as="p" variant="caption" className="font-semibold text-text">
          {labels.deliverables}
        </Text>
        <ul className="flex flex-col gap-2 ps-5">
          {service.deliverables.map((item) => (
            <li
              key={pickLocalized(item.title, locale)}
              className="list-disc text-start text-base leading-[var(--leading-body)] text-text marker:text-muted sm:text-[length:var(--text-body-lg)]"
            >
              {pickLocalized(item.title, locale)}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <Text as="p" variant="caption" className="font-semibold text-text">
          {labels.stack}
        </Text>
        <div className="flex flex-wrap gap-2">
          {service.stack.flatMap((group) =>
            group.items.map((tech) => (
              <Chip key={`${pickLocalized(group.label, locale)}-${tech}`} tone="panel">
                {tech}
              </Chip>
            )),
          )}
        </div>
      </div>

      <Link
        href={`/services/${service.slug}`}
        className="w-fit text-sm font-medium"
      >
        {labels.detailLink}
      </Link>
    </div>
  );
}
