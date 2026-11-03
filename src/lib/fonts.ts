import { JetBrains_Mono, Vazirmatn } from "next/font/google";

/** UI font — preload + swap + size-adjust fallbacks via next/font. */
export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  // Skip 800 (map extrabold → black); keeps AA text + cuts one weight file.
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

/** Mono for logs, code, and technical labels only — not preloaded (rarely LCP). */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});
