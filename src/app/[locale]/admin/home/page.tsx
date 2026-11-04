import type { Metadata } from "next";
import { AdminHomeClient } from "./AdminHomeClient";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "مدیریت صفحه اصلی | کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminHomePage() {
  return (
    <>
      <DynamicMarker />
      <AdminHomeClient />
    </>
  );
}
