import { Suspense } from "react";
import { connection } from "next/server";
import { NewServiceClient } from "./NewServiceClient";

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

export default function NewServicePage() {
  return (
    <>
      <DynamicMarker />
      <NewServiceClient />
    </>
  );
}
