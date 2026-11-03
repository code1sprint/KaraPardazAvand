/**
 * Hex / rgba token values for contexts without CSS variables
 * (OG ImageResponse, web manifest, security-adjacent metadata).
 * Keep in sync with `tokens.css`.
 */
export const tokenValues = {
  bg: "#F6F9FE",
  panel: "#FFFFFF",
  line: "#DCE4F1",
  text: "#0B1B38",
  muted: "#52627F",
  navy: "#061D44",
  navy2: "#0A3A86",
  blue: "#1D6DD1",
  sky: "#2E8FF0",
  orange: "#FF800D",
  amber: "#FFB843",
  onBrand: "#FFFFFF",
  bandMuted: "#B7C8E6",
  stripe: "rgba(46, 143, 240, 0.10)",
} as const;
