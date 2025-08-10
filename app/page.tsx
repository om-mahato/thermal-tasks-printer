"use client";

import React, { useState, useMemo } from "react";
import { statuses } from "../types/task";
import { uid } from "../utils";
import { useTasks } from "../hooks/useTasks";
import { usePrinter } from "../hooks/usePrinter";
import { AppHeader } from "../components/AppHeader";
import { SearchAndFilters } from "../components/SearchAndFilters";
import { BoardColumn } from "../components/BoardColumn";
import { TaskModal } from "../components/TaskModal";
import { AppFooter } from "../components/AppFooter";
import type { Task } from "../types/task";

export default function HomePage() {
  const {
    filtered,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    deleteTask,
    saveOrUpdateTask,
  } = useTasks();

  const {
    port,
    baud,
    setBaud,
    copies,
    setCopies,
    busy,
    connectPrinter,
    disconnectPrinter,
    printTask,
    isWebSerialSupported,
  } = usePrinter();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  // Create empty task template
  const emptyTask: Task = {
    id: uid(),
    title: "",
    description: "",
    assignee: "Om",
    tags: [],
    priority: "Medium",
    status: "To Do",
    due: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [draft, setDraft] = useState<Task>(emptyTask);

  const openNew = () => {
    setDraft({
      ...emptyTask,
      id: uid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setDraft({ ...task });
    setEditing(task);
    setModalOpen(true);
  };

  const handleSave = () => {
    const success = saveOrUpdateTask(draft, !!editing);
    if (success) {
      setModalOpen(false);
    }
  };

  const handleDelete = () => {
    deleteTask(draft.id);
    setModalOpen(false);
  };

  // Group filtered tasks by status
  const grouped = useMemo(() => {
    const m: Record<string, Task[]> = {
      Backlog: [],
      "To Do": [],
      "In Progress": [],
      Review: [],
      Done: [],
    };
    for (const task of filtered) {
      m[task.status].push(task);
    }
    return m;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900">
      <AppHeader
        baud={baud}
        setBaud={setBaud}
        copies={copies}
        setCopies={setCopies}
        port={port}
        connectPrinter={connectPrinter}
        disconnectPrinter={disconnectPrinter}
        isWebSerialSupported={isWebSerialSupported}
      />

      <SearchAndFilters
        search={search}
        setSearch={setSearch}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        onNewTask={openNew}
      />

      <main className="max-w-7xl mx-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {statuses.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              tasks={grouped[status] || []}
              onEditTask={openEdit}
              onPrintTask={printTask}
              onDeleteTask={deleteTask}
              canPrint={!!port}
              isPrinting={busy}
            />
          ))}
        </div>
      </main>

      <TaskModal
        isOpen={modalOpen}
        task={draft}
        isEditing={!!editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        onPrint={printTask}
        onChange={setDraft}
        canPrint={!!port}
        isPrinting={busy}
      />

      <AppFooter isConnected={!!port} />
    </div>
  );
}
