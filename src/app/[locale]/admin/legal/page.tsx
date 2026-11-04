import type { Metadata } from "next";
import { AdminLegalListClient } from "./AdminLegalListClient";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "اسناد حقوقی | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLegalPage() {
  return (
    <>
      <DynamicMarker />
      <AdminLegalListClient />
    </>
  );
}
