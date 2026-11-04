import type { Metadata } from "next";
import { AdminProcessClient } from "./AdminProcessClient";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "مدیریت فرایند | کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminProcessPage() {
  return (
    <>
      <DynamicMarker />
      <AdminProcessClient />
    </>
  );
}
