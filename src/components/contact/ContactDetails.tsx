import { getLocale, getTranslations } from "next-intl/server";
import {
  contactBooking,
  contactResponseTime,
  contactWorkingHours,
  isResolvedBooking,
  isResolvedWorkingHours,
} from "@/content/contact";
import {
  contactAddress,
  contactChannels,
  isResolvedAddress,
  isResolvedContact,
  type ContactChannelKind,
} from "@/content/site";
import { pickLocalized } from "@/content/services";
import { Heading, Text } from "@/components/ui";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

const DETAIL_CHANNEL_ORDER: ContactChannelKind[] = [
  "email",
  "phone",
  "telegram",
  "whatsapp",
];

export type ContactDetailsProps = {
  className?: string;
};

export async function ContactDetails({ className }: ContactDetailsProps) {
  const t = await getTranslations("Contact");
  const locale = (await getLocale()) as AppLocale;

  const channels = DETAIL_CHANNEL_ORDER.flatMap((id) => {
    const channel = contactChannels.find((item) => item.id === id);
    return channel && isResolvedContact(channel) ? [channel] : [];
  });

  const showAddress = isResolvedAddress();
  const showHours = isResolvedWorkingHours();
  const showBooking = isResolvedBooking();
  const responseTime = pickLocalized(contactResponseTime.text, locale);

  const hasAnyChannel =
    channels.length > 0 || showAddress || showHours || showBooking;

  return (
    <aside
      className={cn(
        "rounded-tile border border-line bg-panel px-6 py-7 sm:px-7",
        className,
      )}
      aria-labelledby="contact-details-heading"
    >
      <Heading as={2} id="contact-details-heading" className="text-xl sm:text-2xl">
        {t("details.title")}
      </Heading>
      <Text variant="muted" className="mt-2">
        {t("details.lead")}
      </Text>

      {hasAnyChannel ? (
        <ul className="mt-6 flex flex-col gap-4">
          {channels.map((channel) => (
            <li key={channel.id}>
              <p className="text-sm font-medium text-text">
                {t(`details.channels.${channel.id}`)}
              </p>
              <a
                href={channel.href}
                className="mt-1 inline-block text-base text-blue underline-offset-2 hover:underline"
                {...(channel.href.startsWith("http")
                  ? { target: "_blank", rel: "me noopener noreferrer" }
                  : {})}
              >
                {channel.value}
              </a>
            </li>
          ))}

          {showAddress ? (
            <li>
              <p className="text-sm font-medium text-text">
                {t("details.address")}
              </p>
              <p className="mt-1 text-base text-muted">{contactAddress.value}</p>
            </li>
          ) : null}

          {showHours ? (
            <li>
              <p className="text-sm font-medium text-text">
                {t("details.hours")}
              </p>
              <p className="mt-1 text-base text-muted">
                {contactWorkingHours.value}
              </p>
            </li>
          ) : null}

          {showBooking ? (
            <li>
              <a
                href={contactBooking.href}
                className="inline-flex text-base font-medium text-blue underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {pickLocalized(contactBooking.label, locale)}
              </a>
            </li>
          ) : null}
        </ul>
      ) : (
        <Text variant="muted" className="mt-6" role="status">
          {t("details.emptyChannels")}
        </Text>
      )}

      <div className="mt-8 border-t border-line pt-5">
        <p className="text-sm font-medium text-text">
          {t("details.responseTimeLabel")}
        </p>
        <Text variant="muted" className="mt-1">
          {responseTime}
        </Text>
      </div>
    </aside>
  );
}

/** First resolved channel suitable as a failure fallback link. */
export function getAlternateContactChannel(): {
  href: string;
  kind: ContactChannelKind;
} | null {
  for (const id of DETAIL_CHANNEL_ORDER) {
    const channel = contactChannels.find((item) => item.id === id);
    if (channel && isResolvedContact(channel)) {
      return { href: channel.href, kind: channel.id };
    }
  }
  return null;
}
