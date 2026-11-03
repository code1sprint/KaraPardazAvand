import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Band } from "@/components/layout/Band";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/components/ui/Link";
import { Text } from "@/components/ui/Text";
import { LogoTile } from "@/components/visuals/LogoTile";
import {
  consultCta,
  contactAddress,
  contactChannels,
  getParentBrandUrl,
  isResolvedAddress,
  isResolvedContact,
  legalLinks,
  resourceNav,
} from "@/content/site";
import { pickLocalized, services } from "@/content/services";
import { brandAssetSize, brandAssets } from "@/lib/brand";
import type { AppLocale } from "@/i18n/routing";

export async function SiteFooter() {
  const t = await getTranslations("Layout");
  const locale = (await getLocale()) as AppLocale;
  const parentBrandUrl = getParentBrandUrl();
  const resolvedContacts = contactChannels.filter(isResolvedContact);
  const showAddress = isResolvedAddress();

  return (
    <footer className="mt-auto">
      <Band glow className="text-center">
        <h2 className="mx-auto max-w-[18ch] text-h2 font-black tracking-[var(--h2-tracking)] text-on-brand">
          {t("footer.cta.headline")}
        </h2>
        <div className="mt-8 flex justify-center">
          <ButtonLink href={consultCta.href} size="md">
            {t("footer.cta.button")}
          </ButtonLink>
        </div>
      </Band>

      <div className="relative overflow-hidden bg-navy pb-[env(safe-area-inset-bottom)] text-[color:var(--footer-muted)]">
        <Image
          src={brandAssets.logo}
          alt=""
          width={brandAssetSize.logo.width}
          height={brandAssetSize.logo.height}
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -start-8 w-[min(100%,32rem)] opacity-[var(--footer-wm-opacity)] brightness-[2.2] select-none"
        />

        <Container className="relative grid gap-10 py-16 md:grid-cols-12 md:gap-8 md:py-20">
          <div className="flex flex-col gap-4 md:col-span-4">
            <div className="flex items-center gap-3">
              <LogoTile size={28} className="p-2" />
              <span className="text-base font-bold text-on-brand">
                {t("brand.name")}
              </span>
            </div>
            <Text
              variant="muted"
              className="max-w-md text-sm text-[color:var(--footer-muted)] sm:text-sm"
            >
              {t("footer.description")}
            </Text>
            <a
              href={parentBrandUrl}
              className="w-fit rounded-sm text-sm text-[color:var(--footer-muted)] underline-offset-2 hover:text-on-brand hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("brand.family")}
            </a>
          </div>

          <div className="md:col-span-2">
            <h2 className="mb-3 text-sm font-semibold text-on-brand">
              {t("footer.services")}
            </h2>
            <ul className="flex flex-col gap-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    variant="quiet"
                    className="text-sm text-[color:var(--footer-muted)] hover:text-on-brand"
                  >
                    {pickLocalized(service.title, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="mb-3 text-sm font-semibold text-on-brand">
              {t("footer.resources")}
            </h2>
            <ul className="flex flex-col gap-2">
              {resourceNav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    variant="quiet"
                    className="text-sm text-[color:var(--footer-muted)] hover:text-on-brand"
                  >
                    {t(`footer.resourcesItems.${item.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="mb-3 text-sm font-semibold text-on-brand">
              {t("footer.contact")}
            </h2>
            {resolvedContacts.length > 0 || showAddress ? (
              <ul className="flex flex-col gap-2">
                {resolvedContacts.map((channel) => (
                  <li key={channel.id}>
                    <a
                      href={channel.href}
                      className="rounded-sm text-sm text-[color:var(--footer-muted)] underline-offset-2 hover:text-on-brand hover:underline"
                      {...(channel.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span className="text-on-brand/90">
                        {t(`footer.channels.${channel.id}`)}
                        {": "}
                      </span>
                      {channel.value}
                    </a>
                  </li>
                ))}
                {showAddress ? (
                  <li>
                    <p className="text-sm text-[color:var(--footer-muted)]">
                      <span className="text-on-brand/90">
                        {t("footer.address")}
                        {": "}
                      </span>
                      {contactAddress.value}
                    </p>
                  </li>
                ) : null}
              </ul>
            ) : (
              <Text
                variant="caption"
                className="text-[color:var(--footer-muted)]"
              >
                {t("footer.contactPending")}
              </Text>
            )}
          </div>
        </Container>

        <Container className="relative flex flex-col gap-3 border-t border-win-line py-6 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {legalLinks.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  variant="quiet"
                  className="text-sm text-[color:var(--footer-muted)] hover:text-on-brand"
                >
                  {t(`footer.legal.${item.id}`)}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[color:var(--footer-muted)]">
            {t("footer.copyright")}
          </p>
        </Container>
      </div>
    </footer>
  );
}
