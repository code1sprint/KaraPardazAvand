import type { Metadata } from "next";
import { AdminPostsClient } from "./AdminPostsClient";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "مدیریت نوشته‌ها | کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPostsPage() {
  return (
    <>
      <DynamicMarker />
      <AdminPostsClient />
    </>
  );
}
