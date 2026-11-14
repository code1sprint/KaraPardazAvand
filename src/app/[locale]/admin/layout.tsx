import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { AuthProvider } from "@/lib/auth/context";
import { AdminShell } from "./AdminShell";
import { DynamicMarker } from "./DynamicMarker";

export const metadata = {
  title: "پیشخوان مدیریت | کارا پرداز اوند",
  description: "سامانه مدیریت محتوا و ارتباطات کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

/** Admin panel is always Persian (RTL), regardless of the public site locale. */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  setRequestLocale("fa");

  return (
    <AuthProvider>
      <DynamicMarker />
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
