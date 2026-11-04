import type { Metadata } from "next";
import { AdminProjectsClient } from "./AdminProjectsClient";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "مدیریت پروژه‌ها | کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminProjectsPage() {
  return (
    <>
      <DynamicMarker />
      <AdminProjectsClient />
    </>
  );
}
