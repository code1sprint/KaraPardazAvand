import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getProjectModel } from "@/lib/db/models/Project";
import { EditProjectClient } from "./EditProjectClient";

const Connection = async () => {
  await connection();
  return null;
};

async function DynamicMarker() {
  return (
    <Suspense>
      <Connection />
    </Suspense>
  );
}

interface EditProjectPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;

  await connectToDatabase();
  const Project = await getProjectModel();

  let project = null;
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    project = await Project.findOne(
      isObjectId ? { _id: id } : { slug: id },
    ).lean();
  } catch {
    notFound();
  }

  if (!project) {
    notFound();
  }

  const initialData = JSON.parse(JSON.stringify(project));

  return (
    <>
      <DynamicMarker />
      <EditProjectClient initialData={initialData} />
    </>
  );
}
