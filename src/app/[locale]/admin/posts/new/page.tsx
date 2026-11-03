import { Suspense } from "react";
import { connection } from "next/server";
import { NewPostClient } from "./NewPostClient";

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

export default function NewPostPage() {
  return (
    <>
      <DynamicMarker />
      <NewPostClient />
    </>
  );
}
