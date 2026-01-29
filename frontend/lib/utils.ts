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
  name: string;
  seconds: number;
};

const TIME_UNITS: TimeUnit[] = [
  { name: "year", seconds: 60 * 60 * 24 * 365 },
  { name: "month", seconds: 60 * 60 * 24 * 30 },
  { name: "day", seconds: 60 * 60 * 24 },
  { name: "hour", seconds: 60 * 60 },
  { name: "minute", seconds: 60 },
  { name: "second", seconds: 1 },
];

export function timeAgo(
  input: Date | string | number,
  now: Date = new Date()
): string {
  const date = new Date(input);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return "just now";
  }

  for (const unit of TIME_UNITS) {
    const value = Math.floor(diffInSeconds / unit.seconds);

    if (value >= 1) {
      return `${value} ${unit.name}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

type DateInput = Date | string | number;

interface FormatDateDiffOptions {
  maxUnits?: number;
  includeDays?: boolean;
}

export function formatDateDiff(
  from: DateInput,
  to: DateInput = new Date(),
  options: FormatDateDiffOptions = {}
): string {
  const { maxUnits = 3, includeDays = true } = options;

  const start = new Date(from);
  const end = new Date(to);

  if (start > end) return "0 days";

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts: string[] = [];

  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (includeDays && days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);

  return parts.slice(0, maxUnits).join(" ") || "0 days";
}

export function formatDurationFromMonths(totalMonths: number): string {
  if (!Number.isInteger(totalMonths) || totalMonths < 0) {
    throw new Error("totalMonths must be a non-negative integer");
  }

  if (totalMonths === 0) {
    return "0 months";
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "year" : "years"}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "month" : "months"}`);
  }

  return parts.join(" ");
}

export function daysUntil(targetDate: Date | string): number {
  const today = new Date()
  const target = new Date(targetDate)

  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)

  const diffMs = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

export function formatCompactNumber(num: number): string {
  const sign = num < 0 ? "-" : "";
  let n = Math.abs(num);

  if (!Number.isFinite(n)) return `${num}`;

  const units: Array<{ v: number; s: string }> = [
    { v: 1_000_000_000, s: "B" },
    { v: 1_000_000, s: "M" },
    { v: 1_000, s: "K" },
  ];

  const trimZeros = (str: string) => str.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");

  const pickDecimals = (value: number) => {
    if (value >= 100) return 0;
    if (value >= 10) return 1;
    return 2;
  };

  for (let i = 0; i < units.length; i++) {
    const { v, s } = units[i];
    if (n >= v) {
      let value = n / v;

      const decimals = pickDecimals(value);
      let out = Number(value.toFixed(decimals));

      if (out >= 1000 && i > 0) {
        const next = units[i - 1];
        value = n / next.v;
        const d2 = pickDecimals(value);
        out = Number(value.toFixed(d2));
        return sign + trimZeros(out.toFixed(d2)) + next.s;
      }

      return sign + trimZeros(out.toFixed(decimals)) + s;
    }
  }

  return sign + String(Math.round(n) === n ? n : trimZeros(n.toFixed(2)));
}
