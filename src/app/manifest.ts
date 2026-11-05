import type { MetadataRoute } from "next";
import { tokenValues } from "@/styles/token-values";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "کارا پرداز اوند",
    short_name: "کارا پرداز",
    description:
      "نرم‌افزار سفارشی، وب، CRM، ERP، RAG و داده برای سازمان‌های ایرانی.",
    start_url: "/fa",
    display: "standalone",
    background_color: tokenValues.bg,
    theme_color: tokenValues.bg,
    lang: "fa",
    dir: "rtl",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
