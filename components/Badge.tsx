import { classNames } from "../utils";

interface BadgeProps {
  text: string;
  tone?: "red" | "amber" | "green" | "blue" | "slate";
}

export function Badge({ text, tone = "slate" }: BadgeProps) {
  return (
    <span
      className={classNames(
        "px-2 py-0.5 rounded-full text-xs font-medium",
        tone === "red" && "bg-red-100 text-red-700",
        tone === "amber" && "bg-amber-100 text-amber-700",
        tone === "green" && "bg-green-100 text-green-700",
        tone === "blue" && "bg-blue-100 text-blue-700",
        tone === "slate" && "bg-slate-100 text-slate-700"
      )}
    >
      {text}
    </span>
  );
}
