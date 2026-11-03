import { getTranslations } from "next-intl/server";
import { getParentBrandUrl, getSiteUrl } from "@/content/site";
import { brandAssets } from "@/lib/brand";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

type Props = {
  locale: string;
};

/**
 * Organization (+ parentOrganization Code1Sprint) and WebSite JSON-LD.
 * BreadcrumbList / FAQPage / Service / Article remain on the pages that own them.
 */
export async function JsonLdSite({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: "Meta" });
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const homeUrl = absoluteUrl(locale, "/");
  const parentUrl = getParentBrandUrl().replace(/\/$/, "");
  const orgId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const logoUrl = `${siteUrl}${brandAssets.logo}`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: t("organizationName"),
        alternateName: t("organizationAlternateName"),
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
        },
        image: logoUrl,
        parentOrganization: {
          "@type": "Organization",
          name: "Code1Sprint",
          url: parentUrl,
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: t("siteName"),
        url: homeUrl,
        inLanguage: ["fa-IR", "en"],
        publisher: { "@id": orgId },
      },
    ],
  };

  return <JsonLd data={graph} />;
}
