import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/mongodb";
import { getProjectModel } from "@/lib/db/models/Project";
import { EditProjectClient } from "./EditProjectClient";
import { DynamicMarker } from "../../../DynamicMarker";

export const metadata: Metadata = {
  title: "ویرایش پروژه | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

interface EditProjectPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

async function EditProjectContent({ params }: EditProjectPageProps) {
  await connection();
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

  return <EditProjectClient initialData={initialData} />;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  return (
    <>
      <DynamicMarker />
      <Suspense fallback={null}>
        <EditProjectContent params={params} />
      </Suspense>
    </>
  );
}
