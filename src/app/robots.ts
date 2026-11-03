import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  let host: string | undefined;
  try {
    host = new URL(siteUrl).host;
  } catch {
    host = undefined;
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep /api/og crawlable for social previews; block form endpoint + design gallery.
        disallow: [
          "/api/contact",
          "/fa/design",
          "/en/design",
          "/fa/system/",
          "/en/system/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    ...(host ? { host } : {}),
  };
}
