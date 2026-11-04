import type { Metadata } from "next";
import { NewPostClient } from "./NewPostClient";
import { DynamicMarker } from "../../DynamicMarker";

export const metadata: Metadata = {
  title: "نوشته جدید | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewPostPage() {
  return (
    <>
      <DynamicMarker />
      <NewPostClient />
    </>
  );
}
