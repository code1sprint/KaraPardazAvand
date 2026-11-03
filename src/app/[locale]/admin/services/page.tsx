import { Suspense } from "react";
import { connection } from "next/server";
import { AdminServicesClient } from "./AdminServicesClient";

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

export default function AdminServicesPage() {
  return (
    <>
      <DynamicMarker />
      <AdminServicesClient />
    </>
  );
}
