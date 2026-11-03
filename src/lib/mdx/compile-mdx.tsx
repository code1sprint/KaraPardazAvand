import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import type { ReactElement } from "react";
import { CodeBlock } from "@/components/visuals/CodeBlock";
import { slugifyHeading } from "./slugify";

export type TocItem = {
  id: string;
  title: string;
  depth: 2 | 3;
};

export function extractToc(source: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of source.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const depth = match[1].length as 2 | 3;
    const title = match[2].replace(/\s+#+\s*$/, "").trim();
    const id = slugifyHeading(title);
    if (!id) continue;
    items.push({ id, title, depth });
  }
  return items;
}

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-10 scroll-mt-24 text-2xl font-bold leading-[var(--leading-heading)] text-text first:mt-0"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-8 scroll-mt-24 text-xl font-semibold leading-[var(--leading-heading)] text-text"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="my-4 text-base leading-[var(--leading-body)] text-text sm:text-[length:var(--text-body-lg)]"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 list-disc space-y-2 ps-6 text-text" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 list-decimal space-y-2 ps-6 text-text" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-[var(--leading-body)]" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-accent underline-offset-4 hover:underline"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => {
    const isBlock =
      Boolean(props.className?.includes("language-")) ||
      Boolean(props["data-language" as keyof typeof props]);
    if (isBlock) {
      return <code {...props} />;
    }
    return (
      <code
        className="rounded-[var(--radius-node)] bg-blue-soft px-1.5 py-0.5 font-mono text-sm text-text [unicode-bidi:isolate]"
        {...props}
      />
    );
  },
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <CodeBlock className="my-6" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="my-6 border-s-2 border-accent ps-4 text-muted"
      {...props}
    />
  ),
};

export async function compileMdxSource(
  source: string,
): Promise<{ content: ReactElement; toc: TocItem[] }> {
  "use cache";

  const toc = extractToc(source);

  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              // Matches CodeBlock dark product surface (win-bg).
              theme: "github-dark",
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });

  return { content, toc };
}
