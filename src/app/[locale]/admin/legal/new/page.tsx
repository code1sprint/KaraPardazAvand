import { LegalForm } from "@/components/admin/legal/LegalForm";
import { DynamicMarker } from "../../DynamicMarker";

export default function NewLegalDocPage() {
  return (
    <>
      <DynamicMarker />
      <LegalForm isNew={true} />
    </>
  );
}
