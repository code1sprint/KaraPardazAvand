"use client";

import React from "react";

interface TicketStatsCardsProps {
  counts: {
    all: number;
    OPEN: number;
    IN_PROGRESS: number;
    ANSWERED: number;
    RESOLVED: number;
    CLOSED: number;
  };
  activeStatus: string;
  onSelectStatus: (status: string) => void;
}

export function TicketStatsCards({
  counts,
  activeStatus,
  onSelectStatus,
}: TicketStatsCardsProps) {
  const cards = [
    {
      id: "all",
      label: "همه تیکت‌ها",
      count: counts.all,
      color: "border-line text-text",
      badgeColor: "bg-muted/10 text-text",
    },
    {
      id: "OPEN",
      label: "در انتظار پاسخ پشتیبانی",
      count: counts.OPEN,
      color: "border-orange/30 text-orange",
      badgeColor: "bg-orange/10 text-orange",
      highlight: true,
    },
    {
      id: "IN_PROGRESS",
      label: "در حال بررسی و اقدام",
      count: counts.IN_PROGRESS,
      color: "border-blue/30 text-blue",
      badgeColor: "bg-blue/10 text-blue",
    },
    {
      id: "ANSWERED",
      label: "پاسخ داده شده",
      count: counts.ANSWERED,
      color: "border-sky/30 text-sky",
      badgeColor: "bg-sky/10 text-sky",
    },
    {
      id: "RESOLVED",
      label: "حل شده و پایان یافته",
      count: counts.RESOLVED + counts.CLOSED,
      color: "border-ok/30 text-ok",
      badgeColor: "bg-ok/10 text-ok",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map((c) => {
        const isActive = activeStatus === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectStatus(c.id)}
            className={`flex flex-col justify-between rounded-xl border p-4 text-start transition-all ${
              isActive
                ? "border-blue bg-blue/5 shadow-xs ring-1 ring-blue"
                : "border-line bg-panel hover:border-muted/40 hover:bg-bg/50"
            }`}
          >
            <span className="text-xs font-medium text-muted">{c.label}</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-mono text-2xl font-bold tracking-tight text-text">
                {c.count}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${c.badgeColor}`}
              >
                {c.highlight && c.count > 0 ? "نیاز به اقدام" : "تیکت"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
