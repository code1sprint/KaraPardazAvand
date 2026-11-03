import type { MetadataRoute } from "next";
import { getAllPosts } from "@/content/posts";
import { getAllProjects } from "@/content/projects";
import { services } from "@/content/services";
import { getSiteUrl } from "@/content/site";
import { routing } from "@/i18n/routing";
import { absoluteUrl, normalizePath } from "@/lib/seo";

const STATIC_PATHS = [
  "/",
  "/services",
  "/about",
  "/contact",
  "/portfolio",
  "/insights",
  "/process",
  "/faq",
  "/privacy",
  "/terms",
] as const;

function entryForPath(
  path: string,
  options?: {
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority?: number;
  },
): MetadataRoute.Sitemap[number] {
  const pathname = normalizePath(path);
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, pathname);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, pathname);

  return {
    url: absoluteUrl(routing.defaultLocale, pathname),
    lastModified: new Date(),
    changeFrequency: options?.changeFrequency ?? "weekly",
    priority: options?.priority ?? 0.7,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Ensure getSiteUrl is evaluated (env) even if unused below.
  void getSiteUrl();

  // Sitemap is for crawlers: always exclude drafts (even in development).
  const projectSlugs = (await getAllProjects())
    .filter((project) => project.status === "published")
    .map((project) => project.slug);
  const postSlugs = (await getAllPosts())
    .filter((post) => post.status === "published")
    .map((post) => post.slug);

  return [
    ...STATIC_PATHS.map((path) =>
      entryForPath(path, {
        priority: path === "/" ? 1 : 0.8,
        changeFrequency: path === "/" ? "weekly" : "monthly",
      }),
    ),
    ...services.map((service) =>
      entryForPath(`/services/${service.slug}`, {
        priority: 0.75,
        changeFrequency: "monthly",
      }),
    ),
    ...projectSlugs.map((slug) =>
      entryForPath(`/portfolio/${slug}`, {
        priority: 0.65,
        changeFrequency: "monthly",
      }),
    ),
    ...postSlugs.map((slug) =>
      entryForPath(`/insights/${slug}`, {
        priority: 0.6,
        changeFrequency: "monthly",
      }),
    ),
  ];
}
