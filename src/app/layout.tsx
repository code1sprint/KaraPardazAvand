import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Root layout must exist for the App Router.
 * Locale-specific html/body live in `app/[locale]/layout.tsx`.
 */
export default function RootLayout({ children }: Props) {
  return children;
}
