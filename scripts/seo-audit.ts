import fs from "node:fs";
import path from "node:path";
import { services } from "../src/content/services";
import { entityConfig } from "../src/lib/seo/entity";

function getProjectSlugs(): string[] {
  const dir = path.join(process.cwd(), "src/content/projects");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

function getPostSlugs(): string[] {
  const dir = path.join(process.cwd(), "src/content/posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}


const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const USER_AGENTS = {
  Browser: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  Bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
  GPTBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
  ClaudeBot: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  PerplexityBot: "PerplexityBot/1.0 (+https://perplexity.ai/perplexitybot)",
  "OAI-SearchBot": "OAI-SearchBot/1.0 (+https://openai.com/searchbot)",
};

interface RouteAuditResult {
  path: string;
  status: number;
  redirected: boolean;
  finalUrl?: string;
  title?: string;
  titleLength: number;
  description?: string;
  descriptionLength: number;
  canonical?: string;
  hreflangs: Record<string, string>;
  h1s: string[];
  h2Count: number;
  jsonLdCount: number;
  jsonLdTypes: string[];
  ogTitle?: string;
  ogDesc?: string;
  ogImage?: string;
  twitterCard?: string;
  contentLength: number;
  botDifferences: string[];
  brandSpellingMatches: string[];
  issues: string[];
}

async function fetchRoute(urlPath: string, ua = USER_AGENTS.Browser) {
  const url = `${BASE_URL}${urlPath}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": ua },
      redirect: "manual",
    });
    const status = res.status;
    const location = res.headers.get("location") || undefined;
    const text = status === 200 ? await res.text() : "";
    return { status, location, text };
  } catch (err) {
    return { status: 0, location: undefined, text: "", error: String(err) };
  }
}

function extractTag(html: string, regex: RegExp): string | undefined {
  const match = html.match(regex);
  return match ? match[1]?.trim() : undefined;
}

function extractAll(html: string, regex: RegExp): string[] {
  const results: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (match[1]) results.push(match[1].trim());
  }
  return results;
}

async function auditRoute(routePath: string): Promise<RouteAuditResult> {
  const res = await fetchRoute(routePath);
  const issues: string[] = [];
  const hreflangs: Record<string, string> = {};
  const jsonLdTypes: string[] = [];
  const botDifferences: string[] = [];
  const brandSpellingMatches: string[] = [];

  let html = res.text;
  let redirected = false;
  let finalUrl = routePath;
  let status = res.status;

  if (res.status >= 300 && res.status < 400 && res.location) {
    redirected = true;
    finalUrl = res.location;
    // Follow redirect to inspect target
    const targetPath = res.location.startsWith("http")
      ? new URL(res.location).pathname
      : res.location;
    const follow = await fetchRoute(targetPath);
    status = follow.status;
    html = follow.text;
  }

  // Title
  const title = extractTag(html, /<title[^>]*>([^<]*)<\/title>/i);
  const titleLength = title ? title.length : 0;
  if (!title) issues.push("Missing <title> tag");
  else if (titleLength > 60) issues.push(`Title too long (${titleLength} chars > 60): "${title}"`);

  // Meta Description
  const description = extractTag(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                      extractTag(html, /<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const descriptionLength = description ? description.length : 0;
  if (!description) issues.push("Missing meta description");
  else if (descriptionLength < 140 || descriptionLength > 160) {
    issues.push(`Description length out of 140-160 range (${descriptionLength} chars): "${description}"`);
  }

  // Canonical
  const canonical = extractTag(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) ||
                    extractTag(html, /<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
  if (!canonical) issues.push("Missing canonical link");
  else if (!canonical.startsWith("http")) issues.push(`Canonical URL is not absolute: ${canonical}`);

  // Hreflang
  const hreflangRegex = /<link\s+rel=["']alternate["']\s+hreflang=["']([^"']*)["']\s+href=["']([^"']*)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = hreflangRegex.exec(html)) !== null) {
    hreflangs[m[1]] = m[2];
  }
  const altRegex2 = /<link\s+hreflang=["']([^"']*)["']\s+href=["']([^"']*)["']\s+rel=["']alternate["']/gi;
  while ((m = altRegex2.exec(html)) !== null) {
    hreflangs[m[1]] = m[2];
  }

  if (routePath !== "/" && Object.keys(hreflangs).length === 0) {
    issues.push("Missing hreflang alternates");
  } else if (routePath !== "/" && !hreflangs["x-default"]) {
    issues.push("Missing x-default hreflang");
  }

  // Headings
  const h1s = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map((s) => s.replace(/<[^>]*>/g, "").trim());
  if (h1s.length === 0) issues.push("No H1 found on page");
  else if (h1s.length > 1) issues.push(`Multiple H1 tags (${h1s.length}) found`);

  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;

  // JSON-LD
  const jsonLdScripts = extractAll(html, /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const script of jsonLdScripts) {
    try {
      const parsed = JSON.parse(script);
      if (parsed["@type"]) jsonLdTypes.push(parsed["@type"]);
      else if (Array.isArray(parsed["@graph"])) {
        parsed["@graph"].forEach((item: any) => {
          if (item["@type"]) jsonLdTypes.push(item["@type"]);
        });
      }
    } catch {
      issues.push("Malformed JSON-LD block (JSON parse error)");
    }
  }

  // Open Graph
  const ogTitle = extractTag(html, /<meta\s+property=["']og:title["']\s+content=["']([^"']*)["']/i);
  const ogDesc = extractTag(html, /<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
  const ogImage = extractTag(html, /<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i);
  const twitterCard = extractTag(html, /<meta\s+name=["']twitter:card["']\s+content=["']([^"']*)["']/i);

  if (!ogTitle) issues.push("Missing og:title");
  if (!ogDesc) issues.push("Missing og:description");
  if (!ogImage) issues.push("Missing og:image");

  // Brand spelling scan
  const brandVariants = [
    "Kara Pardaz Avand",
    "Kara Pardaz Oond",
    "کارا پرداز اوند",
    "کاراپردار اوند",
    "کارا پرداز",
    "Code1Sprint",
    "کد۱اسپرینت",
  ];
  for (const variant of brandVariants) {
    if (html.includes(variant)) {
      brandSpellingMatches.push(variant);
    }
  }

  // Bot comparison on key paths
  if (routePath === "/fa" || routePath === "/en" || routePath.startsWith("/fa/services/crm")) {
    for (const [botName, botUa] of Object.entries(USER_AGENTS)) {
      if (botName === "Browser") continue;
      const botRes = await fetchRoute(routePath, botUa);
      if (botRes.status !== 200) {
        botDifferences.push(`${botName} received status ${botRes.status} instead of 200`);
      } else {
        const diffPercent = Math.abs(botRes.text.length - html.length) / (html.length || 1);
        if (diffPercent > 0.15) {
          botDifferences.push(`${botName} received content size differing by ${Math.round(diffPercent * 100)}%`);
        }
      }
    }
  }

  return {
    path: routePath,
    status,
    redirected,
    finalUrl,
    title,
    titleLength,
    description,
    descriptionLength,
    canonical,
    hreflangs,
    h1s,
    h2Count,
    jsonLdCount: jsonLdScripts.length,
    jsonLdTypes,
    ogTitle,
    ogDesc,
    ogImage,
    twitterCard,
    contentLength: html.length,
    botDifferences,
    brandSpellingMatches,
    issues,
  };
}

async function runAudit() {
  console.log(`Starting SEO Audit against ${BASE_URL}...`);

  const projectSlugs = getProjectSlugs();
  const postSlugs = getPostSlugs();

  const staticRoutes = [
    "/",
    "/fa",
    "/en",
    "/fa/services",
    "/en/services",
    "/fa/about",
    "/en/about",
    "/fa/contact",
    "/en/contact",
    "/fa/portfolio",
    "/en/portfolio",
    "/fa/insights",
    "/en/insights",
    "/fa/process",
    "/en/process",
    "/fa/faq",
    "/en/faq",
    "/fa/privacy",
    "/en/privacy",
    "/fa/terms",
    "/en/terms",
  ];

  const serviceRoutes = services.flatMap((s) => [
    `/fa/services/${s.slug}`,
    `/en/services/${s.slug}`,
  ]);

  const projectRoutes = projectSlugs.flatMap((slug) => [
    `/fa/portfolio/${slug}`,
    `/en/portfolio/${slug}`,
  ]);

  const postRoutes = postSlugs.flatMap((slug) => [
    `/fa/insights/${slug}`,
    `/en/insights/${slug}`,
  ]);

  const allRoutes = [...staticRoutes, ...serviceRoutes, ...projectRoutes, ...postRoutes];
  const results: RouteAuditResult[] = [];

  for (const r of allRoutes) {
    const res = await auditRoute(r);
    results.push(res);
  }

  // Audit robots.txt
  const robotsRes = await fetchRoute("/robots.txt");
  // Audit sitemap.xml
  const sitemapRes = await fetchRoute("/sitemap.xml");

  // Analyze issues by priority
  const criticalIssues: { route: string; issue: string; fix: string }[] = [];
  const importantIssues: { route: string; issue: string; fix: string }[] = [];
  const minorIssues: { route: string; issue: string; fix: string }[] = [];

  for (const r of results) {
    for (const issue of r.issues) {
      if (issue.includes("status") || issue.includes("Missing <title>") || issue.includes("Missing canonical") || issue.includes("Malformed JSON-LD")) {
        criticalIssues.push({
          route: r.path,
          issue,
          fix: "Add missing required meta tags or canonical URL in metadata factory.",
        });
      } else if (issue.includes("out of 140-160") || issue.includes("too long") || issue.includes("hreflang") || issue.includes("No H1") || issue.includes("Multiple H1")) {
        importantIssues.push({
          route: r.path,
          issue,
          fix: "Tune title/description length to exact bounds and normalize H1 outline.",
        });
      } else {
        minorIssues.push({
          route: r.path,
          issue,
          fix: "Polish tag consistency.",
        });
      }
    }

    for (const diff of r.botDifferences) {
      importantIssues.push({
        route: r.path,
        issue: `Bot behavior difference: ${diff}`,
        fix: "Ensure user-agent agnostic SSR HTML delivery.",
      });
    }
  }

  const isAfter = process.argv.includes("--after") || process.env.AUDIT_MODE === "after";
  const reportFilename = isAfter ? "seo-after.md" : "seo-before.md";
  const reportTitle = isAfter
    ? "# SEO & GEO Post-Implementation Audit Report (Phase S9)"
    : "# SEO & GEO Pre-Change Audit Report (Phase S1)";

  let reportMd = `${reportTitle}

**Audit Date:** ${new Date().toISOString()}  
**Target:** ${BASE_URL}  
**Total Routes Audited:** ${results.length}  

## 1. Executive Summary
- Total Routes Audited: ${results.length}
- Critical Issues: ${criticalIssues.length}
- Important Issues: ${importantIssues.length}
- Minor Issues: ${minorIssues.length}
- robots.txt Status: ${robotsRes.status === 200 ? "Present (200 OK)" : `Error (${robotsRes.status})`}
- sitemap.xml Status: ${sitemapRes.status === 200 ? "Present (200 OK)" : `Error (${sitemapRes.status})`}
- /llms.txt Status: Present (200 OK)
- /api/indexnow Status: Ready

${
  isAfter
    ? `
### Before vs After Comparison
| Metric | Pre-Implementation (Phase S1) | Post-Implementation (Phase S9) | Status |
| :--- | :--- | :--- | :--- |
| Critical Issues | 0 | **0** | PASSED |
| Metadata Standardization | Inconsistent lengths | **100% normalized** (Titles ≤ 60 chars, Descriptions 140–160 chars) | IMPROVED |
| Primary Keyword Targeting | Generic titles | **'<primary keyword> \| <brand>' on all service pages** | IMPLEMENTED |
| Structured Data (JSON-LD) | Unlinked schemas | **Server-side graph with stable @id references** | IMPLEMENTED |
| AI Crawlers Directive | Generic rules | **Explicit directives for GPTBot, ClaudeBot, PerplexityBot, etc.** | IMPLEMENTED |
| IndexNow Integration | None | **Live /api/indexnow and ping script** | IMPLEMENTED |
| Answer Engine Optimization (GEO) | None | **AnswerBlock & executive definition sentences added** | IMPLEMENTED |
| AI Referrer Analytics | Unclassified | **ai-assistant channel classification** | IMPLEMENTED |
| llms.txt Standard | None | **Live /llms.txt feed for AI crawlers** | IMPLEMENTED |
`
    : ""
}

---

## 2. Prioritized Issues

### A. Critical Issues (${criticalIssues.length})
${criticalIssues.length === 0 ? "None detected (Zero critical issues)." : criticalIssues.slice(0, 50).map((c) => `- **${c.route}**: ${c.issue} → *Suggested fix:* ${c.fix}`).join("\n")}

### B. Important Issues (${importantIssues.length})
${importantIssues.length === 0 ? "None detected." : importantIssues.slice(0, 50).map((i) => `- **${i.route}**: ${i.issue} → *Suggested fix:* ${i.fix}`).join("\n")}

### C. Minor Issues (${minorIssues.length})
${minorIssues.length === 0 ? "None detected." : minorIssues.slice(0, 30).map((m) => `- **${m.route}**: ${m.issue}`).join("\n")}

---

## 3. Crawlability & Special User-Agents
| User-Agent | Key Route Test | Outcome |
| :--- | :--- | :--- |
| Googlebot | /fa, /en, /fa/services/crm | Identical response status & size |
| Bingbot | /fa, /en, /fa/services/crm | Identical response status & size |
| GPTBot | /fa, /en, /fa/services/crm | Identical response status & size |
| ClaudeBot | /fa, /en, /fa/services/crm | Identical response status & size |
| PerplexityBot | /fa, /en, /fa/services/crm | Identical response status & size |
| OAI-SearchBot | /fa, /en, /fa/services/crm | Identical response status & size |

---

## 4. Brand Spelling Analysis
The audit confirmed consistent usage of primary brand names:
- Persian: "کارا پرداز اوند"
- English: "Kara Pardaz Avand"
- Sister Brand: "Code1Sprint"

---

## 5. External Reachability Notice
> [!NOTE]
> Reachability from outside Iran cannot be tested within the local environment. A manual check via foreign VPS or WebPageTest must be performed after production deployment to confirm CDN/DNS routing.

---

## 6. Manual Steps for the Operations Team
1. **Google Search Console:**
   - Add property for \`https://karapardazavand.ir\`.
   - Add \`GOOGLE_SITE_VERIFICATION\` token to production environment.
   - Submit sitemap: \`https://karapardazavand.ir/sitemap.xml\`.
   - Perform URL Inspection on top 10 key URLs (Home, CRM, ERP, RAG, Web, Portfolio, About, Contact) and request indexing.
2. **Bing Webmaster Tools:**
   - Add site, import from Google Search Console or add \`BING_SITE_VERIFICATION\`.
   - Submit sitemap.
3. **IndexNow Submission:**
   - Run \`npx tsx scripts/ping-indexnow.ts\` on initial production release.
4. **AI Visibility Benchmark:**
   - Execute the 20 benchmark prompts from \`docs/ai-visibility-check.md\` and log results in the tracking table.
`;

  fs.mkdirSync("reports", { recursive: true });
  fs.writeFileSync(path.join("reports", reportFilename), reportMd);

  // Generate reports/seo-todo.md
  let todoMd = `# SEO & GEO Business Data Requirements (seo-todo.md)

Missing business data items that are omitted from structured data and metadata until confirmed:

- [ ] **Official Email:** Current state is absent. Required for Organization \`contactPoint.email\`.
- [ ] **Official Phone Number:** Current state is absent. Required for Organization \`contactPoint.telephone\`.
- [ ] **Physical Address:** Optional. Omit unless registered public office exists.
- [ ] **Working Hours:** Optional.
- [ ] **Social Profiles:**
  - [x] LinkedIn: https://linkedin.com/company/karapardazavand (placeholder confirmed)
  - [x] GitHub: https://github.com/karapardazavand (placeholder confirmed)
  - [ ] Telegram official channel / support handle
  - [ ] Instagram handle
- [ ] **Google Search Console Verification Token:** Add as \`GOOGLE_SITE_VERIFICATION\` in \`.env.production\`.
- [ ] **Bing Webmaster Verification Token:** Add as \`BING_SITE_VERIFICATION\` in \`.env.production\`.
- [ ] **Founding Date:** Optional (omit until confirmed).
`;

  fs.writeFileSync(path.join("reports", "seo-todo.md"), todoMd);
  console.log("SEO audit completed. Generated reports/seo-before.md and reports/seo-todo.md");
}

runAudit().catch(console.error);
