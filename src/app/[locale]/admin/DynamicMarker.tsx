import { Suspense } from "react";
import { connection } from "next/server";

async function Connection() {
  await connection();
  return null;
}

/**
 * Marker component that calls `await connection()` inside `<Suspense>`
 * to mark dynamic admin routes for Next.js Cache Components / PPR.
 */
export function DynamicMarker() {
  return (
    <Suspense fallback={null}>
      <Connection />
    </Suspense>
  );
}
