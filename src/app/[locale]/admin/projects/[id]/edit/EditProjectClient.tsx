"use client";

import { ProjectForm } from "@/components/admin/projects/ProjectForm";
import type { IProject } from "@/lib/db/models/Project";

interface EditProjectClientProps {
  initialData: Partial<IProject> & { _id: string };
}

export function EditProjectClient({ initialData }: EditProjectClientProps) {
  return <ProjectForm initialData={initialData} isNew={false} />;
}
