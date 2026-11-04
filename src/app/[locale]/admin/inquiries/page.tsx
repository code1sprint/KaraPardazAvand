import type { Metadata } from "next";
import { AdminInquiriesClient } from "./AdminInquiriesClient";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "پیام‌ها و درخواست‌های همکاری | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminInquiriesPage() {
  return (
    <>
      <DynamicMarker />
      <AdminInquiriesClient />
    </>
  );
}
