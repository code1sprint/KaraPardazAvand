"use client";

import { usePathname } from "@/i18n/navigation";
import { Suspense, type ReactNode } from "react";

export type FooterCtaProps = {
  children: ReactNode;
};

function FooterCtaInner({ children }: FooterCtaProps) {
  const pathname = usePathname();

  // Omit global closing CTA on /contact
  if (pathname === "/contact" || pathname?.startsWith("/contact")) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Client guard for the global closing CTA band.
 * On /contact, the inline form is rendered INSTEAD of the global CTA band.
 * On all other pages, the global closing CTA band is shown.
 */
export function FooterCta({ children }: FooterCtaProps) {
  return (
    <Suspense fallback={null}>
      <FooterCtaInner>{children}</FooterCtaInner>
    </Suspense>
  );
}
