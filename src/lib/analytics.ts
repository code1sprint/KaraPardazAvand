/**
 * Privacy-friendly analytics config (Plausible / Umami style).
 * Scripts load only when NEXT_PUBLIC_ANALYTICS_SCRIPT_URL is set — no invented IDs.
 */

export type AnalyticsConfig = {
  scriptUrl: string;
  /** Plausible `data-domain` (or equivalent). */
  domain?: string;
  /** Umami `data-website-id` (or equivalent). */
  websiteId?: string;
};

export function getAnalyticsConfig(): AnalyticsConfig | null {
  const scriptUrl = process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL?.trim();
  if (!scriptUrl) return null;

  const domain = process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN?.trim() || undefined;
  const websiteId =
    process.env.NEXT_PUBLIC_ANALYTICS_WEBSITE_ID?.trim() || undefined;

  return { scriptUrl, domain, websiteId };
}

/** Origin of the analytics script for CSP allowlisting (build-time). */
export function getAnalyticsScriptOrigin(): string | null {
  const config = getAnalyticsConfig();
  if (!config) return null;
  try {
    return new URL(config.scriptUrl).origin;
  } catch {
    return null;
  }
}
