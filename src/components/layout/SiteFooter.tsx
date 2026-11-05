import Image from "next/image";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import { FooterCta } from "@/components/layout/FooterCta";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Link } from "@/components/ui/Link";
import { Text } from "@/components/ui/Text";
import { TriMarker } from "@/components/ui/TriMarker";
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
    <footer
      className="mt-auto"
      style={{ paddingTop: "var(--gap-section)" }}
    >
      {/* Global Closing Bento CTA Launchpad (omitted on /contact) */}
      <Suspense fallback={null}>
        <FooterCta>
          <div
            data-footer-cta="true"
            className="relative"
            style={{ paddingBottom: "var(--gap-section)" }}
          >
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

                  <h2 className="max-w-[var(--cta-heading-max,20ch)] [text-wrap:balance] text-h2 font-black leading-[var(--lh-h2,1.25)] tracking-[var(--h2-tracking)] text-on-brand">
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
        </FooterCta>
      </Suspense>

      {/* Main High-Tech Footer Area */}
      <div className="relative overflow-hidden border-t border-white/[0.08] bg-[linear-gradient(180deg,var(--navy),#040a17)] pb-6 text-[color:var(--footer-muted)]">
        {/* Top subtle light line */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky/30 to-transparent"
        />

        {/* Faded brand watermark clipped to bottom area behind content */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 inset-x-0 h-28 overflow-hidden flex items-end justify-center opacity-[0.08] select-none text-[clamp(2rem,6.5vw,5rem)] font-black tracking-[0.18em] text-white whitespace-nowrap z-0"
        >
          KARA PARDAZ AVAND
        </div>

        <Container className="relative z-10 grid gap-10 py-16 md:grid-cols-12 md:gap-8 md:py-20">
          {/* Brand Column */}
          <div className="flex flex-col gap-5 md:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3.5 transition-opacity hover:opacity-90 w-fit"
              aria-label={t("brand.homeAria")}
            >
              <Image
                src={brandAssets.markOnDark}
                alt={t("brand.name")}
                width={Math.round(
                  (40 * brandAssetSize.markOnDark.width) /
                    brandAssetSize.markOnDark.height,
                )}
                height={40}
                className="h-10 w-auto object-contain"
              />
              <div className="flex flex-col text-start">
                <span className="text-xl font-black tracking-tight text-white leading-tight">
                  {t("brand.name")}
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-sky-300/80 uppercase">
                  {locale === "fa" ? "Kara Pardaz Avand" : "کارا پرداز اوند"}
                </span>
              </div>
            </Link>

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
                        ? { target: "_blank", rel: "me noopener noreferrer" }
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
            ) : null}

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/contact"
                variant="quiet"
                className="w-fit rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                {t("nav.consult")} &larr;
              </Link>
            </div>

            {process.env.NEXT_PUBLIC_TRUST_BADGE_HTML ? (
              <div
                className="mt-4 flex items-center gap-2"
                dangerouslySetInnerHTML={{ __html: process.env.NEXT_PUBLIC_TRUST_BADGE_HTML }}
              />
            ) : null}
          </div>
        </Container>

        {/* Bottom Bar */}
        <Container className="relative z-10 flex flex-col gap-4 border-t border-white/[0.06] py-6 sm:flex-row sm:items-center sm:justify-between text-xs">
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
