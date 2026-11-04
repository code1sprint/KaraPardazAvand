import { AdminPostsClient } from "./AdminPostsClient";
import { DynamicMarker } from "../DynamicMarker";

export default function AdminPostsPage() {
  return (
    <>
      <DynamicMarker />
      <AdminPostsClient />
    </>
  );
}
