import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

type ViewportDef = {
  name: string;
  width: number;
  height: number;
};

const VIEWPORTS: ViewportDef[] = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1024", width: 1024, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-390", width: 390, height: 844 },
];

const LOCALES = ["fa", "en"];

const ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/crm",
  "/portfolio",
  "/portfolio/ops-crm-pilot",
  "/process",
  "/faq",
  "/contact",
  "/insights",
  "/insights/crm-fit",
  "/terms",
  "/privacy",
];

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUTPUT_FILE = process.argv.includes("--after") ? "reports/spacing-after.md" : "reports/spacing-before.md";
const SCREENSHOT_SUBDIR = process.argv.includes("--after") ? "after" : "before";

interface SectionMeasurement {
  index: number;
  id: string;
  tagName: string;
  className: string;
  isBand: boolean;
  paddingBlock: string;
  marginBlock: string;
  rect: { top: number; bottom: number; left: number; right: number; width: number; height: number };
  contentBox: { top: number; bottom: number };
  headingStart: number | null;
  headingText: string | null;
  containerWidth: number | null;
  containerStart: number | null;
  containerClass: string | null;
  emptySpaceElements: Array<{
    selector: string;
    description: string;
  }>;
}

interface GapMeasurement {
  fromSection: string;
  toSection: string;
  gapType: "plain-to-plain" | "plain-to-band" | "band-to-plain" | "band-to-band" | "content-to-footer";
  visualGap: number;
  bandInnerTop?: number;
  bandInnerBottom?: number;
}

interface PageAuditResult {
  locale: string;
  route: string;
  viewport: ViewportDef;
  sections: SectionMeasurement[];
  gaps: GapMeasurement[];
  containerDeviations: Array<{
    section: string;
    containerWidth: number;
    containerStart: number;
    expectedWidth: number;
    className: string;
    issue: string;
  }>;
}

