import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getServiceModel } from "@/lib/db/models/Service";
import { EditServiceClient } from "./EditServiceClient";
import { DynamicMarker } from "../../../DynamicMarker";

export const metadata: Metadata = {
  title: "ویرایش خدمت | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditServicePageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

async function EditServiceContent({ params }: EditServicePageProps) {
  await connection();
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

  return <EditServiceClient initialData={initialData} />;
}

export default function EditServicePage({ params }: EditServicePageProps) {
  return (
    <>
      <DynamicMarker />
      <Suspense fallback={null}>
        <EditServiceContent params={params} />
      </Suspense>
    </>
  );
}
