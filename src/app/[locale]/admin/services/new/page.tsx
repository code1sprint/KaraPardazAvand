import type { Metadata } from "next";
import { NewServiceClient } from "./NewServiceClient";
import { DynamicMarker } from "../../DynamicMarker";

export const metadata: Metadata = {
  title: "خدمت جدید | مدیریت کارا پرداز اوند",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewServicePage() {
  return (
    <>
      <DynamicMarker />
      <NewServiceClient />
    </>
  );
}
