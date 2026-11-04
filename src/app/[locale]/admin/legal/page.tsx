import { AdminLegalListClient } from "./AdminLegalListClient";
import { DynamicMarker } from "../DynamicMarker";

export default function AdminLegalPage() {
  return (
    <>
      <DynamicMarker />
      <AdminLegalListClient />
    </>
  );
}
