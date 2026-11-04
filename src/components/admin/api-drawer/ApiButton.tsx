"use client";

import { cn } from "@/lib/cn";

interface ApiButtonProps {
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "header";
  label?: string;
}

export function ApiButton({
  onClick,
  className,
  variant = "header",
  label = "مدیریت API",
}: ApiButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      window.dispatchEvent(new CustomEvent("open-api-drawer"));
    }
  };

  if (variant === "header") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-navy/20 bg-navy/5 px-3 py-1.5 text-xs font-bold text-navy transition hover:bg-navy hover:text-white shadow-2xs group",
          className,
        )}
        title="مشاهده و مدیریت محتوا از طریق API (مشابه PayloadCMS)"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-navy text-white text-[10px] font-mono group-hover:bg-white group-hover:text-navy">
          &lt;/&gt;
        </span>
        <span>{label}</span>
      </button>
    );
  }

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          "inline-flex items-center gap-2 rounded-2xl bg-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-navy-2 shadow-xs",
          className,
        )}
      >
        <span className="font-mono text-xs">&lt;/&gt;</span>
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-line bg-panel px-3 py-1.5 text-xs font-bold text-text transition hover:border-blue hover:text-blue shadow-2xs",
        className,
      )}
    >
      <span className="font-mono text-[11px] text-muted">&lt;/&gt;</span>
      <span>{label}</span>
    </button>
  );
}
