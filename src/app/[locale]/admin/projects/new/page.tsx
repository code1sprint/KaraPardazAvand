import { Suspense } from "react";
import { connection } from "next/server";
import { NewProjectClient } from "./NewProjectClient";

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

export default function NewProjectPage() {
  return (
    <>
      <DynamicMarker />
      <NewProjectClient />
    </>
  );
}
