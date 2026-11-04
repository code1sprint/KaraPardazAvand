/** Brand logo asset paths under `/public/brand`. */

export const brandAssets = {
  /** Canonical SVG mark. Prefer this path in new UI. */
  logo: "/brand/logo.svg",
  /** Pure white SVG mark for overlays and dark product media. */
  logoWhite: "/brand/logo-white.svg",
  /** Blue/orange mark — use on light backgrounds. */
  markOnLight: "/brand/mark-on-light.png",
  /** White/orange mark — use on dark backgrounds. */
  markOnDark: "/brand/mark-on-dark.png",
  /** Full bilingual lockup for light backgrounds. */
  lockupOnLight: "/brand/lockup-on-light.png",
  /** Full bilingual lockup for dark backgrounds. */
  lockupOnDark: "/brand/lockup-on-dark.png",
  /** Square app-style icon (self-contained navy tile). */
  icon: "/brand/icon.png",
} as const;

/** Intrinsic pixel sizes of optimized public assets (aspect-ratio for next/image). */
export const brandAssetSize = {
  /** Canonical SVG viewBox 1024×410 — never stretch. */
  logo: { width: 1024, height: 410 },
  markOnLight: { width: 1246, height: 512 },
  markOnDark: { width: 1153, height: 512 },
  lockupOnLight: { width: 1270, height: 256 },
  lockupOnDark: { width: 1293, height: 256 },
  icon: { width: 536, height: 512 },
} as const;

/** Display width for a given logo height, preserving the SVG aspect ratio. */
export function logoWidthForHeight(height: number): number {
  const { width, height: intrinsicHeight } = brandAssetSize.logo;
  return Math.round((height * width) / intrinsicHeight);
}
