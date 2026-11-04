import { AdminServicesClient } from "./AdminServicesClient";
import { DynamicMarker } from "../DynamicMarker";

export default function AdminServicesPage() {
  return (
    <>
      <DynamicMarker />
      <AdminServicesClient />
    </>
  );
}
