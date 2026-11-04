import { AdminProjectsClient } from "./AdminProjectsClient";
import { DynamicMarker } from "../DynamicMarker";

export default function AdminProjectsPage() {
  return (
    <>
      <DynamicMarker />
      <AdminProjectsClient />
    </>
  );
}
