import { cn } from "../../lib/utils";

export type TStatus = "draft" | "scheduled" | "published" | "expired" | "archived"

export function StatusChip({
  text,
  status,
  className
}: {
  text: string;
  status: TStatus;
  className?: string
}) {
  const statusColors: Record<TStatus, string> = {
    draft: "bg-gray-100 text-gray-800",
    scheduled: "bg-yellow-100 text-yellow-800",
    published: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
    archived: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={cn(
        "text-xs px-2 py-1 rounded-full",
        statusColors[status],
        className
      )}
    >
      {text}
    </span>
  );
}
