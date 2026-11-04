import { Suspense } from "react";
import { connection } from "next/server";
import { AdminProjectsClient } from "./AdminProjectsClient";

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

export default function AdminProjectsPage() {
  return (
    <>
      <DynamicMarker />
      <AdminProjectsClient />
    </>
  );
}
