import { Task } from "../types/task";

export const uid = () => Math.random().toString(36).slice(2, 10);

export const saveTasks = (tasks: Task[]) =>
  localStorage.setItem("thermal_tasks", JSON.stringify(tasks));

export const loadTasks = (): Task[] => {
  try {
    const s = localStorage.getItem("thermal_tasks");
    if (!s) return [];
    const parsed: Task[] = JSON.parse(s);
    return parsed;
  } catch {
    return [];
  }
};

export const classNames = (...xs: (string | false | undefined)[]) =>
  xs.filter(Boolean).join(" ");
