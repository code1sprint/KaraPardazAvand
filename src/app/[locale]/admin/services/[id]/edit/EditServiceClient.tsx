"use client";

import { ServiceForm } from "@/components/admin/services/ServiceForm";
import type { IService } from "@/lib/db/models/Service";

interface EditServiceClientProps {
  initialData: Partial<IService> & { _id: string };
}

export function EditServiceClient({ initialData }: EditServiceClientProps) {
  return <ServiceForm initialData={initialData} isNew={false} />;
}
