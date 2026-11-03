import { connection } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getServiceModel } from "@/lib/db/models/Service";
import {
  getServiceBySlug,
  type Service,
  type ServiceDetail,
} from "@/content/services";

export type { ServiceDetail };

export async function getServiceDetail(
  slug: string,
): Promise<ServiceDetail | undefined> {
  await connection();

  try {
    await connectToDatabase();
    const ServiceModel = await getServiceModel();
    const doc = await ServiceModel.findOne({ slug }).lean();
    if (doc) {
      return {
        slug: doc.slug,
        title: doc.title,
        outcome: doc.outcome,
        audience: doc.audience,
        deliverables: doc.deliverables,
        steps: doc.steps as unknown as Service["steps"],
        stack: doc.stack,
        systemMap: doc.systemMap as unknown as Service["systemMap"],
        faqs: doc.faqs,
        relatedProjects: doc.relatedProjects || [],
        bento: doc.bento,
        deepDiveHtml: doc.deepDiveHtml || undefined,
      };
    }
  } catch {
    // If DB is offline or during build, fall back to static definition
  }

  const staticService = getServiceBySlug(slug);
  return staticService ? { ...staticService } : undefined;
}
