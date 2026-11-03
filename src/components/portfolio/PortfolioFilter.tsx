"use client";

import { useCallback, useMemo, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ProjectRow } from "@/components/portfolio/ProjectRow";
import { ButtonLink, Text } from "@/components/ui";
import type { ProjectMeta } from "@/content/project-meta";
import { cn } from "@/lib/cn";

export type PortfolioFilterOption = {
  slug: string;
  label: string;
};

export type PortfolioFilterProps = {
  projects: ProjectMeta[];
  services: PortfolioFilterOption[];
  sectors: PortfolioFilterOption[];
  labels: {
    all: string;
    serviceFilterLabel: string;
    sectorFilterLabel: string;
    empty: string;
    emptyFiltered: string;
    emptyCta: string;
    viewCaseStudy: string;
  };
};

export function PortfolioFilter({
  projects,
  services,
  sectors,
  labels,
}: PortfolioFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const activeService = searchParams.get("service");
  const activeSector = searchParams.get("sector");

  const knownService =
    activeService && services.some((service) => service.slug === activeService)
      ? activeService
      : null;
  const knownSector =
    activeSector && sectors.some((sector) => sector.slug === activeSector)
      ? activeSector
      : null;

  const visible = useMemo(() => {
    return projects.filter((project) => {
      if (knownService && !project.services.includes(knownService)) {
        return false;
      }
      if (knownSector && project.sector !== knownSector) {
        return false;
      }
      return true;
    });
  }, [projects, knownService, knownSector]);

  const replaceQuery = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const query = params.toString();
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  const setService = useCallback(
    (slug: string | null) => {
      replaceQuery((params) => {
        if (slug) params.set("service", slug);
        else params.delete("service");
      });
    },
    [replaceQuery],
  );

  const setSector = useCallback(
    (slug: string | null) => {
      replaceQuery((params) => {
        if (slug) params.set("sector", slug);
        else params.delete("sector");
      });
    },
    [replaceQuery],
  );

  const emptyMessage =
    projects.length === 0 ? labels.empty : labels.emptyFiltered;
  const showEmpty = projects.length === 0 || visible.length === 0;

  return (
    <div className={cn(isPending && "opacity-80")}>
      {services.length > 0 ? (
        <div
          role="toolbar"
          aria-label={labels.serviceFilterLabel}
          className="flex flex-wrap gap-2"
        >
          <FilterChip
            pressed={!knownService}
            onClick={() => setService(null)}
            label={labels.all}
          />
          {services.map((service) => (
            <FilterChip
              key={service.slug}
              pressed={knownService === service.slug}
              onClick={() => setService(service.slug)}
              label={service.label}
            />
          ))}
        </div>
      ) : null}

      {sectors.length > 0 ? (
        <div
          role="toolbar"
          aria-label={labels.sectorFilterLabel}
          className={cn("flex flex-wrap gap-2", services.length > 0 && "mt-3")}
        >
          <FilterChip
            pressed={!knownSector}
            onClick={() => setSector(null)}
            label={labels.all}
          />
          {sectors.map((sector) => (
            <FilterChip
              key={sector.slug}
              pressed={knownSector === sector.slug}
              onClick={() => setSector(sector.slug)}
              label={sector.label}
            />
          ))}
        </div>
      ) : null}

      {showEmpty ? (
        <div className="mt-10 flex flex-col items-start gap-5" role="status">
          <Text variant="muted">{emptyMessage}</Text>
          <ButtonLink href="/contact" variant="primary">
            {labels.emptyCta}
          </ButtonLink>
        </div>
      ) : (
        <div className="mt-8 border-t border-line">
          {visible.map((project) => (
            <ProjectRow
              key={project.slug}
              project={project}
              viewLabel={labels.viewCaseStudy}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  pressed,
  onClick,
  label,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center rounded-pill border px-4 text-sm font-medium transition-colors",
        pressed
          ? "border-blue bg-blue-soft text-blue"
          : "border-line bg-panel text-text hover:bg-blue-soft",
      )}
    >
      {label}
    </button>
  );
}
