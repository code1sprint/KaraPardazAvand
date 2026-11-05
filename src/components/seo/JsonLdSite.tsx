import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "./JsonLd";

type Props = {
  locale: string;
};

/**
 * Organization (+ parentOrganization Code1Sprint) and WebSite JSON-LD.
 * Uses typed, zod-validated entity configuration as single source of truth.
 */
export async function JsonLdSite({ locale }: Props) {
  const orgNode = buildOrganizationJsonLd(locale);
  const websiteNode = buildWebSiteJsonLd(locale);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [orgNode, websiteNode],
  };

  return <JsonLd schema={graph} />;
}
