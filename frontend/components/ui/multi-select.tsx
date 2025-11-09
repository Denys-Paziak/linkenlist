"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState, useLayoutEffect, SyntheticEvent } from "react";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select items…",
  className,
  disabled
}: MultiSelectProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [menuWidth, setMenuWidth] = useState(0);

  useLayoutEffect(() => {
    if (triggerRef.current) {
      const update = () => setMenuWidth(triggerRef.current!.offsetWidth);
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }
  }, []);

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  const remove = (v: string) => onChange(value.filter((x) => x !== v));
  const clearAll = () => onChange([]);

  const stopOpen = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const allSelected = value.length === options.length && options.length > 0;
  const selectedLabels = value.map((v) => options.find((o) => o === v) ?? v);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-auto min-h-[40px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-[.4375rem] text-sm ring-offset-background",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1 text-left max-h-[80px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 pr-1">
            {value.length === 0 ? (
              <span className="text-foreground">{placeholder}</span>
            ) : (
              selectedLabels.map((label, i) => (
                <span
                  key={value[i]}
                  className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-xs"
                >
                  {label}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onPointerDown={stopOpen}
                    onMouseDown={stopOpen}
                    onClick={(e) => {
                      stopOpen(e);
                      e.preventDefault();
                      e.stopPropagation();
                      remove(value[i]);
                    }}
                  />
                </span>
              ))
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          style={{
            width: menuWidth ? `${menuWidth}px` : "auto",
          }}
          className={cn(
            "relative z-[9999] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md",
            "overflow-hidden",
            "data-[state=open]:animate-in",
            "data-[state=open]:fade-in-0",
            "data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* Select all / Clear */}
          <DropdownMenu.CheckboxItem
            checked={allSelected}
            onCheckedChange={() => {
              if (allSelected) clearAll();
              else onChange(options.slice());
            }}
            className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
          >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
              {allSelected && <Check className="h-4 w-4" />}
            </span>
            Select all
          </DropdownMenu.CheckboxItem>

          <DropdownMenu.Separator className="-mx-1 my-1 h-px bg-muted" />

          {options.map((opt) => {
            const checked = value.includes(opt);
            return (
              <DropdownMenu.CheckboxItem
                key={opt}
                checked={checked}
                onCheckedChange={() => toggle(opt)}
                onSelect={(e) => e.preventDefault()}
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  {checked && <Check className="h-4 w-4" />}
                </span>
                {opt}
              </DropdownMenu.CheckboxItem>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
