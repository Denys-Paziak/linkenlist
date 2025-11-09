"use client";

import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";

export interface InputMultiSelectProps {
  options: { id: number; name: string }[];
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  onBlur?: () => void; // RHF's field.onBlur
  selectAll?: boolean;
  disabled?: boolean;
  maxItems?: number;
}

export const InputMultiSelect = forwardRef<
  HTMLInputElement,
  InputMultiSelectProps
>(
  (
    {
      options,
      value = [],
      onChange,
      placeholder = "Type and press Enter",
      className,
      onBlur,
      selectAll,
      disabled,
      maxItems,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    const [currentValue, setCurrentValue] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() => {
      const q = currentValue.trim().toLowerCase();
      if (!q) return options;
      return options.filter((o) => o.name.toLowerCase().includes(q));
    }, [options, currentValue]);

    const commit = (next: string[]) => {
      onChange?.(next);
      queueMicrotask(() => onBlur?.());
    };

    const toggle = (v: string) => {
      if (!onChange) return;
      const next = value.includes(v)
        ? value.filter((x) => x !== v)
        : [...value, v];
      commit(next);
    };

    const remove = (v: string) => {
      if (!onChange) return;
      commit(value.filter((x) => x !== v));
    };

    const clearAll = () => commit([]);

    const allSelected = value.length > 0 && value.length === options.length;

    return (
      <div ref={containerRef} className={"w-full"}>
        <div className="relative">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={currentValue}
            disabled={disabled}
            onFocus={() => !disabled && setOpen(true)}
            onClick={() => !disabled && setOpen(true)}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={onBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const trimmed = currentValue.trim();
                if (!trimmed || !onChange) return;

                if (!value.includes(trimmed)) {
                  commit([...value, trimmed]);
                }
                setCurrentValue("");
                setOpen(true);
                queueMicrotask(() => inputRef.current?.focus());
              }
            }}
            className={cn("pr-9", className)}
          />

          <button
            type="button"
            disabled={disabled}
            className="absolute right-1.5 top-1.5 h-7 w-7 rounded-md hover:bg-muted inline-flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
            aria-label="Open tag options"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (disabled) return;
              setOpen((v) => !v);
              queueMicrotask(() => inputRef.current?.focus());
            }}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 opacity-70 transition-transform",
                open && "rotate-180"
              )}
            />
          </button>

          <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger
              aria-hidden
              className="absolute inset-0 pointer-events-none"
            />

            <Popover.Portal>
              <Popover.Content
                align="start"
                sideOffset={8}
                className={cn(
                  "w-[var(--radix-popover-trigger-width)] z-[9999] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
                  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
                )}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => {
                  const target = e.target as Node;
                  if (containerRef.current?.contains(target)) {
                    e.preventDefault();
                  } else {
                    setOpen(false);
                  }
                }}
                onInteractOutside={(e) => {
                  const target = e.target as Node;
                  if (containerRef.current?.contains(target)) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="max-h-64 overflow-y-auto">
                  {selectAll && options.length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          if (allSelected) clearAll();
                          else commit(options.map((item) => item.name)); // викор. commit
                          queueMicrotask(() => inputRef.current?.focus());
                        }}
                        className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-left hover:bg-accent hover:text-accent-foreground"
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          {allSelected && <Check className="h-4 w-4" />}
                        </span>
                        Select all
                      </button>
                      <div className="-mx-1 my-1 h-px bg-muted" />
                    </>
                  )}

                  {filtered.length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Nothing found
                    </div>
                  )}

                  {filtered.slice(0, maxItems).map((opt) => {
                    const checked = value.includes(opt.name);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          toggle(opt.name); // toggle -> commit -> (мікротаск) onBlur
                          queueMicrotask(() => inputRef.current?.focus());
                        }}
                        className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-left hover:bg-accent hover:text-accent-foreground"
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          {checked && <Check className="h-4 w-4" />}
                        </span>
                        {opt.name}
                      </button>
                    );
                  })}
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>

        {value.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {value.map((val, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-xs"
              >
                {val}
                <button
                  type="button"
                  disabled={disabled}
                  className="hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    remove(val); 
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
);

InputMultiSelect.displayName = "InputMultiSelect";
