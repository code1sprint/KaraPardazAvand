import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/content/site";

export const AI_CRAWLER_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
] as const;

export type AiCrawlerPolicy = "allow" | "block";

export type RobotsRule = {
  userAgent: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
};

/**
 * Generates explicit robots directives for major AI crawl bots.
 */
export function getAiCrawlerRules(policy: AiCrawlerPolicy = "allow"): RobotsRule[] {
  if (policy === "block") {
    return AI_CRAWLER_BOTS.map((bot) => ({
      userAgent: bot,
      disallow: "/",
    }));
  }

  return AI_CRAWLER_BOTS.map((bot) => ({
    userAgent: bot,
    allow: "/",
    disallow: [
      "/admin/",
      "/fa/admin/",
      "/en/admin/",
      "/api/",
      "/fa/design",
      "/en/design",
      "/fa/system/",
      "/en/system/",
    ],
  }));
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  let host: string | undefined;
  try {
    host = new URL(siteUrl).host;
  } catch {
    host = undefined;
  }

  const aiPolicy: AiCrawlerPolicy =
    process.env.AI_CRAWLERS?.toLowerCase() === "block" ? "block" : "allow";

  const aiRules = getAiCrawlerRules(aiPolicy);
  const rulesList = Array.isArray(aiRules) ? aiRules : [aiRules];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/fa/admin/",
          "/en/admin/",
          "/api/",
          "/fa/design",
          "/en/design",
          "/fa/system/",
          "/en/system/",
        ],
      },
      ...rulesList,
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    ...(host ? { host } : {}),
  };
}
