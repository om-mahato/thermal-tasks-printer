import { useState, useEffect, useMemo } from "react";
import { Task, Status, Priority } from "../types/task";
import { loadTasks, saveTasks, uid } from "../utils";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");
  const [filterPriority, setFilterPriority] = useState<Priority | "All">("All");

  // Load tasks on client side only
  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filterStatus !== "All" && t.status !== filterStatus) return false;
      if (filterPriority !== "All" && t.priority !== filterPriority)
        return false;
      if (!q) return true;
      const hay = [t.title, t.description, t.assignee, t.tags.join(","), t.id]
        .join("\n")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [tasks, search, filterStatus, filterPriority]);

  const createTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: uid(),
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (updatedTask: Task) => {
    const now = new Date().toISOString();
    updatedTask.updatedAt = now;
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (id: string) => {
    if (!confirm("Delete this task?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const saveOrUpdateTask = (task: Task, isEditing: boolean) => {
    if (!task.title.trim()) {
      alert("Please enter a title");
      return false;
    }

    if (isEditing) {
      updateTask(task);
    } else {
      const { id, createdAt, updatedAt, ...taskData } = task;
      createTask(taskData);
    }
    return true;
  };

  return {
    tasks,
    filtered,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    createTask,
    updateTask,
    deleteTask,
    saveOrUpdateTask,
  };
}
