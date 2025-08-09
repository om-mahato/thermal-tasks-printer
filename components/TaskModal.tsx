import { Task, Priority, Status, priorities, statuses } from "../types/task";
import { classNames } from "../utils";

interface TaskModalProps {
  isOpen: boolean;
  task: Task;
  isEditing: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onPrint: (task: Task) => void;
  onChange: (task: Task) => void;
  canPrint: boolean;
  isPrinting: boolean;
}

export function TaskModal({
  isOpen,
  task,
  isEditing,
  onClose,
  onSave,
  onDelete,
  onPrint,
  onChange,
  canPrint,
  isPrinting,
}: TaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 bg-black/40 grid place-items-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-semibold">
            {isEditing ? "Edit Task" : "New Task"}
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-sm">
            Title
            <input
              value={task.title}
              onChange={(e) => onChange({ ...task, title: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </label>
          <label className="text-sm">
            Assignee
            <input
              value={task.assignee || ""}
              onChange={(e) => onChange({ ...task, assignee: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </label>
          <label className="text-sm">
            Priority
            <select
              value={task.priority}
              onChange={(e) =>
                onChange({ ...task, priority: e.target.value as Priority })
              }
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Status
            <select
              value={task.status}
              onChange={(e) =>
                onChange({ ...task, status: e.target.value as Status })
              }
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            Due date
            <input
              type="date"
              value={task.due || ""}
              onChange={(e) => onChange({ ...task, due: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Tags (comma separated)
            <input
              value={task.tags.join(", ")}
              onChange={(e) =>
                onChange({
                  ...task,
                  tags: e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                })
              }
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </label>
          <label className="text-sm md:col-span-2">
            Description
            <textarea
              rows={5}
              value={task.description}
              onChange={(e) =>
                onChange({ ...task, description: e.target.value })
              }
              className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center gap-2 justify-end">
          {isEditing && (
            <button
              onClick={onDelete}
              className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
          >
            Save
          </button>
          <button
            onClick={() => onPrint(task)}
            disabled={!canPrint || isPrinting}
            className={classNames(
              "px-4 py-2 rounded-xl",
              !canPrint
                ? "bg-slate-100 text-slate-400"
                : "bg-slate-900 text-white hover:opacity-90"
            )}
          >
            {isPrinting ? "Printing…" : "Print"}
          </button>
        </div>
      </div>
    </div>
  );
}
