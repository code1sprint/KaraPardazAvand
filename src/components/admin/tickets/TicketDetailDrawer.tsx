"use client";

import React, { useEffect, useRef } from "react";
import { TicketItem } from "./TicketTable";
import { TicketReplyComposer } from "./TicketReplyComposer";

interface TicketDetailDrawerProps {
  ticket: TicketItem | null;
  onClose: () => void;
  onTicketUpdated: (updatedTicket: TicketItem) => void;
}

export function TicketDetailDrawer({
  ticket,
  onClose,
  onTicketUpdated,
}: TicketDetailDrawerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  if (!ticket) return null;

  const formatPersianDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const getStatusLabel = (status: TicketItem["status"]) => {
    switch (status) {
      case "OPEN":
        return "در انتظار پاسخ پشتیبانی";
      case "IN_PROGRESS":
        return "در حال بررسی و اقدام";
      case "ANSWERED":
        return "پاسخ داده شد";
      case "RESOLVED":
        return "حل شده";
      case "CLOSED":
        return "بسته شده";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/40 backdrop-blur-xs transition-opacity">
      <div className="flex h-full w-full max-w-2xl flex-col border-s border-line bg-panel shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-text">
                {ticket.ticketNumber}
              </span>
              <span className="rounded-md bg-navy/10 px-2 py-0.5 text-[11px] font-semibold text-navy">
                {ticket.projectId === "amlak" ? "سامانه املاک" : ticket.projectId}
              </span>
              <span className="rounded-full bg-blue/10 px-2 py-0.5 text-[11px] font-bold text-blue">
                {getStatusLabel(ticket.status)}
              </span>
            </div>
            <h2 className="text-sm font-bold text-text">{ticket.subject}</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-bg text-muted transition-colors hover:text-text"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Requester Info Bar */}
        <div className="grid grid-cols-2 gap-3 border-b border-line bg-bg/50 p-3 text-xs sm:grid-cols-4">
          <div>
            <span className="text-[10px] text-muted">درخواست‌دهنده:</span>
            <p className="font-semibold text-text">{ticket.requester.name}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted">سازمان / شعبه:</span>
            <p className="font-medium text-text">{ticket.requester.organization || "—"}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted">شماره تماس:</span>
            <p className="font-mono text-text">{ticket.requester.phone || "—"}</p>
          </div>
          <div>
            <span className="text-[10px] text-muted">دپارتمان:</span>
            <p className="font-medium text-text">{ticket.department}</p>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {ticket.messages.map((msg, idx) => {
            const isAgent = msg.senderRole === "SUPPORT_AGENT";
            return (
              <div
                key={msg._id || idx}
                className={`flex flex-col gap-1 max-w-[85%] ${
                  isAgent ? "ms-auto items-end" : "me-auto items-start"
                }`}
              >
                <div className="flex items-center gap-2 text-[11px] text-muted">
                  <span className="font-bold text-text">{msg.senderName}</span>
                  <span>·</span>
                  <span className="font-mono">{formatPersianDateTime(msg.createdAt)}</span>
                </div>

                <div
                  className={`rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                    isAgent
                      ? "rounded-be-xs bg-blue text-white"
                      : "rounded-bs-xs border border-line bg-bg text-text"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Composer */}
        <TicketReplyComposer
          ticketId={ticket._id}
          onReplySuccess={(updatedTicket) => onTicketUpdated(updatedTicket)}
        />
      </div>
    </div>
  );
}
