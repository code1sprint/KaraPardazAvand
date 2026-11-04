import type { Metadata } from "next";
import { AdminAboutClient } from "./AdminAboutClient";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "مدیریت درباره ما | کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminAboutPage() {
  return (
    <>
      <DynamicMarker />
      <AdminAboutClient />
    </>
  );
}
