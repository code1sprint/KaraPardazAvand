import type { Metadata } from "next";
import { LegalForm } from "@/components/admin/legal/LegalForm";
import { DynamicMarker } from "../../DynamicMarker";

export const metadata: Metadata = {
  title: "ایجاد سند حقوقی جدید | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewLegalDocPage() {
  return (
    <>
      <DynamicMarker />
      <LegalForm isNew={true} />
    </>
  );
}
