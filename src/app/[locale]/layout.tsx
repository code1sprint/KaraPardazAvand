import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import {
  FloatingNav,
  MAIN_ID,
  RouteTransition,
  SiteFooter,
  SkipLink,
} from "@/components/layout";
import { JsonLdSite } from "@/components/seo/JsonLdSite";
import { PrivacyAnalytics } from "@/components/seo/PrivacyAnalytics";
import { getSiteUrl } from "@/content/site";
import { routing } from "@/i18n/routing";
import { jetbrainsMono, vazirmatn } from "@/lib/fonts";
import { getLocaleDirection } from "@/lib/locales";
import { cn } from "@/lib/cn";
import "../globals.css";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F6F9FE",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  "use cache";
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    applicationName: t("siteName"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: locale === "fa" ? "fa_IR" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const dir = getLocaleDirection(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={cn(
        "h-full antialiased",
        vazirmatn.variable,
        jetbrainsMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-bg font-sans text-text">
        <NextIntlClientProvider messages={messages}>
          <JsonLdSite locale={locale} />
          <PrivacyAnalytics />
          <SkipLink />
          {/* Pathname consumers suspend inside FloatingNav — keep chrome height stable. */}
          <FloatingNav />
          <main
            id={MAIN_ID}
            tabIndex={-1}
            className="flex flex-1 flex-col outline-none"
          >
            <Suspense fallback={null}>
              <RouteTransition />
            </Suspense>
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
