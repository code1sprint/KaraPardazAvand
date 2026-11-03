import { Suspense } from "react";
import { connection } from "next/server";
import { AdminPostsClient } from "./AdminPostsClient";

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

export default function AdminPostsPage() {
  return (
    <>
      <DynamicMarker />
      <AdminPostsClient />
    </>
  );
}
