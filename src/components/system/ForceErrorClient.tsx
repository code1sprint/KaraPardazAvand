"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

type Props = {
  label: string;
};

/** Throws on click so the nearest error.tsx boundary can be verified. */
export function ForceErrorClient({ label }: Props) {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("Forced render error (Phase 11 acceptance)");
  }

  return (
    <Button type="button" onClick={() => setShouldThrow(true)}>
      {label}
    </Button>
  );
}
