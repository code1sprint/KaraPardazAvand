import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";
import { tokenValues } from "@/styles/token-values";

const SIZE = { width: 1200, height: 630 } as const;

let vazirmatnRegular: ArrayBuffer | null = null;
let vazirmatnBold: ArrayBuffer | null = null;

async function loadVazirmatn(): Promise<{
  regular: ArrayBuffer;
  bold: ArrayBuffer;
}> {
  if (vazirmatnRegular && vazirmatnBold) {
    return { regular: vazirmatnRegular, bold: vazirmatnBold };
  }

  // Try loading from local disk cache first
  try {
    const regularBuf = await readFile(join(process.cwd(), "public/fonts/vazirmatn-400.woff"));
    const boldBuf = await readFile(join(process.cwd(), "public/fonts/vazirmatn-700.woff"));
    vazirmatnRegular = regularBuf.buffer.slice(
      regularBuf.byteOffset,
      regularBuf.byteOffset + regularBuf.byteLength,
    ) as ArrayBuffer;
    vazirmatnBold = boldBuf.buffer.slice(
      boldBuf.byteOffset,
      boldBuf.byteOffset + boldBuf.byteLength,
    ) as ArrayBuffer;
    return { regular: vazirmatnRegular, bold: vazirmatnBold };
  } catch {
    // Fall back to remote CDN if local files are missing
  }

  const [arabicRegular, arabicBold] = await Promise.all([
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/vazirmatn@5.2.5/arabic-400-normal.woff",
    ),
    fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/vazirmatn@5.2.5/arabic-700-normal.woff",
    ),
  ]);

  if (!arabicRegular.ok || !arabicBold.ok) {
    throw new Error("Failed to load Vazirmatn for OG image");
  }

  vazirmatnRegular = await arabicRegular.arrayBuffer();
  vazirmatnBold = await arabicBold.arrayBuffer();

  return { regular: vazirmatnRegular, bold: vazirmatnBold };
}

function titleFontSize(title: string): number {
  const len = [...title].length;
  if (len > 80) return 34;
  if (len > 56) return 42;
  if (len > 36) return 50;
  return 58;
}

/** Soft line breaks so long Persian titles stay readable in Satori. */
function wrapTitle(title: string, maxChars: number): string[] {
  const trimmed = title.trim();
  if ([...trimmed].length <= maxChars) return [trimmed];

  const lines: string[] = [];
  let remaining = trimmed;
  while (remaining.length > 0) {
    if ([...remaining].length <= maxChars) {
      lines.push(remaining);
      break;
    }
    const slice = [...remaining].slice(0, maxChars).join("");
    const breakAt = Math.max(
      slice.lastIndexOf(" "),
      slice.lastIndexOf("\u200c"),
    );
    const cut = breakAt > maxChars * 0.4 ? breakAt : maxChars;
    const line = [...remaining].slice(0, cut).join("").trim();
    if (line) lines.push(line);
    remaining = [...remaining].slice(cut).join("").trim();
    if (lines.length >= 3) {
      if (remaining && lines.length > 0) {
        lines[lines.length - 1] = `${lines[lines.length - 1]}…`;
      }
      break;
    }
  }
  return lines.length > 0 ? lines : [trimmed];
}

