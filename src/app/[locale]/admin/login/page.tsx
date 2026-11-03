import { Suspense } from "react";
import { connection } from "next/server";
import { AdminLoginForm } from "./AdminLoginForm";

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

export default function AdminLoginPage() {
  return (
    <>
      <DynamicMarker />
      <AdminLoginForm />
    </>
  );
}
