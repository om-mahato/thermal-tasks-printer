import { Task, Status } from "../types/task";
import { TaskCard } from "./TaskCard";

interface BoardColumnProps {
  status: Status;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onPrintTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  canPrint: boolean;
  isPrinting: boolean;
}

export function BoardColumn({
  status,
  tasks,
  onEditTask,
  onPrintTask,
  onDeleteTask,
  canPrint,
  isPrinting,
}: BoardColumnProps) {
  return (
    <div className="flex-1 min-w-[260px] bg-white/50 rounded-2xl border border-slate-200 p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-slate-700">{status}</h3>
        <span className="text-xs text-slate-500">{tasks.length}</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onPrint={onPrintTask}
            onDelete={onDeleteTask}
            canPrint={canPrint}
            isPrinting={isPrinting}
          />
        ))}
      </div>
    </div>
  );
}
