import { serializeJsonLd } from "@/lib/seo/jsonld";

type Props = {
  data?: Record<string, unknown> | Record<string, unknown>[];
  schema?: Record<string, unknown> | Record<string, unknown>[];
};

/** Server-safe, properly escaped JSON-LD script tag. */
export function JsonLd({ data, schema }: Props) {
  const payload = schema ?? data;
  if (!payload) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(payload) }}
    />
  );
}
