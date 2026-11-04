import type { Metadata } from "next";
import { NewProjectClient } from "./NewProjectClient";
import { DynamicMarker } from "../../DynamicMarker";

export const metadata: Metadata = {
  title: "پروژه جدید | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewProjectPage() {
  return (
    <>
      <DynamicMarker />
      <NewProjectClient />
    </>
  );
}
