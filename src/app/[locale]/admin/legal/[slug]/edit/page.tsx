import { AdminLegalEditClient } from "./AdminLegalEditClient";
import { DynamicMarker } from "../../../DynamicMarker";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EditLegalDocPage({ params }: Props) {
  const { slug } = await params;
  return (
    <>
      <DynamicMarker />
      <AdminLegalEditClient slug={slug} />
    </>
  );
}