/**
 * Dynamic OG image via next/og (under /api so next-intl proxy skips it).
 * Query: `title`, `locale` (fa|en).
 * Renders title on a navy band with the logo and ribbon shapes.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale") ?? routing.defaultLocale;
  const locale = (routing.locales as readonly string[]).includes(localeParam)
    ? localeParam
    : routing.defaultLocale;
  const isFa = locale === "fa";

  const title =
    searchParams.get("title")?.trim() ||
    (isFa ? "کارا پرداز اوند" : "Kara Pardaz Avand");

  const brand = isFa ? "کارا پرداز اوند" : "Kara Pardaz Avand";
  const family = isFa ? "از خانواده Code1Sprint" : "Part of Code1Sprint";

  const [fonts, iconBuffer] = await Promise.all([
    loadVazirmatn(),
    readFile(join(process.cwd(), "public/brand/icon.png")),
  ]);
  const iconSrc = `data:image/png;base64,${iconBuffer.toString("base64")}`;
  const fontSize = titleFontSize(title);
  const maxChars = fontSize >= 50 ? 28 : fontSize >= 42 ? 34 : 40;
  const titleLines = wrapTitle(title, maxChars);

  const ribbonTopStyle = isFa
    ? { position: "absolute" as const, top: -24, left: -30, opacity: 0.55 }
    : { position: "absolute" as const, top: -24, right: -30, opacity: 0.55 };

  // Keep the triangle opposite the title alignment (title is end-aligned).
  const triangleStyle = isFa
    ? { position: "absolute" as const, bottom: 36, left: 48, opacity: 0.95 }
    : { position: "absolute" as const, bottom: 36, right: 48, opacity: 0.95 };

  const ribbonBottomStyle = isFa
    ? { position: "absolute" as const, bottom: -40, left: 24, opacity: 0.35 }
    : { position: "absolute" as const, bottom: -40, right: 24, opacity: 0.35 };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: `linear-gradient(135deg, ${tokenValues.navy}, ${tokenValues.navy2})`,
          color: tokenValues.onBrand,
          fontFamily: "Vazirmatn",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundImage: `repeating-linear-gradient(135deg, ${tokenValues.stripe} 0 2px, transparent 2px 18px)`,
            opacity: 0.9,
          }}
        />

        <svg
          width="200"
          height="200"
          viewBox="0 0 210 210"
          style={ribbonTopStyle}
        >
          <defs>
            <linearGradient id="ogRibbonA" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor={tokenValues.sky} />
              <stop offset="1" stopColor={tokenValues.blue} />
            </linearGradient>
          </defs>
          <path
            d="M20 190 L120 90 L120 30 L190 30 L190 100 L90 190Z"
            fill="url(#ogRibbonA)"
            stroke="url(#ogRibbonA)"
            strokeWidth="14"
            strokeLinejoin="round"
          />
        </svg>

        <svg width="110" height="100" viewBox="0 0 100 90" style={triangleStyle}>
          <path
            d="M50 8 L92 82 L8 82Z"
            fill={tokenValues.orange}
            stroke={tokenValues.amber}
            strokeWidth="10"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          width="160"
          height="160"
          viewBox="0 0 210 210"
          style={ribbonBottomStyle}
        >
          <defs>
            <linearGradient id="ogRibbonB" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor={tokenValues.navy} />
              <stop offset="1" stopColor={tokenValues.sky} />
            </linearGradient>
          </defs>
          <path
            d="M20 190 L120 90 L120 30 L190 30 L190 100 L90 190Z"
            fill="url(#ogRibbonB)"
            stroke="url(#ogRibbonB)"
            strokeWidth="14"
            strokeLinejoin="round"
          />
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
            padding: "52px 64px 56px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isFa ? "row-reverse" : "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 72,
                height: 72,
                borderRadius: 16,
                background: tokenValues.panel,
              }}
            >
              {/* next/og ImageResponse does not support next/image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={iconSrc}
                width={48}
                height={46}
                alt=""
                style={{ width: 48, height: 46, objectFit: "contain" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: isFa ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: tokenValues.onBrand,
                  textAlign: isFa ? "right" : "left",
                }}
              >
                {brand}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: tokenValues.bandMuted,
                  textAlign: isFa ? "right" : "left",
                }}
              >
                {family}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              alignItems: isFa ? "flex-end" : "flex-start",
              maxWidth: 980,
              marginTop: 24,
            }}
          >
            {titleLines.map((line, index) => (
              <div
                key={`og-line-${index}`}
                style={{
                  fontSize,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  color: tokenValues.onBrand,
                  textAlign: isFa ? "right" : "left",
                  letterSpacing: isFa ? 0 : "-0.02em",
                }}
              >
                {line}
              </div>
            ))}
            <div
              style={{
                width: 72,
                height: 4,
                borderRadius: 2,
                background: tokenValues.orange,
                marginTop: 4,
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        {
          name: "Vazirmatn",
          data: fonts.regular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Vazirmatn",
          data: fonts.bold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
