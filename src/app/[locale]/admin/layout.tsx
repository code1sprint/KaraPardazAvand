import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth/context";
import { AdminShell } from "./AdminShell";

export const metadata = {
  title: "پیشخوان مدیریت | کارا پرداز اوند",
  description: "سامانه مدیریت محتوا و ارتباطات کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
