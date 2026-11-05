import type { FC } from "react";
import { cn } from "@/lib/cn";

export interface AnswerBlockProps {
  title?: string;
  definition: string;
  targetAudience?: string;
  className?: string;
}

/**
 * AnswerBlock: A high-signal, factual answer block designed for Answer Engines (GEO)
 * and human readers seeking an immediate, precise summary of what the service does and who it serves.
 */
export const AnswerBlock: FC<AnswerBlockProps> = ({
  title,
  definition,
  targetAudience,
  className,
}) => {
  return (
    <div
      data-geo="answer-block"
      className={cn(
        "relative rounded-2xl border border-line bg-panel/80 p-5 sm:p-6 backdrop-blur-sm shadow-sm transition-colors",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* v3 signature orange marker */}
        <span
          className="mt-1.5 inline-block h-2.5 w-2.5 shrink-0 rotate-45 rounded-[2px] bg-gradient-to-tr from-[#FF800D] to-[#FFB843]"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-2">
          {title ? (
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              {title}
            </span>
          ) : null}
          <p className="text-base sm:text-lg font-medium leading-relaxed text-text">
            {definition}
          </p>
          {targetAudience ? (
            <p className="text-sm leading-normal text-muted">
              <strong className="font-semibold text-text">مخاطبان هدف: </strong>
              {targetAudience}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