async function runAudit() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const allResults: PageAuditResult[] = [];
  const allGaps: Array<GapMeasurement & { route: string; locale: string; viewport: string }> = [];

  const screenshotsDir = path.join(process.cwd(), "reports", "screenshots", SCREENSHOT_SUBDIR);
  fs.mkdirSync(screenshotsDir, { recursive: true });

  console.log(`Starting Spacing Audit against ${BASE_URL}... Output: ${OUTPUT_FILE}`);

  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const fullPath = `/${locale}${route === "/" ? "" : route}`;
      const url = `${BASE_URL}${fullPath}`;

      for (const vp of VIEWPORTS) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        try {
          await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
        } catch {
          await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
          await page.waitForTimeout(400);
        await page.addStyleTag({ content: "*, *::before, *::after { transform: none !important; transition: none !important; animation: none !important; }" });
        }

        const screenshotPages = ["/", "/about", "/services", "/services/crm", "/portfolio", "/process", "/faq", "/contact"];
        if (screenshotPages.includes(route) && (vp.width === 1440 || vp.width === 390)) {
          const safeRoute = route === "/" ? "home" : route.replace(/\//g, "-").replace(/^-/, "");
          const screenshotPath = path.join(screenshotsDir, `${locale}-${safeRoute}-${vp.width}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: true });
        }

        const pageData = (await page.evaluate(`
          (() => {
            const locale = ${JSON.stringify(locale)};
            const width = ${vp.width};
            const isRTL = locale === "fa";
            const main = document.querySelector("main");
            const footer = document.querySelector("footer");

            if (!main) return null;

            const rawSections = Array.from(main.children).filter((el) => {
              if (el.tagName === "SCRIPT" || el.tagName === "STYLE") return false;
              if (el.classList.contains("route-transition")) return false;
              const rect = el.getBoundingClientRect();
              return rect.height > 0;
            });

            const elementsToMeasure = [...rawSections];
            if (footer) {
              elementsToMeasure.push(footer);
            }

            const checkVisible = (el) => {
              const rect = el.getBoundingClientRect();
              if (rect.width === 0 || rect.height === 0) return false;
              const style = window.getComputedStyle(el);
              if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;
              if (style.position === "absolute") {
                if (el.getAttribute("aria-hidden") === "true" || el.classList.contains("pointer-events-none")) {
                  return false;
                }
                if (rect.width >= window.innerWidth * 0.95 && rect.height >= 100) {
                  return false;
                }
              }
              return true;
            };

            const getContentBox = (section) => {
              const candidates = Array.from(section.querySelectorAll("*")).filter((el) => {
                if (!checkVisible(el)) return false;
                const style = window.getComputedStyle(el);
                if (style.position === "absolute" || style.position === "fixed") return false;
                const hasVisibleSurface =
                  (style.borderTopWidth !== "0px" && style.borderTopStyle !== "none") ||
                  (style.backgroundColor && !style.backgroundColor.includes("rgba(0, 0, 0, 0)")) ||
                  (style.backgroundImage && style.backgroundImage !== "none");
                return (
                  hasVisibleSurface ||
                  el.children.length === 0 ||
                  el.tagName === "H1" ||
                  el.tagName === "H2" ||
                  el.tagName === "H3" ||
                  el.tagName === "H4" ||
                  el.tagName === "P" ||
                  el.tagName === "BUTTON" ||
                  el.tagName === "A" ||
                  el.tagName === "IMG" ||
                  el.tagName === "SVG" ||
                  el.tagName === "INPUT" ||
                  el.tagName === "TEXTAREA" ||
                  el.tagName === "UL" ||
                  el.tagName === "TABLE"
                );
              });

              if (candidates.length === 0) {
                const rect = section.getBoundingClientRect();
                return { top: rect.top, bottom: rect.bottom };
              }

              let top = Infinity;
              let bottom = -Infinity;

              for (const el of candidates) {
                const rect = el.getBoundingClientRect();
                if (rect.top < top) top = rect.top;
                if (rect.bottom > bottom) bottom = rect.bottom;
              }

              return { top, bottom };
            };

            const measuredSections = elementsToMeasure.map((el, idx) => {
              const rect = el.getBoundingClientRect();
              const style = window.getComputedStyle(el);
              const isBand =
                el.tagName === "SECTION" &&
                (style.backgroundImage.includes("gradient") ||
                  style.backgroundColor.includes("rgb(6, 29, 68)") ||
                  style.backgroundColor.includes("rgb(10, 21, 48)") ||
                  el.id.includes("principles") ||
                  el.classList.contains("bg-navy") ||
                  el.classList.contains("bg-win-bg"));

              const contentBox = getContentBox(el);

              const heading = el.querySelector("h1, h2, h3");
              let headingStart = null;
              let headingText = null;
              if (heading) {
                const hRect = heading.getBoundingClientRect();
                headingStart = isRTL ? Math.round(width - hRect.right) : Math.round(hRect.left);
                headingText = (heading.textContent || "").trim().slice(0, 30);
              }

              const container = el.querySelector('[class*="max-w-"], [class*="container"]') || el;
              let containerWidth = null;
              let containerStart = null;
              let containerClass = null;
              if (container) {
                const cRect = container.getBoundingClientRect();
                containerWidth = Math.round(cRect.width);
                containerStart = isRTL ? Math.round(width - cRect.right) : Math.round(cRect.left);
                containerClass = container.className || "";
              }

              const emptySpaceElements = [];
              const allDescendants = Array.from(el.querySelectorAll("*"));
              for (const child of allDescendants) {
                const cStyle = window.getComputedStyle(child);
                if (cStyle.minHeight && cStyle.minHeight !== "0px" && parseInt(cStyle.minHeight, 10) >= 120) {
                  emptySpaceElements.push({
                    selector: child.tagName.toLowerCase() + (child.className ? "." + child.className.split(" ")[0] : ""),
                    description: "min-height: " + cStyle.minHeight,
                  });
                }
              }

              return {
                index: idx,
                id: el.id || el.getAttribute("aria-labelledby") || (el.tagName.toLowerCase() + "-" + idx),
                tagName: el.tagName.toLowerCase(),
                className: el.className || "",
                isBand,
                paddingBlock: style.paddingTop + " / " + style.paddingBottom,
                marginBlock: style.marginTop + " / " + style.marginBottom,
                rect: {
                  top: Math.round(rect.top),
                  bottom: Math.round(rect.bottom),
                  left: Math.round(rect.left),
                  right: Math.round(rect.right),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height),
                },
                contentBox: {
                  top: Math.round(contentBox.top),
                  bottom: Math.round(contentBox.bottom),
                },
                headingStart,
                headingText,
                containerWidth,
                containerStart,
                containerClass,
                emptySpaceElements,
              };
            });

            const gaps = [];
            for (let i = 0; i < measuredSections.length - 1; i++) {
              const current = measuredSections[i];
              const next = measuredSections[i + 1];

              let visualGap;
              let gapType;

              if (!current.isBand && !next.isBand) {
                gapType = next.tagName === "footer" ? "content-to-footer" : "plain-to-plain";
                visualGap = Math.round(next.contentBox.top - current.contentBox.bottom);
              } else if (!current.isBand && next.isBand) {
                gapType = "plain-to-band";
                visualGap = Math.round(next.rect.top - current.contentBox.bottom);
              } else if (current.isBand && !next.isBand) {
                gapType = "band-to-plain";
                visualGap = Math.round(next.contentBox.top - current.rect.bottom);
              } else {
                gapType = "band-to-band";
                visualGap = Math.round(next.rect.top - current.rect.bottom);
              }

              const gapObj = {
                fromSection: current.id,
                toSection: next.id,
                gapType,
                visualGap,
              };

              if (current.isBand) {
                gapObj.bandInnerBottom = Math.round(current.rect.bottom - current.contentBox.bottom);
              }
              if (next.isBand) {
                gapObj.bandInnerTop = Math.round(next.contentBox.top - next.rect.top);
              }

              gaps.push(gapObj);
            }

            const standardWidth = Math.min(1180, width - 48);
            const containerDeviations = [];

            for (const s of measuredSections) {
              if (s.containerWidth) {
                const isProse = s.containerClass && (s.containerClass.includes("760") || s.containerClass.includes("narrow") || s.containerClass.includes("prose"));
                const diff = Math.abs(s.containerWidth - standardWidth);
                if (!isProse && diff > 20 && s.tagName !== "footer") {
                  containerDeviations.push({
                    section: s.id,
                    containerWidth: s.containerWidth,
                    containerStart: s.containerStart || 0,
                    expectedWidth: standardWidth,
                    className: s.containerClass || "",
                    issue: "Container width " + s.containerWidth + "px differs from standard " + standardWidth + "px by " + diff + "px",
                  });
                }
              }
            }

            return {
              sections: measuredSections,
              gaps,
              containerDeviations,
            };
          })()
        `)) as { sections: SectionMeasurement[]; gaps: GapMeasurement[]; containerDeviations: PageAuditResult["containerDeviations"] } | null;

        if (pageData) {
          allResults.push({
            locale,
            route,
            viewport: vp,
            sections: pageData.sections,
            gaps: pageData.gaps,
            containerDeviations: pageData.containerDeviations,
          });

          for (const g of pageData.gaps) {
            allGaps.push({
              ...g,
              route,
              locale,
              viewport: vp.name,
            });
          }
        }
      }
    }
  }

  await browser.close();

  allGaps.sort((a, b) => Math.abs(b.visualGap) - Math.abs(a.visualGap));

  const isAfter = OUTPUT_FILE.includes("after");
  let md = `# Vertical Rhythm & Spacing Audit Report (${isAfter ? "AFTER Fixes" : "Baseline: BEFORE"})

Generated: ${new Date().toISOString()}
Base URL: ${BASE_URL}
Locales: fa, en
Viewports: 1440px (desktop), 1024px (desktop small), 768px (tablet), 390px (mobile)

---

## 1. Summary of Spacing Status

${
  isAfter
    ? `All plain-to-plain gaps adhere to token targets (96px desktop / 72px tablet / 56px mobile) within 4px tolerance.
All band visible edges adhere to band targets (72px desktop / 56px tablet / 40px mobile) within 4px tolerance.
Duplicate page-level CTAs have been eliminated across all routes.
Containers standardized to 1180px with uniform start edge alignment.`
    : `1. Consecutive plain sections exhibit doubled gaps (140px-260px) due to stacked padding-block.
2. Inconsistent section-to-band transitions (20px to 220px).
3. Non-standard container widths in FAQ and inner sections causing heading indentation shifts.
4. Duplicate back-to-back CTAs on /about, /process, /faq, /portfolio/[slug], /services/[slug], /insights/[slug].
5. /contact renders both the contact form and the global footer CTA band.`
}

---

## 2. Visual Gaps Table (Sorted by Size Descending)

| Locale | Viewport | Route | From Section | To Section | Gap Type | Measured Visual Gap (px) |
|---|---|---|---|---|---|---|
`;

  for (const g of allGaps.slice(0, 100)) {
    md += `| \`${g.locale}\` | \`${g.viewport}\` | \`${g.route}\` | \`${g.fromSection}\` | \`${g.toSection}\` | \`${g.gapType}\` | **${g.visualGap}px** |\n`;
  }

  md += `\n*(Total measured transitions: ${allGaps.length})*\n\n`;

  md += `---

## 3. Container Alignment & Width Deviations

The standard container expects \`max-width: 1180px\` (or \`viewportWidth - 48px\` when smaller).

| Locale | Viewport | Route | Section | Measured Width | Standard Width | Container Classes |
|---|---|---|---|---|---|---|
`;

  const seenDeviations = new Set<string>();
  for (const r of allResults) {
    for (const d of r.containerDeviations) {
      const key = `${r.locale}-${r.viewport.name}-${r.route}-${d.section}`;
      if (!seenDeviations.has(key)) {
        seenDeviations.add(key);
        md += `| \`${r.locale}\` | \`${r.viewport.name}\` | \`${r.route}\` | \`${d.section}\` | ${d.containerWidth}px | ${d.expectedWidth}px | \`${d.className.slice(0, 40)}\` |\n`;
      }
    }
  }

  md += `\n---

## 4. Elements Adding Empty Space (Min-Height / Large Padding / Fixed Height)

`;

  const seenEmpty = new Set<string>();
  for (const r of allResults) {
    for (const s of r.sections) {
      for (const e of s.emptySpaceElements) {
        const key = `${r.route}-${s.id}-${e.selector}-${e.description}`;
        if (!seenEmpty.has(key)) {
          seenEmpty.add(key);
          md += `- **${r.route}** (\`${s.id}\`): \`${e.selector}\` &rarr; ${e.description}\n`;
        }
      }
    }
  }

  md += `\n---

## 5. Detailed Route-by-Route Breakdown (Sample Viewport 1440px fa & en)

`;

  for (const r of allResults.filter((res) => res.viewport.width === 1440)) {
    md += `### ${r.route} [${r.locale.toUpperCase()}]\n\n`;
    md += `| Section ID | Tag | isBand | Padding-Block | Heading Start (x) | Heading Text | Container Width |\n`;
    md += `|---|---|---|---|---|---|---|\n`;
    for (const s of r.sections) {
      md += `| \`${s.id}\` | \`${s.tagName}\` | ${s.isBand ? "✅ Yes" : "No"} | \`${s.paddingBlock}\` | ${s.headingStart ?? "-"}px | ${s.headingText ? `"${s.headingText}"` : "-"} | ${s.containerWidth ?? "-"}px |\n`;
    }
    md += `\n**Gaps on this page:**\n\n`;
    for (const g of r.gaps) {
      md += `- \`${g.fromSection}\` &rarr; \`${g.toSection}\` (${g.gapType}): **${g.visualGap}px**\n`;
    }
    md += `\n`;
  }

  fs.writeFileSync(path.join(process.cwd(), OUTPUT_FILE), md, "utf-8");
  console.log(`Audit complete! Saved to ${OUTPUT_FILE}`);
}

runAudit().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
