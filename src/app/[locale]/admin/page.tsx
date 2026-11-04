import type { Metadata } from "next";
import { AdminDashboardClient } from "./AdminDashboardClient";
import { DynamicMarker } from "./DynamicMarker";

export const metadata: Metadata = {
  title: "پیشخوان مدیریت | کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return (
    <>
      <DynamicMarker />
      <AdminDashboardClient />
    </>
  );
}
