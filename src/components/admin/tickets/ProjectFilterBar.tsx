"use client";

import React from "react";

export interface ProjectInfo {
  projectId: string;
  name: string;
  departments: Array<{ id: string; nameFa: string }>;
  stats?: { total: number; open: number };
}

interface ProjectFilterBarProps {
  projects: ProjectInfo[];
  selectedProject: string;
  onSelectProject: (projectId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedPriority: string;
  onSelectPriority: (p: string) => void;
  onOpenNewProjectModal?: () => void;
}

export function ProjectFilterBar({
  projects,
  selectedProject,
  onSelectProject,
  searchQuery,
  onSearchChange,
  selectedPriority,
  onSelectPriority,
  onOpenNewProjectModal,
}: ProjectFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-line bg-panel p-4 shadow-xs">
      {/* Project Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
        <span className="me-2 text-xs font-bold text-muted">تفکیک پروژه:</span>
        <button
          type="button"
          onClick={() => onSelectProject("all")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            selectedProject === "all"
              ? "bg-navy text-white shadow-xs"
              : "bg-bg text-muted hover:bg-line/40 hover:text-text"
          }`}
        >
          <span>همه سامانه‌ها</span>
        </button>

        {projects.map((p) => {
          const isSelected = selectedProject === p.projectId;
          const openCount = p.stats?.open ?? 0;
          return (
            <button
              key={p.projectId}
              type="button"
              onClick={() => onSelectProject(p.projectId)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? "bg-blue text-white shadow-xs"
                  : "bg-bg text-muted hover:bg-line/40 hover:text-text"
              }`}
            >
              <span>{p.name}</span>
              {openCount > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected ? "bg-white/20 text-white" : "bg-orange/20 text-orange"
                  }`}
                >
                  {openCount}
                </span>
              )}
            </button>
          );
        })}

        {onOpenNewProjectModal && (
          <button
            type="button"
            onClick={onOpenNewProjectModal}
            className="ms-auto flex items-center gap-1 rounded-lg border border-dashed border-blue/40 bg-blue/5 px-2.5 py-1.5 text-xs font-bold text-blue transition-colors hover:border-blue hover:bg-blue hover:text-white"
          >
            <span>+</span>
            <span>ثبت سامانه جدید</span>
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو بر اساس شماره تیکت، موضوع، نام مشاور یا شماره تماس..."
            className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-xs text-text placeholder:text-muted/60 focus:border-blue focus:outline-hidden focus:ring-1 focus:ring-blue"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-xs text-muted">
            اولویت:
          </label>
          <select
            id="priority-filter"
            value={selectedPriority}
            onChange={(e) => onSelectPriority(e.target.value)}
            className="rounded-lg border border-line bg-bg px-2.5 py-1.5 text-xs text-text focus:border-blue focus:outline-hidden"
          >
            <option value="all">همه اولویت‌ها</option>
            <option value="URGENT">فوری و بحرانی</option>
            <option value="HIGH">بالا</option>
            <option value="MEDIUM">متوسط</option>
            <option value="LOW">عادی</option>
          </select>
        </div>
      </div>
    </div>
  );
}
