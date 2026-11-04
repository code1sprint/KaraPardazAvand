import type { Metadata } from "next";
import { AdminServicesClient } from "./AdminServicesClient";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "مدیریت خدمات | کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminServicesPage() {
  return (
    <>
      <DynamicMarker />
      <AdminServicesClient />
    </>
  );
}
