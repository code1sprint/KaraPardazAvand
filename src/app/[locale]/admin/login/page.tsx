import type { Metadata } from "next";
import { AdminLoginForm } from "./AdminLoginForm";
import { DynamicMarker } from "../DynamicMarker";

export const metadata: Metadata = {
  title: "ورود به پیشخوان مدیریت | کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <>
      <DynamicMarker />
      <AdminLoginForm />
    </>
  );
}
