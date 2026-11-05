import { entityConfig } from "@/lib/seo/entity";
import { services } from "@/content/services";

export async function GET() {
  const markdown = `# ${entityConfig.canonicalName.en} (${entityConfig.canonicalName.fa})

> ${entityConfig.definition.en}
> ${entityConfig.definition.fa}

## Canonical URL
- ${entityConfig.url}

## Core Services
${entityConfig.services
  .map(
    (s) =>
      `- **${s.name.en}** (${s.name.fa}): ${entityConfig.url}/fa/services/${s.slug}
  *Primary Capability:* ${s.primaryKeyword.en}`,
  )
  .join("\n")}

## Organization & Trust
- **Parent Brand:** ${entityConfig.parentOrganization.name} (${entityConfig.parentOrganization.url})
- **Areas Served:** ${entityConfig.areaServed.join(", ")}
- **Technical Expertise:** ${entityConfig.knowsAbout.join(", ")}
- **Official Profiles:**
${entityConfig.sameAs.map((url) => `  - ${url}`).join("\n")}

## Contact & Inquiries
- **Consultation Page:** ${entityConfig.url}/fa/contact
- **Case Studies & Portfolio:** ${entityConfig.url}/fa/portfolio
- **Technical Insights:** ${entityConfig.url}/fa/insights
`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
