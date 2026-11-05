import type { Metadata } from "next";
import { AdminTicketsClient } from "./AdminTicketsClient";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "مرکز پشتیبانی و تیکت‌ها | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminTicketsPage() {
  return (
    <>
      <DynamicMarker />
      <AdminTicketsClient />
    </>
  );
}
