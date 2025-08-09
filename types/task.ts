export const priorities = ["Low", "Medium", "High", "Urgent"] as const;
export const statuses = ["Backlog", "To Do", "In Progress", "Done"] as const;

export type Priority = (typeof priorities)[number];
export type Status = (typeof statuses)[number];

export type Task = {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  tags: string[];
  priority: Priority;
  status: Status;
  due?: string; // ISO date
  createdAt: string; // ISO
  updatedAt: string; // ISO
};
