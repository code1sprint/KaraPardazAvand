/**
 * Client-safe project types and pure helpers (no MDX / "use cache").
 */

import type { SystemMapLayout } from "@/lib/content";

export type ProjectResult = {
  label: string;
  value: string;
  /** Omit or leave empty to hide the result in the UI. */
  source?: string;
};

export type ProjectStatus = "published" | "draft";

export type ProjectGalleryItem = {
  src: string;
  caption: string;
  alt?: string;
};

export type ProjectSystemMap = {
  windowTitle?: string;
  /** Optional diagram topology; defaults to hub in the UI. */
  layout?: SystemMapLayout;
  descriptionLead: string;
  description: string;
  nodes: {
    inputTop: string;
    inputBottom: string;
    core: string;
    outputTop: string;
    outputBottom: string;
  };
  logs: [string, string, string];
};

export type ProjectMeta = {
  slug: string;
  title: string;
  sector: string;
  year: string;
  services: string[];
  role: string;
  problem: string;
  solution: string;
  results: ProjectResult[];
  stack: string[];
  cover: string;
  gallery: ProjectGalleryItem[];
  systemMap: ProjectSystemMap;
  featured: boolean;
  status: ProjectStatus;
  needs_business_confirmation?: true;
};

/** Results shown publicly must include a non-empty source. */
export function getSourcedResults(
  results: readonly ProjectResult[],
): ProjectResult[] {
  return results.filter(
    (result) => typeof result.source === "string" && result.source.trim() !== "",
  );
}

/**
 * Drafts are visible in development so layout can be reviewed.
 * Production builds (`next build` / `next start`) never include drafts.
 */
export function isProjectVisible(status: ProjectStatus): boolean {
  if (status === "published") return true;
  return process.env.NODE_ENV !== "production";
}
