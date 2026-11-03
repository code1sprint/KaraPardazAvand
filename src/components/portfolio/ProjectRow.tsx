import { Chip, Heading, Link, Text } from "@/components/ui";
import { ProjectCover } from "@/components/portfolio/ProjectCover";
import {
  getSourcedResults,
  type ProjectMeta,
} from "@/content/project-meta";

export type ProjectRowProps = {
  project: ProjectMeta;
  viewLabel: string;
  /** Larger row used on home featured section. */
  large?: boolean;
};

export function ProjectRow({
  project,
  viewLabel,
  large = false,
}: ProjectRowProps) {
  const primaryResult = getSourcedResults(project.results)[0];

  return (
    <article
      className={
        large
          ? "grid items-center gap-6 border-b border-line py-8 last:border-b-0 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-10"
          : "grid items-start gap-5 border-b border-line py-6 last:border-b-0 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8"
      }
    >
      <ProjectCover
        src={project.cover}
        alt={project.title}
        sizes={
          large
            ? "(max-width: 768px) 100vw, 42vw"
            : "(max-width: 640px) 100vw, 14rem"
        }
      />

      <div className="flex min-w-0 flex-col gap-3 text-start">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="soft">{project.sector}</Chip>
        </div>

        <Heading
          as={large ? 3 : 2}
          className={large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}
        >
          <Link
            href={`/portfolio/${project.slug}`}
            variant="nav"
            className="hover:text-blue"
          >
            {project.title}
          </Link>
        </Heading>

        <Text variant="muted" className="line-clamp-2 max-w-2xl">
          {project.problem}
        </Text>

        {primaryResult ? (
          <p className="text-start text-sm text-text sm:text-base">
            <span className="font-semibold">{primaryResult.label}: </span>
            <span>{primaryResult.value}</span>
          </p>
        ) : null}

        {project.stack.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li key={item}>
                <Chip tone="panel">{item}</Chip>
              </li>
            ))}
          </ul>
        ) : null}

        <p>
          <Link href={`/portfolio/${project.slug}`} variant="default">
            {viewLabel}
          </Link>
        </p>
      </div>
    </article>
  );
}
