import { getAllPosts } from "@/content/posts";
import { getSiteUrl } from "@/content/site";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/seo";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/**
 * Locale-agnostic RSS feed. Middleware skips `*.xml`, so this stays at
 * `/insights/rss.xml` and links into the default-locale article URLs.
 */
export async function GET() {
  const posts = await getAllPosts();
  const siteUrl = getSiteUrl().replace(/\/$/, "");
  const channelLink = absoluteUrl(routing.defaultLocale, "/insights");
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const link = absoluteUrl(
        routing.defaultLocale,
        `/insights/${post.slug}`,
      );
      const pubDate = new Date(`${post.dateIso}T00:00:00.000Z`).toUTCString();
      const categories = post.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");

      return `<item>
<title>${escapeXml(post.title)}</title>
<link>${escapeXml(link)}</link>
<guid isPermaLink="true">${escapeXml(link)}</guid>
<pubDate>${pubDate}</pubDate>
<description>${escapeXml(post.summary)}</description>
<author>${escapeXml(post.author)}</author>
${categories}
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml("کارا پرداز اوند — مقالات")}</title>
<link>${escapeXml(channelLink)}</link>
<description>${escapeXml("یادداشت‌های کوتاه دربارهٔ تحویل نرم‌افزار، داده و هوش مصنوعی سازمانی.")}</description>
<language>fa-IR</language>
<lastBuildDate>${buildDate}</lastBuildDate>
<atom:link href="${escapeXml(`${siteUrl}/insights/rss.xml`)}" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
