import { Task, Status } from "../types/task";
import { classNames } from "../utils";
import { PriorityPill, StatusPill } from "./Pills";
import { Badge } from "./Badge";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onPrint: (task: Task) => void;
  onDelete: (id: string) => void;
  canPrint: boolean;
  isPrinting: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onPrint,
  onDelete,
  canPrint,
  isPrinting,
}: TaskCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow transition">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium text-slate-800">{task.title}</div>
          <div className="mt-1 flex flex-wrap gap-2">
            <PriorityPill priority={task.priority} />
            <StatusPill status={task.status} />
            {task.due && (
              <Badge
                text={new Date(task.due).toLocaleDateString()}
                tone="amber"
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="px-2 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            Edit
          </button>
          <button
            onClick={() => onPrint(task)}
            disabled={!canPrint || isPrinting}
            className={classNames(
              "px-2 py-1 text-xs rounded-lg",
              !canPrint
                ? "bg-slate-100 text-slate-400"
                : "bg-black text-white hover:opacity-90"
            )}
          >
            {isPrinting ? "Printing…" : "Print"}
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-2 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
          >
            Del
          </button>
        </div>
      </div>
      {task.assignee && (
        <div className="mt-2 text-xs text-slate-600">
          Assignee: <span className="font-medium">{task.assignee}</span>
        </div>
      )}
      {task.tags?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
