import { Container } from "./Container";

export type ListPageSkeletonProps = {
  /** Extra row placeholders under the header (list feel). */
  rows?: number;
};

/** Shared pulse skeleton for list routes (services, portfolio, insights). */
export function ListPageSkeleton({ rows = 4 }: ListPageSkeletonProps) {
  return (
    <div className="py-12 sm:py-16" aria-busy="true" aria-live="polite">
      <Container>
        <div className="h-4 w-28 animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-4 h-12 max-w-md animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-4 h-5 max-w-xl animate-pulse rounded-pill bg-blue-soft" />
        <div className="mt-8 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-24 animate-pulse rounded-pill bg-blue-soft"
            />
          ))}
        </div>
        <ul className="mt-10 flex list-none flex-col gap-4 p-0">
          {Array.from({ length: rows }).map((_, index) => (
            <li
              key={index}
              className="h-24 animate-pulse rounded-tile border border-line bg-panel"
            />
          ))}
        </ul>
      </Container>
    </div>
  );
}
