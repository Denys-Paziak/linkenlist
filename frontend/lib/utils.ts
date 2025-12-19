import { clsx, type ClassValue } from "clsx";
import { FieldValues } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pickDirty<T extends FieldValues>(
  values: T,
  dirty: Record<string, any>
): Partial<T> {
  const out: Record<string, any> = {};
  Object.keys(dirty).forEach((key) => {
    if (dirty[key] === true) {
      out[key] = values[key];
    } else if (typeof dirty[key] === "object" && dirty[key] != null) {
      const nested = pickDirty(values[key] ?? {}, dirty[key]);
      if (Object.keys(nested).length) out[key] = nested;
    }
  });
  return out as Partial<T>;
}

export function formatSmartSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    if (Math.floor(mb) >= 1) {
      return `${Math.floor(mb)} MB`;
    }
  }

  if (bytes >= 1024) {
    const kb = bytes / 1024;
    if (Math.floor(kb) >= 1) {
      return `${Math.floor(kb)} KB`;
    }
  }

  return `${bytes} B`;
}

export function isoToDatetimeLocal(
  iso?: string | null,
  inTime: boolean = true
): string {
  if (!iso) return "";

  const date = new Date(iso);

  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  // формат для input[type="datetime-local"]
  return `${year}-${month}-${day} ${inTime ? `${hours}:${minutes}` : ""}`;
}

export const capitalize = (str: string) =>
  (str ?? "").length === 0 ? "" : str[0].toUpperCase() + str.slice(1);

export function getFileTypeLabel(ext: string): string {
  const normalized = ext.replace(".", "").toLowerCase();

  const map: Record<string, string> = {
    pdf: "PDF Document",
    doc: "Word Document",
    docx: "Word Document",
    xls: "Excel Spreadsheet",
    xlsx: "Excel Spreadsheet",
    png: "PNG Image",
    jpg: "JPEG Image",
    jpeg: "JPEG Image",
  };

  return map[normalized] ?? "Unknown File";
}

type TimeUnit = {
  name: string
  seconds: number
}

const TIME_UNITS: TimeUnit[] = [
  { name: "year", seconds: 60 * 60 * 24 * 365 },
  { name: "month", seconds: 60 * 60 * 24 * 30 },
  { name: "day", seconds: 60 * 60 * 24 },
  { name: "hour", seconds: 60 * 60 },
  { name: "minute", seconds: 60 },
  { name: "second", seconds: 1 }
]

export function timeAgo(
  input: Date | string | number,
  now: Date = new Date()
): string {
  const date = new Date(input)
  const diffInSeconds = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  )

  if (diffInSeconds < 0) {
    return "just now"
  }

  for (const unit of TIME_UNITS) {
    const value = Math.floor(diffInSeconds / unit.seconds)

    if (value >= 1) {
      return `${value} ${unit.name}${value > 1 ? "s" : ""} ago`
    }
  }

  return "just now"
}