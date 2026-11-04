import type { Metadata } from "next";
import { AdminDatabaseClient } from "./AdminDatabaseClient";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "سلامت پایگاه داده | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDatabasePage() {
  return (
    <>
      <DynamicMarker />
      <AdminDatabaseClient />
    </>
  );
}
