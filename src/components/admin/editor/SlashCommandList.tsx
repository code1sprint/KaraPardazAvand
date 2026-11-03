"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { CommandItem } from "./slash-command";
import { cn } from "@/lib/cn";

export interface SlashCommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface SlashCommandListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

export const SlashCommandList = forwardRef<SlashCommandListRef, SlashCommandListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = items[index];
      if (item) {
        command(item);
      }
    };

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
          return true;
        }

        if (event.key === "ArrowDown") {
          setSelectedIndex((prev) => (prev + 1) % items.length);
          return true;
        }

        if (event.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }

        return false;
      },
    }));

    if (items.length === 0) return null;

    return (
      <div className="z-50 w-72 max-h-80 overflow-y-auto rounded-2xl border border-line bg-panel p-1.5 shadow-xl font-vazirmatn text-text animate-in fade-in zoom-in-95">
        <div className="px-2.5 py-1 text-[11px] font-bold text-muted border-b border-line mb-1">
          دستورات سریع (Slash Commands)
        </div>
        <div className="space-y-0.5">
          {items.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => selectItem(index)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-start text-xs font-semibold transition-colors",
                index === selectedIndex
                  ? "bg-blue/15 text-blue font-bold"
                  : "text-text hover:bg-bg/60",
              )}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-line bg-bg text-xs font-mono font-bold text-muted">
                {item.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-text truncate">{item.title}</div>
                <div className="text-[10px] text-muted truncate">{item.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  },
);

SlashCommandList.displayName = "SlashCommandList";
