"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TicketStatsCards } from "@/components/admin/tickets/TicketStatsCards";
import { ProjectFilterBar, ProjectInfo } from "@/components/admin/tickets/ProjectFilterBar";
import { TicketTable, TicketItem } from "@/components/admin/tickets/TicketTable";
import { TicketDetailDrawer } from "@/components/admin/tickets/TicketDetailDrawer";

export function AdminTicketsClient() {
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [projects, setProjects] = useState<ProjectInfo[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    OPEN: 0,
    IN_PROGRESS: 0,
    ANSWERED: 0,
    RESOLVED: 0,
    CLOSED: 0,
  });

  const [selectedProject, setSelectedProject] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Projects
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/admin/tickets/projects");
        if (res.ok) {
          const data = await res.json();
          if (data.projects) {
            setProjects(data.projects);
          }
        }
      } catch (err) {
        console.error("Failed to load projects", err);
      }
    }
    loadProjects();
  }, []);

  // Load Tickets
  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedProject !== "all") params.set("projectId", selectedProject);
      if (activeStatus !== "all") params.set("status", activeStatus);
      if (selectedPriority !== "all") params.set("priority", selectedPriority);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const res = await fetch(`/api/admin/tickets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProject, activeStatus, selectedPriority, searchQuery]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleTicketUpdated = (updatedTicket: TicketItem) => {
    setSelectedTicket(updatedTicket);
    setTickets((prev) =>
      prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t)),
    );
    fetchTickets();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text sm:text-2xl">
            مرکز پشتیبانی و تیکت‌ها
          </h1>
          <p className="mt-1 text-xs text-muted">
            مدیریت متمرکز درخواست‌های پشتیبانی سامانه‌های املاک، کلینیک و پروژه‌های سازمانی کاراپرداز
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchTickets()}
          className="flex items-center gap-1.5 self-start rounded-lg border border-line bg-panel px-3 py-1.5 text-xs font-medium text-text shadow-2xs hover:bg-bg sm:self-auto"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>بروزرسانی داده‌ها</span>
        </button>
      </div>

      {/* Metric Cards */}
      <TicketStatsCards
        counts={counts}
        activeStatus={activeStatus}
        onSelectStatus={(status) => setActiveStatus(status)}
      />

      {/* Project & Search Filters */}
      <ProjectFilterBar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(pid) => setSelectedProject(pid)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        selectedPriority={selectedPriority}
        onSelectPriority={(p) => setSelectedPriority(p)}
      />

      {/* Ticket Table */}
      <TicketTable
        tickets={tickets}
        isLoading={isLoading}
        onSelectTicket={(ticket) => setSelectedTicket(ticket)}
      />

      {/* Ticket Conversation Detail Drawer */}
      <TicketDetailDrawer
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onTicketUpdated={handleTicketUpdated}
      />
    </div>
  );
}
