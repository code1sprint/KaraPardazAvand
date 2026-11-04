import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/components/ui/Link";
import { Text } from "@/components/ui/Text";
import { TriMarker } from "@/components/ui/TriMarker";
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
import type { AppLocale } from "@/i18n/routing";

export async function SiteFooter() {
  const t = await getTranslations("Layout");
  const locale = (await getLocale()) as AppLocale;
  const parentBrandUrl = getParentBrandUrl();
  const resolvedContacts = contactChannels.filter(isResolvedContact);
  const showAddress = isResolvedAddress();

  return (
    <footer className="mt-auto">
      {/* Floating Bento CTA Launchpad */}
      <div className="relative py-12 lg:py-20">
        <Container>
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(29,109,209,0.25),transparent),linear-gradient(180deg,var(--win-deep),var(--navy))] p-8 text-center text-on-brand shadow-2xl sm:p-12 lg:p-16">
            {/* Ambient micro-dots */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-band-dots opacity-35 [mask-image:radial-gradient(ellipse_70%_50%_at_50%_40%,#000_40%,transparent_90%)]"
            />

            {/* Top subtle light beam */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky/50 to-transparent"
            />

            {/* Orange corner ambient glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -end-16 h-64 w-64 rounded-full bg-orange/10 blur-3xl"
            />

            <div className="relative flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1 text-xs font-medium text-amber backdrop-blur-sm">
                <TriMarker />
                <span>{t("footer.cta.eyebrow")}</span>
              </div>

              <h2 className="max-w-[20ch] text-h2 font-black tracking-[var(--h2-tracking)] text-on-brand">
                {t("footer.cta.headline")}
              </h2>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
                <ButtonLink href={consultCta.href} size="md" className="shadow-lg shadow-blue/20">
                  {t("footer.cta.button")}
                </ButtonLink>
                <Link
                  href="/process"
                  variant="quiet"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-on-brand backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/[0.10]"
                >
                  {t("footer.cta.secondaryButton")}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main High-Tech Footer Area */}
      <div className="relative overflow-hidden border-t border-white/[0.08] bg-[linear-gradient(180deg,var(--navy),#040a17)] pb-[env(safe-area-inset-bottom)] text-[color:var(--footer-muted)]">
        {/* Top subtle light line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky/30 to-transparent"
        />

        {/* Faded brand watermark at the bottom */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-4 inset-x-0 flex justify-center overflow-hidden opacity-[0.025] select-none text-[clamp(4rem,14vw,12rem)] font-black tracking-[0.25em] text-white whitespace-nowrap"
        >
          KARA PARDAZ
        </div>

        <Container className="relative grid gap-10 py-16 md:grid-cols-12 md:gap-8 md:py-20">
          {/* Brand Column */}
          <div className="flex flex-col gap-5 md:col-span-5">
            <div className="flex items-center gap-3">
              <LogoTile size={32} className="p-2" />
              <span className="text-lg font-bold text-on-brand">
                {t("brand.name")}
              </span>
            </div>

            <Text
              variant="muted"
              className="max-w-md text-sm leading-relaxed text-[color:var(--footer-muted)]"
            >
              {t("footer.description")}
            </Text>

            {/* System Status Badge */}
            <div className="flex items-center gap-2.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3.5 py-1.5 text-xs text-emerald-400 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-medium">{t("footer.status")}</span>
            </div>

            <a
              href={parentBrandUrl}
              className="w-fit text-xs text-[color:var(--footer-muted)] underline-offset-4 hover:text-on-brand hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("brand.family")}
            </a>
          </div>

          {/* Services Column */}
          <div className="md:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-brand">
              {t("footer.services")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    variant="quiet"
                    className="text-sm text-[color:var(--footer-muted)] transition-colors hover:text-on-brand"
                  >
                    {pickLocalized(service.title, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div className="md:col-span-2">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-brand">
              {t("footer.resources")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {resourceNav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    variant="quiet"
                    className="text-sm text-[color:var(--footer-muted)] transition-colors hover:text-on-brand"
                  >
                    {t(`footer.resourcesItems.${item.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Channels Column */}
          <div className="md:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-brand">
              {t("footer.contact")}
            </h3>
            {resolvedContacts.length > 0 || showAddress ? (
              <ul className="flex flex-col gap-2.5">
                {resolvedContacts.map((channel) => (
                  <li key={channel.id}>
                    <a
                      href={channel.href}
                      className="inline-flex items-center gap-2 text-sm text-[color:var(--footer-muted)] transition-colors hover:text-on-brand"
                      {...(channel.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <span className="text-on-brand/90 font-medium">
                        {t(`footer.channels.${channel.id}`)}:
                      </span>
                      <span>{channel.value}</span>
                    </a>
                  </li>
                ))}
                {showAddress ? (
                  <li className="text-sm text-[color:var(--footer-muted)]">
                    <span className="text-on-brand/90 font-medium">
                      {t("footer.address")}:
                    </span>{" "}
                    {contactAddress.value}
                  </li>
                ) : null}
              </ul>
            ) : (
              <div className="flex flex-col gap-3">
                <Text
                  variant="caption"
                  className="text-xs text-[color:var(--footer-muted)]"
                >
                  {t("footer.contactPending")}
                </Text>
                <Link
                  href="/contact"
                  variant="quiet"
                  className="w-fit rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  {t("nav.consult")} &larr;
                </Link>
              </div>
            )}
          </div>
        </Container>

        {/* Bottom Bar */}
        <Container className="relative flex flex-col gap-4 border-t border-white/[0.06] py-6 sm:flex-row sm:items-center sm:justify-between text-xs">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  variant="quiet"
                  className="text-[color:var(--footer-muted)] transition-colors hover:text-on-brand"
                >
                  {t(`footer.legal.${item.id}`)}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-[color:var(--footer-muted)]">
            {t("footer.copyright")}
          </p>
        </Container>
      </div>
    </footer>
  );
}
