import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getServiceModel } from "@/lib/db/models/Service";
import { EditServiceClient } from "./EditServiceClient";
import { DynamicMarker } from "../../../DynamicMarker";

interface EditServicePageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
  const { id } = await params;

  await connectToDatabase();
  const Service = await getServiceModel();

  let service = null;
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    service = await Service.findOne(
      isObjectId ? { _id: id } : { slug: id },
    ).lean();
  } catch {
    notFound();
  }

  if (!service) {
    notFound();
  }

  const initialData = JSON.parse(JSON.stringify(service));

  return (
    <>
      <DynamicMarker />
      <EditServiceClient initialData={initialData} />
    </>
  );
}
