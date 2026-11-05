import { connectToDatabase } from "@/lib/db/mongodb";
import { getProjectModel } from "@/lib/db/models/Project";
import { loadMdxBySlug, loadMdxCollection } from "@/lib/mdx/load-mdx";
import {
  isProjectVisible,
  type ProjectMeta,
  type ProjectSystemMap,
} from "@/content/project-meta";
import {
  parseContent,
  projectResultSchema,
  projectSchema,
  type Project,
} from "@/lib/content";

export {
  getSourcedResults,
  isProjectVisible,
  type ProjectGalleryItem,
  type ProjectMeta,
  type ProjectResult,
  type ProjectStatus,
  type ProjectSystemMap,
} from "@/content/project-meta";

export { projectResultSchema };
export const projectFrontmatterSchema = projectSchema;
export type ProjectFrontmatter = Project;

function parseFrontmatter(raw: unknown, fileSlug: string): ProjectMeta {
  const data = parseContent(projectSchema, raw, `projects/${fileSlug}.mdx`);
  return {
    ...data,
    slug: data.slug ?? fileSlug,
    year: String(data.year),
  };
}

export async function getAllProjects(): Promise<ProjectMeta[]> {
  "use cache";

  try {
    await connectToDatabase();
    const ProjectModel = await getProjectModel();
    const docs = await ProjectModel.find({}).lean();
    if (docs && docs.length > 0) {
      return docs
        .filter((doc) => isProjectVisible(doc.status as ProjectMeta["status"]))
        .map((doc) => ({
          slug: doc.slug,
          title: doc.title,
          sector: doc.sector,
          year: String(doc.year),
          services: doc.services || [],
          role: doc.role,
          problem: doc.problem,
          solution: doc.solution,
          results: doc.results || [],
          stack: doc.stack || [],
          cover: doc.cover,
          gallery: doc.gallery || [],
          systemMap: doc.systemMap as ProjectSystemMap,
          featured: doc.featured,
          status: doc.status as ProjectMeta["status"],
        }))
        .sort((a, b) => a.title.localeCompare(b.title, "fa"));
    }
  } catch {
    // If DB offline, fall back to MDX collection
  }

  const docs = await loadMdxCollection<unknown>("projects");
  const projects = docs
    .map((doc) => parseFrontmatter(doc.frontmatter, doc.slug))
    .filter((project) => isProjectVisible(project.status));

  return projects.sort((a, b) => a.title.localeCompare(b.title, "fa"));
}

export async function getFeaturedProjects(limit = 3): Promise<ProjectMeta[]> {
  const projects = await getAllProjects();
  return projects.filter((project) => project.featured).slice(0, limit);
}

export async function getProjectsByService(
  serviceSlug: string | null | undefined,
): Promise<ProjectMeta[]> {
  const projects = await getAllProjects();
  if (!serviceSlug) return projects;
  return projects.filter((project) => project.services.includes(serviceSlug));
}

export async function getProjectBySlug(slug: string) {
  "use cache";

  try {
    await connectToDatabase();
    const ProjectModel = await getProjectModel();
    const doc = await ProjectModel.findOne({ slug }).lean();
    if (doc) {
      if (!isProjectVisible(doc.status as ProjectMeta["status"])) return null;
      const meta: ProjectMeta = {
        slug: doc.slug,
        title: doc.title,
        sector: doc.sector,
        year: String(doc.year),
        services: doc.services || [],
        role: doc.role,
        problem: doc.problem,
        solution: doc.solution,
        results: doc.results || [],
        stack: doc.stack || [],
        cover: doc.cover,
        gallery: doc.gallery || [],
        systemMap: doc.systemMap as ProjectSystemMap,
        featured: doc.featured,
        status: doc.status as ProjectMeta["status"],
      };
      return {
        meta,
        content: "",
        contentHtml: doc.contentHtml || "",
      };
    }
  } catch {
    // Fall back to MDX
  }

  const doc = await loadMdxBySlug<unknown>("projects", slug);
  if (!doc) return null;
  const meta = parseFrontmatter(doc.frontmatter, doc.slug);
  if (!isProjectVisible(meta.status)) return null;
  return { meta, content: doc.content, contentHtml: "" };
}

export async function getProjectSlugs(): Promise<string[]> {
  const projects = await getAllProjects();
  return projects.map((project) => project.slug);
}

/** Previous / next among the same ordered visible list (title sort). */
export async function getAdjacentProjects(slug: string): Promise<{
  previous: ProjectMeta | null;
  next: ProjectMeta | null;
}> {
  const projects = await getAllProjects();
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) {
    return { previous: null, next: null };
  }
  return {
    previous: index > 0 ? (projects[index - 1] ?? null) : null,
    next: index < projects.length - 1 ? (projects[index + 1] ?? null) : null,
  };
}

/** Unique sectors from visible projects — drives portfolio filter chips. */
export function collectProjectSectors(
  projects: readonly ProjectMeta[],
): string[] {
  const sectors = new Set<string>();
  for (const project of projects) {
    sectors.add(project.sector);
  }
  return [...sectors].sort((a, b) => a.localeCompare(b, "fa"));
}

/** Unique service slugs from visible projects — drives portfolio filter chips. */
export function collectProjectServiceSlugs(
  projects: readonly ProjectMeta[],
): string[] {
  const slugs = new Set<string>();
  for (const project of projects) {
    for (const service of project.services) {
      slugs.add(service);
    }
  }
  return [...slugs].sort((a, b) => a.localeCompare(b, "en"));
}
