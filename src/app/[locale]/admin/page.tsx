import { Suspense } from "react";
import { connection } from "next/server";
import { AdminDashboardClient } from "./AdminDashboardClient";

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

export default function AdminDashboardPage() {
  return (
    <>
      <DynamicMarker />
      <AdminDashboardClient />
    </>
  );
}
