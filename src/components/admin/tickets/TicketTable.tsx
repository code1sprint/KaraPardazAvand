"use client";

import React from "react";

export interface TicketItem {
  _id: string;
  ticketNumber: string;
  projectId: string;
  requester: {
    userId: string;
    name: string;
    phone?: string;
    email?: string;
    organization?: string;
  };
  department: string;
  subject: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "ANSWERED" | "RESOLVED" | "CLOSED";
  messages: Array<{
    _id?: string;
    senderRole: "CLIENT_USER" | "SUPPORT_AGENT";
    senderId: string;
    senderName: string;
    message: string;
    createdAt: string;
  }>;
  lastMessageAt: string;
  createdAt: string;
}

interface TicketTableProps {
  tickets: TicketItem[];
  isLoading: boolean;
  onSelectTicket: (ticket: TicketItem) => void;
}

export function TicketTable({
  tickets,
  isLoading,
  onSelectTicket,
}: TicketTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-line bg-panel">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue border-t-transparent" />
          <p className="text-xs text-muted">در حال بارگذاری تیکت‌ها...</p>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-panel p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/10 text-muted">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="mt-3 text-sm font-bold text-text">هیچ تیکتی با این فیلترها یافت نشد</h3>
        <p className="mt-1 text-xs text-muted">
          فیلترهای پروژه، وضعیت یا عبارت جستجو را تغییر دهید.
        </p>
      </div>
    );
  }

  const getPriorityBadge = (priority: TicketItem["priority"]) => {
    switch (priority) {
      case "URGENT":
        return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
      case "HIGH":
        return "bg-orange/10 text-orange border border-orange/20";
      case "MEDIUM":
        return "bg-blue/10 text-blue border border-blue/20";
      default:
        return "bg-muted/10 text-muted border border-line";
    }
  };

  const getStatusBadge = (status: TicketItem["status"]) => {
    switch (status) {
      case "OPEN":
        return "bg-orange text-white";
      case "IN_PROGRESS":
        return "bg-blue text-white";
      case "ANSWERED":
        return "bg-sky text-white";
      case "RESOLVED":
        return "bg-ok text-white";
      case "CLOSED":
        return "bg-muted/30 text-muted";
    }
  };

  const getStatusLabel = (status: TicketItem["status"]) => {
    switch (status) {
      case "OPEN":
        return "در انتظار پاسخ";
      case "IN_PROGRESS":
        return "در دست اقدام";
      case "ANSWERED":
        return "پاسخ داده شد";
      case "RESOLVED":
        return "حل شده";
      case "CLOSED":
        return "بسته شده";
    }
  };

  const formatPersianTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat("fa-IR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(d);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-panel shadow-xs">
      <table className="w-full text-start text-xs">
        <thead className="border-b border-line bg-bg/80 text-muted">
          <tr>
            <th className="px-4 py-3 text-start font-semibold">شناسه و پروژه</th>
            <th className="px-4 py-3 text-start font-semibold">درخواست‌دهنده</th>
            <th className="px-4 py-3 text-start font-semibold">موضوع</th>
            <th className="px-4 py-3 text-start font-semibold">اولویت</th>
            <th className="px-4 py-3 text-start font-semibold">وضعیت</th>
            <th className="px-4 py-3 text-start font-semibold">آخرین پیام</th>
            <th className="px-4 py-3 text-start font-semibold">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {tickets.map((t) => (
            <tr
              key={t._id}
              onClick={() => onSelectTicket(t)}
              className="cursor-pointer transition-colors hover:bg-bg/60"
            >
              {/* Ticket ID & Project */}
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs font-bold text-text">
                    {t.ticketNumber}
                  </span>
                  <span className="w-max rounded-md bg-navy/10 px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                    {t.projectId === "amlak"
                      ? "سامانه املاک"
                      : t.projectId === "clinic"
                        ? "سامانه کلینیک"
                        : t.projectId}
                  </span>
                </div>
              </td>

              {/* Requester */}
              <td className="px-4 py-3">
                <div className="flex flex-col">
                  <span className="font-semibold text-text">{t.requester.name}</span>
                  {t.requester.organization && (
                    <span className="text-[11px] text-muted">
                      {t.requester.organization}
                    </span>
                  )}
                  {t.requester.phone && (
                    <span className="font-mono text-[10px] text-muted/80">
                      {t.requester.phone}
                    </span>
                  )}
                </div>
              </td>

              {/* Subject */}
              <td className="max-w-xs px-4 py-3">
                <p className="truncate font-medium text-text">{t.subject}</p>
                <span className="text-[10px] text-muted">دپارتمان: {t.department}</span>
              </td>

              {/* Priority */}
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${getPriorityBadge(
                    t.priority,
                  )}`}
                >
                  {t.priority === "URGENT"
                    ? "فوری"
                    : t.priority === "HIGH"
                      ? "بالا"
                      : t.priority === "MEDIUM"
                        ? "متوسط"
                        : "عادی"}
                </span>
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-2xs ${getStatusBadge(
                    t.status,
                  )}`}
                >
                  {getStatusLabel(t.status)}
                </span>
              </td>

              {/* Last Message At */}
              <td className="px-4 py-3 font-mono text-[11px] text-muted">
                {formatPersianTime(t.lastMessageAt || t.createdAt)}
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTicket(t);
                  }}
                  className="rounded-lg border border-line bg-bg px-2.5 py-1 text-xs font-medium text-text transition-all hover:border-blue hover:bg-blue hover:text-white"
                >
                  مشاهده و پاسخ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
