import { Priority, Status } from "../types/task";
import { Badge } from "./Badge";

interface PriorityPillProps {
  priority: Priority;
}

export function PriorityPill({ priority }: PriorityPillProps) {
  const tones: Record<Priority, "green" | "blue" | "amber" | "red"> = {
    Low: "green",
    Medium: "blue",
    High: "amber",
    Urgent: "red",
  };
  return <Badge text={priority} tone={tones[priority]} />;
}

interface StatusPillProps {
  status: Status;
}

export function StatusPill({ status }: StatusPillProps) {
  return <Badge text={status} tone="slate" />;
}
