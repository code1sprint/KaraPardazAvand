import { notFound } from "next/navigation";

/**
 * Catch unmatched locale paths so `[locale]/not-found.tsx` is used
 * (HTTP 404) instead of a silent miss.
 */
export default function CatchAllPage() {
  notFound();
}
