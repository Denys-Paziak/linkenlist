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
    const mb = bytes / (1024 * 1024)
    if (Math.floor(mb) >= 1) {
      return `${Math.floor(mb)} MB`
    }
  }

  if (bytes >= 1024) {
    const kb = bytes / 1024
    if (Math.floor(kb) >= 1) {
      return `${Math.floor(kb)} KB`
    }
  }

  return `${bytes} B`
}

export function isoToDatetimeLocal(iso?: string | null): string {
  if (!iso) return "";

  const date = new Date(iso);

  const pad = (n: number) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  // формат для input[type="datetime-local"]
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}