import { test, expect } from "@playwright/test";

interface MeasurementGap {
  type: string;
  from: string;
  to: string;
  measured: number;
}

interface MeasurementResult {
  gaps: MeasurementGap[];
  hasFooterCta: boolean;
}

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

const LOCALES = ["fa", "en"];

const TARGETS = {
  1440: { plain: 96, bandEdge: 72, bandInner: 120 },
  768: { plain: 72, bandEdge: 56, bandInner: 96 },
  390: { plain: 56, bandEdge: 40, bandInner: 72 },
} as const;

type TestWidth = keyof typeof TARGETS;

for (const widthStr of [1440, 768, 390] as TestWidth[]) {
  const width = Number(widthStr) as TestWidth;
  const target = TARGETS[width];

  test.describe(`Spacing & Rhythm @ width ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const locale of LOCALES) {
      for (const route of ROUTES) {
        const fullPath = `/${locale}${route === "/" ? "" : route}`;

        test(`${fullPath}: section gaps match token targets within 4px`, async ({ page }) => {
          await page.goto(fullPath, { waitUntil: "domcontentloaded" });
          await page.addStyleTag({ content: "*, *::before, *::after { transform: none !important; transition: none !important; animation: none !important; }" });
          await page.waitForTimeout(300);

          const measurements = await page.evaluate<MeasurementResult | null>(`
            (() => {
              const locale = ${JSON.stringify(locale)};
              const width = ${width};
              const isRTL = locale === "fa";
              const main = document.querySelector("main");
              const footer = document.querySelector("footer");

              if (!main) return null;

              const sections = Array.from(main.children).filter((el) => {
                if (el.tagName === "SCRIPT" || el.tagName === "STYLE") return false;
                if (el.classList.contains("route-transition")) return false;
                return el.getBoundingClientRect().height > 0;
              });

              const isVisible = (el) => {
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
                  if (!isVisible(el)) return false;
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
                    el.tagName === "P" ||
                    el.tagName === "BUTTON" ||
                    el.tagName === "A" ||
                    el.tagName === "IMG" ||
                    el.tagName === "SVG"
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

              const measured = sections.map((el, idx) => {
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
                if (heading) {
                  const hRect = heading.getBoundingClientRect();
                  headingStart = isRTL ? Math.round(width - hRect.right) : Math.round(hRect.left);
                }

                const container = el.querySelector('[class*="max-w-"], [class*="container"]') || el;
                let containerWidth = null;
                let containerStart = null;
                let isProse = false;
                if (container) {
                  const cRect = container.getBoundingClientRect();
                  containerWidth = Math.round(cRect.width);
                  containerStart = isRTL ? Math.round(width - cRect.right) : Math.round(cRect.left);
                  isProse = container.className && (container.className.includes("760") || container.className.includes("prose"));
                }

                return {
                  id: el.id || el.getAttribute("aria-labelledby") || (el.tagName.toLowerCase() + "-" + idx),
                  isBand,
                  rect: { top: Math.round(rect.top), bottom: Math.round(rect.bottom) },
                  contentBox: { top: Math.round(contentBox.top), bottom: Math.round(contentBox.bottom) },
                  headingStart,
                  containerWidth,
                  containerStart,
                  isProse,
                };
              });

              const gaps = [];
              for (let i = 0; i < measured.length - 1; i++) {
                const current = measured[i];
                const next = measured[i + 1];

                if (!current.isBand && !next.isBand) {
                  gaps.push({
                    type: "plain-to-plain",
                    from: current.id,
                    to: next.id,
                    measured: Math.round(next.contentBox.top - current.contentBox.bottom),
                  });
                } else if (!current.isBand && next.isBand) {
                  gaps.push({
                    type: "plain-to-band",
                    from: current.id,
                    to: next.id,
                    measured: Math.round(next.rect.top - current.contentBox.bottom),
                  });
                } else if (current.isBand && !next.isBand) {
                  gaps.push({
                    type: "band-to-plain",
                    from: current.id,
                    to: next.id,
                    measured: Math.round(next.contentBox.top - current.rect.bottom),
                  });
                }
              }

              // Check CTA counts on the page
              const ctaButtons = Array.from(document.querySelectorAll('a[href*="/contact"], button')).filter((el) => {
                const text = (el.textContent || "").toLowerCase();
                return text.includes("مشاوره") || text.includes("consult") || text.includes("contact");
              });

              return {
                sections: measured,
                gaps,
                hasFooterCta: Boolean(footer && footer.querySelector("[data-footer-cta]")),
              };
            })()
          `);

          expect(measurements).not.toBeNull();
          if (!measurements) return;

          // Verify gaps against targets within 4px
          for (const g of measurements.gaps) {
            if (g.type === "plain-to-plain") {
              const diff = Math.abs(g.measured - target.plain);
              expect(
                diff,
                `Plain-to-plain gap between "${g.from}" and "${g.to}" was ${g.measured}px (expected ${target.plain}px ± 4px)`
              ).toBeLessThanOrEqual(4);
            } else if (g.type === "plain-to-band" || g.type === "band-to-plain") {
              const diff = Math.abs(g.measured - target.bandEdge);
              expect(
                diff,
                `Band edge gap for "${g.from}" -> "${g.to}" was ${g.measured}px (expected ${target.bandEdge}px ± 4px)`
              ).toBeLessThanOrEqual(4);
            }
          }

          // Verify single CTA on /contact
          if (route === "/contact") {
            // Footer CTA launchpad should NOT be displayed on contact page
            expect(
              measurements.hasFooterCta,
              "/contact page must NOT render the footer closing CTA band"
            ).toBe(false);
          }
        });
      }
    }
  });
}
