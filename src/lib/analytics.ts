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

export type ReferrerCategory =
  | "ai-assistant"
  | "search-engine"
  | "social"
  | "direct"
  | "internal"
  | "other";

/**
 * Classifies a referrer URL into privacy-friendly high-level acquisition channels.
 */
export function classifyReferrer(referrerUrl?: string | null): ReferrerCategory {
  if (!referrerUrl || referrerUrl.trim() === "") {
    return "direct";
  }

  let hostname = "";
  try {
    hostname = new URL(referrerUrl).hostname.toLowerCase();
  } catch {
    hostname = referrerUrl.toLowerCase();
  }

  // 1. AI Assistant search & chat referrers
  const aiDomains = [
    "chatgpt.com",
    "chat.openai.com",
    "perplexity.ai",
    "gemini.google.com",
    "claude.ai",
    "copilot.microsoft.com",
    "you.com",
    "poe.com",
  ];
  if (aiDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
    return "ai-assistant";
  }

  // 2. Traditional search engines
  const searchDomains = [
    "google.",
    "bing.com",
    "yahoo.",
    "duckduckgo.com",
    "yandex.",
    "ecosia.org",
    "qwant.com",
    "torob.com",
    "emalls.ir",
  ];
  if (searchDomains.some((d) => hostname.includes(d))) {
    return "search-engine";
  }

  // 3. Social networks & messengers
  const socialDomains = [
    "linkedin.com",
    "t.me",
    "telegram.me",
    "instagram.com",
    "github.com",
    "x.com",
    "twitter.com",
    "facebook.com",
    "youtube.com",
    "whatsapp.com",
  ];
  if (socialDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`))) {
    return "social";
  }

  // 4. Internal
  if (
    hostname.includes("karapardazavand.ir") ||
    hostname.includes("code1sprint.com") ||
    hostname === "localhost"
  ) {
    return "internal";
  }

  return "other";
}
