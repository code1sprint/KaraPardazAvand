import Script from "next/script";
import { getAnalyticsConfig } from "@/lib/analytics";

/**
 * Cookie-free analytics loader. Renders nothing unless
 * NEXT_PUBLIC_ANALYTICS_SCRIPT_URL is set (Plausible / Umami style).
 */
export function PrivacyAnalytics() {
  const config = getAnalyticsConfig();
  if (!config) return null;

  return (
    <Script
      src={config.scriptUrl}
      strategy="afterInteractive"
      defer
      {...(config.domain ? { "data-domain": config.domain } : {})}
      {...(config.websiteId ? { "data-website-id": config.websiteId } : {})}
    />
  );
}
