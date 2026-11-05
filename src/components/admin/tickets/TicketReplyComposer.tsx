"use client";

import React, { useState } from "react";

interface TicketReplyComposerProps {
  ticketId: string;
  onReplySuccess: (updatedTicket: any) => void;
}

export function TicketReplyComposer({
  ticketId,
  onReplySuccess,
}: TicketReplyComposerProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"ANSWERED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED">("ANSWERED");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 2) {
      setError("لطفاً متن پاسخ را کامل وارد کنید (حداقل ۲ نویسه).");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/tickets/${ticketId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), status }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "خطا در ارسال پاسخ.");
      }

      setMessage("");
      onReplySuccess(data.ticket);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای نامشخص در ثبت پاسخ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-line bg-panel p-4">
      <div className="flex items-center justify-between pb-2">
        <label htmlFor="reply-message" className="text-xs font-bold text-text">
          ارسال پاسخ رسمی پشتیبانی:
        </label>
        <div className="flex items-center gap-2">
          <label htmlFor="reply-status-change" className="text-[11px] text-muted">
            وضعیت پس از ارسال:
          </label>
          <select
            id="reply-status-change"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-md border border-line bg-bg px-2 py-1 text-xs text-text focus:border-blue focus:outline-hidden"
          >
            <option value="ANSWERED">پاسخ داده شد (منتظر کاربر)</option>
            <option value="IN_PROGRESS">در حال بررسی و پیگیری</option>
            <option value="RESOLVED">حل شده</option>
            <option value="CLOSED">بستن نهایی تیکت</option>
          </select>
        </div>
      </div>

      <textarea
        id="reply-message"
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="متن پاسخ و راهنمایی برای مشاور / مشتری..."
        className="w-full rounded-lg border border-line bg-bg p-3 text-xs leading-relaxed text-text placeholder:text-muted/60 focus:border-blue focus:outline-hidden focus:ring-1 focus:ring-blue"
      />

      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className="flex items-center gap-2 rounded-lg bg-blue px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-navy disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>در حال ارسال...</span>
            </>
          ) : (
            <span>ارسال پاسخ و بروزرسانی وضعیت</span>
          )}
        </button>
      </div>
    </form>
  );
}
