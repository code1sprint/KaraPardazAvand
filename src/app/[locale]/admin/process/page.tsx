import { AdminProcessClient } from "./AdminProcessClient";
import { DynamicMarker } from "../DynamicMarker";

export default function AdminProcessPage() {
  return (
    <>
      <DynamicMarker />
      <AdminProcessClient />
    </>
  );
}
