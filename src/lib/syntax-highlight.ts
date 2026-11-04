import hljs from "highlight.js";

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Highlights all <pre><code ...> code blocks in an HTML string with highlight.js,
 * attaching data-language and direction attributes so they render properly in both
 * admin preview and frontend reader.
 */
export function highlightHtmlCodeBlocks(html?: string): string {
  if (!html || !html.includes("<pre")) return html || "";

  const preCodeRegex = /<pre([^>]*)><code([^>]*)>([\s\S]*?)<\/code><\/pre>/gi;

  return html.replace(preCodeRegex, (fullMatch, preAttrs, codeAttrs, rawCode) => {
    try {
      const langMatch =
        codeAttrs.match(/class=["'][^"']*language-([^\s"']+)[^"']*["']/i) ||
        preAttrs.match(/data-language=["']([^"']+)["']/i);
      const lang = langMatch ? langMatch[1] : "";

      const decoded = decodeHtmlEntities(rawCode);
      if (!decoded.trim()) {
        const langLabel = lang || "code";
        return `<pre class="code-block" data-language="${langLabel}" dir="ltr"><code class="language-${langLabel}"><span class="text-win-muted/60 italic">// قطعه کد</span></code></pre>`;
      }

      const validLang = lang && hljs.getLanguage(lang) ? lang : undefined;
      const highlighted = validLang
        ? hljs.highlight(decoded, { language: validLang, ignoreIllegals: true }).value
        : hljs.highlightAuto(decoded).value;

      const langLabel = lang || (validLang ? lang : "code");
      return `<pre class="code-block" data-language="${langLabel}" dir="ltr"><code class="language-${langLabel}">${highlighted}</code></pre>`;
    } catch {
      return fullMatch;
    }
  });
}
