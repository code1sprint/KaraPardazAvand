import { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { AdminLegalEditClient } from "./AdminLegalEditClient";
import { DynamicMarker } from "../../../DynamicMarker";

export const metadata: Metadata = {
  title: "ویرایش سند حقوقی | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

async function LegalEditContent({ params }: Props) {
  await connection();
  const { slug } = await params;
  return <AdminLegalEditClient slug={slug} />;
}

export default function EditLegalDocPage({ params }: Props) {
  return (
    <>
      <DynamicMarker />
      <Suspense fallback={null}>
        <LegalEditContent params={params} />
      </Suspense>
    </>
  );
}
