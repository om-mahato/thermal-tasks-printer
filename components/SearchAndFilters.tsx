import { Status, Priority, statuses, priorities } from "../types/task";

interface SearchAndFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  filterStatus: Status | "All";
  setFilterStatus: (status: Status | "All") => void;
  filterPriority: Priority | "All";
  setFilterPriority: (priority: Priority | "All") => void;
  onNewTask: () => void;
}

export function SearchAndFilters({
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  onNewTask,
}: SearchAndFiltersProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 pb-2 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 bg-white rounded-2xl border border-slate-200 px-3 py-2 w-full md:w-80">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks, tags, assignee…"
          className="w-full outline-none text-sm placeholder:text-slate-400"
        />
      </div>
      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value as Status | "All")}
        className="px-3 py-2 text-sm rounded-2xl border border-slate-200 bg-white"
      >
        {(["All" as const, ...statuses] as const).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select
        value={filterPriority}
        onChange={(e) => setFilterPriority(e.target.value as Priority | "All")}
        className="px-3 py-2 text-sm rounded-2xl border border-slate-200 bg-white"
      >
        {(["All" as const, ...priorities] as const).map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button
        onClick={onNewTask}
        className="ml-auto rounded-2xl bg-black text-white px-4 py-2 text-sm hover:opacity-90"
      >
        New Task
      </button>
    </div>
  );
}
