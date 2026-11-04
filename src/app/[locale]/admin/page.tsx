import { AdminDashboardClient } from "./AdminDashboardClient";
import { DynamicMarker } from "./DynamicMarker";

export default function AdminDashboardPage() {
  return (
    <>
      <DynamicMarker />
      <AdminDashboardClient />
    </>
  );
}
