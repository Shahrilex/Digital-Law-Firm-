import { cn } from "@/lib/utils";
import { deadlineTypeLabel, statusLabel } from "@/lib/seed";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "active" && "bg-ok/10 text-ok",
        status === "closed" && "bg-line text-muted",
        status === "draft" && "bg-warn/15 text-warn",
      )}
    >
      {statusLabel[status] ?? status}
    </span>
  );
}

export function DeadlineBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex rounded-full bg-paper px-2 py-0.5 text-xs text-muted">
      {deadlineTypeLabel[type] ?? type}
    </span>
  );
}
