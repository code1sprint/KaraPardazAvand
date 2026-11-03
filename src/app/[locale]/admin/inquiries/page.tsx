"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  stage: string;
  message: string;
  createdAt: string;
  status: "new" | "reviewed" | "contacted";
}

// Initial demonstration data (with TODO_REAL_DATA comment for production DB hookup)
const DEMO_INQUIRIES: Inquiry[] = [
  {
    id: "inq-101",
    name: "شرکت صنایع دارویی افق",
    email: "cto@ofoghdarou.ir",
    phone: "09121234567",
    service: "ERP و سامانه جامع سازمانی",
    stage: "نیازسنجی و امکان‌سنجی اولیه",
    message:
      "نیازمند پیاده‌سازی سیستم مدیریت زنجیره تامین و انبارداری با اتصال به خط تولید هستیم.",
    createdAt: "امروز، ۱۰:۴۲",
    status: "new",
  },
  {
    id: "inq-102",
    name: "هلدینگ سرمایه‌گذاری تابان",
    email: "info@taban-holding.com",
    phone: "02188776655",
    service: "هوش مصنوعی سازمانی و RAG",
    stage: "برآورد هزینه و پیشنهاد فنی (RFP)",
    message:
      "قصد داریم پایگاه دانش فنی و مستندات قراردادها را با یک مدل زبان بزرگ داخلی و امن جستجوپذیر کنیم.",
    createdAt: "دیروز، ۱۶:۱۵",
    status: "reviewed",
  },
];

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(DEMO_INQUIRIES);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const toggleStatus = (id: string) => {
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "new" ? "reviewed" : "contacted",
            }
          : item,
      ),
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-text sm:text-2xl">
            پیام‌های تماس و درخواست‌های همکاری
          </h1>
          <p className="mt-1 text-sm text-muted">
            درخواست‌های ارسالی از فرم تماس وب‌سایت، تفکیک‌شده بر اساس حوزه خدمت و
            مرحله پروژه.
          </p>
        </div>
        <Link
          href="/contact"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-2xl border border-line bg-panel px-4 py-2.5 text-xs font-bold text-text transition hover:border-blue"
        >
          <span>مشاهده فرم تماس در سایت</span>
          <svg
            className="h-3.5 w-3.5 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </Link>
      </div>

      {/* Main List */}
      <div className="rounded-3xl border border-line bg-panel overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-line bg-bg/50 text-xs font-bold text-muted">
              <tr>
                <th className="px-6 py-4 text-start">فرستنده / سازمان</th>
                <th className="px-6 py-4 text-start">خدمت درخواستی</th>
                <th className="px-6 py-4 text-start">مرحله پروژه</th>
                <th className="px-6 py-4 text-start">تاریخ</th>
                <th className="px-6 py-4 text-start">وضعیت</th>
                <th className="px-6 py-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {inquiries.map((inq) => (
                <tr
                  key={inq.id}
                  className="transition hover:bg-bg/40 cursor-pointer"
                  onClick={() => setSelectedInquiry(inq)}
                >
                  <td className="px-6 py-4">
                    <span className="block font-bold text-text">{inq.name}</span>
                    <span className="block text-xs text-muted" dir="ltr">
                      {inq.email} | {inq.phone}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-text">
                    {inq.service}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted">
                    {inq.stage}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-muted">
                    {inq.createdAt}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        inq.status === "new"
                          ? "bg-orange/15 text-orange"
                          : inq.status === "reviewed"
                            ? "bg-blue/15 text-blue"
                            : "bg-ok/15 text-ok"
                      }`}
                    >
                      {inq.status === "new"
                        ? "پیام جدید"
                        : inq.status === "reviewed"
                          ? "بررسی شده"
                          : "پاسخ داده شده"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(inq.id);
                      }}
                      className="rounded-xl border border-line px-3 py-1.5 text-xs font-bold text-text transition hover:border-blue hover:text-blue"
                    >
                      تغییر وضعیت
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-lg rounded-3xl border border-line bg-panel p-6 shadow-2xl sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-text">
                جزئیات پیام {selectedInquiry.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="rounded-full p-2 text-muted hover:text-text"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="rounded-2xl border border-line bg-bg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted">پست الکترونیک:</span>
                  <span className="font-mono text-xs text-text" dir="ltr">
                    {selectedInquiry.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted">شماره تماس:</span>
                  <span className="font-mono text-xs text-text" dir="ltr">
                    {selectedInquiry.phone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted">خدمت:</span>
                  <span className="text-xs font-bold text-text">
                    {selectedInquiry.service}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted">مرحله:</span>
                  <span className="text-xs font-bold text-text">
                    {selectedInquiry.stage}
                  </span>
                </div>
              </div>

              <div>
                <span className="mb-2 block text-xs font-bold text-muted">
                  متن پیام ارسالی:
                </span>
                <p className="rounded-2xl border border-line bg-bg p-4 text-xs leading-relaxed text-text">
                  {selectedInquiry.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="rounded-2xl bg-navy px-6 py-2.5 text-xs font-bold text-white transition hover:bg-navy-2"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
