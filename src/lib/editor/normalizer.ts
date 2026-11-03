import { ITocItem } from "../db/models/Post";
import { slugifyHeading } from "../mdx/slugify";

export { slugifyHeading };

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(str: string): string {
  return str.replace(/[0-9]/g, (w) => PERSIAN_DIGITS[parseInt(w, 10)]);
}

/**
 * Normalizes Persian characters: converts Arabic kaf and yeh to Persian,
 * handles ZWNJ whitespace cleanups, and normalizes common ligature edge cases.
 */
export function normalizePersianText(text: string): string {
  if (!text) return "";

  return text
    // Arabic Kaf -> Persian Keh
    .replace(/\u0643/g, "\u06a9")
    // Arabic Yeh & Alef Maksura -> Persian Yeh
    .replace(/[\u0649\u064a]/g, "\u06cc")
    // Arabic Teh Marbuta -> Heh
    .replace(/\u0629/g, "\u0647")
    // Space before or after ZWNJ cleanup
    .replace(/\s+\u200c/g, "\u200c")
    .replace(/\u200c\s+/g, "\u200c")
    // Multiple ZWNJs -> single ZWNJ
    .replace(/\u200c{2,}/g, "\u200c");
}

export interface ProcessedPostContent {
  contentHtml: string;
  toc: ITocItem[];
  readingTime: number;
}

/**
 * Processes post HTML:
 * 1. For Persian locale: normalizes characters and converts digits outside code/tags to Persian digits.
 * 2. Parses <h2> and <h3> headings, injects unique slugified id attributes, and builds the TOC array.
 * 3. Calculates estimated reading time.
 */
export function processPostContent(
  rawHtml: string,
  locale: "fa" | "en" = "fa",
): ProcessedPostContent {
  if (!rawHtml || typeof rawHtml !== "string") {
    return { contentHtml: "", toc: [], readingTime: 1 };
  }

  const toc: ITocItem[] = [];
  const slugCounts = new Map<string, number>();

  // 1. Heading extraction and ID injection
  // Match <h2>...</h2> and <h3>...</h3>
  const headingRegex = /<h([23])(?:\s+[^>]*)?>([\s\S]*?)<\/h\1>/gi;

  const htmlWithIds = rawHtml.replace(headingRegex, (match, levelStr, innerText) => {
    const depth = parseInt(levelStr, 10);
    // Strip nested tags to get plain title
    const plainTitle = innerText.replace(/<[^>]+>/g, "").trim();
    if (!plainTitle) return match;

    const baseSlug = slugifyHeading(plainTitle);
    const count = slugCounts.get(baseSlug) || 0;
    slugCounts.set(baseSlug, count + 1);

    const uniqueId = count === 0 ? baseSlug : `${baseSlug}-${count}`;

    toc.push({
      id: uniqueId,
      title: plainTitle,
      depth,
    });

    return `<h${levelStr} id="${uniqueId}">${innerText}</h${levelStr}>`;
  });

  // 2. Normalization for Persian locale
  let finalHtml = htmlWithIds;
  if (locale === "fa") {
    // We want to normalize text, but leave <pre><code>...</code></pre> and HTML tags untouched.
    // We split by <pre[\s\S]*?<\/pre> and HTML tags <[^>]+>
    finalHtml = htmlWithIds.replace(
      /(<pre[\s\S]*?<\/pre>|<code[\s\S]*?<\/code>|<[^>]+>|[^<]+)/gi,
      (segment) => {
        // If it is a pre or code block, preserve as-is (just ensure dir="ltr" if missing)
        if (segment.startsWith("<pre") || segment.startsWith("<code")) {
          return segment;
        }
        // If it's an HTML tag, don't modify attribute names or values (like href URLs)
        if (segment.startsWith("<")) {
          return segment;
        }
        // Normal text node: normalize Arabic chars & convert numbers
        const normalizedText = normalizePersianText(segment);
        return toPersianDigits(normalizedText);
      },
    );
  }

  // 3. Calculate reading time (words / 200 wpm)
  const plainText = finalHtml.replace(/<[^>]+>/g, " ").trim();
  const wordCount = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    contentHtml: finalHtml,
    toc,
    readingTime,
  };
}
