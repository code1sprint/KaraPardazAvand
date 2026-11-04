import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ProseProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/** MDX / long-form content styles — software-native, token-driven. */
export function Prose({ children, className, ...props }: ProseProps) {
  return (
    <div
      className={cn(
        "prose max-w-[65ch] text-start text-base leading-[var(--leading-body)] text-text",
        "[&_a]:text-blue [&_a]:underline-offset-4 hover:[&_a]:underline",
        "[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-[length:var(--h2-size)] [&_h2]:font-black [&_h2]:tracking-[var(--h2-tracking)] [&_h2]:leading-[var(--leading-h2)]",
        "[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-extrabold",
        "[&_p]:my-4 [&_p]:text-muted",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:ps-5 [&_ul]:text-muted",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:ps-5 [&_ol]:text-muted",
        "[&_li]:my-1",
        "[&_blockquote]:my-6 [&_blockquote]:border-s-2 [&_blockquote]:border-sky [&_blockquote]:ps-4 [&_blockquote]:text-muted",
        "[&_code]:rounded-[var(--radius-node)] [&_code]:bg-blue-soft [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-text [&_code]:[unicode-bidi:isolate]",
        "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-code [&_pre]:border [&_pre]:border-win-line [&_pre]:bg-win-bg [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:text-win-muted [&_pre]:[direction:ltr] [&_pre]:text-start",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:[unicode-bidi:normal]",
        "[&_hr]:my-10 [&_hr]:border-line",
        "[&_strong]:font-bold [&_strong]:text-text",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
