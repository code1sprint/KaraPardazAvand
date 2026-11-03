import { Suspense, type ReactNode } from "react";
import { connection } from "next/server";
import { AuthProvider } from "@/lib/auth/context";
import { AdminShell } from "./AdminShell";

const Connection = async () => {
  await connection();
  return null;
};

async function DynamicMarker() {
  return (
    <Suspense>
      <Connection />
    </Suspense>
  );
}

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
      <DynamicMarker />
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
