"use client";

import { cn } from "@/lib/utils";
import { forwardRef, useState } from "react";
import { Label } from "./label";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, errorMessage, label, ...props }, ref) => {
    if (props.type === "password") {
      return (
        <PasswordInput
          className={className}
          error={error}
          errorMessage={errorMessage}
          label={label}
          {...props}
          ref={ref}
        />
      );
    }

    return (
      <div className="w-full">
        {label ? <Label>{label}</Label> : null}
        <input
          className={cn(
            "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
            error
              ? "border-destructive focus:border-destructive"
              : "border-input",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && errorMessage ? (
          <p className="mt-1 text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, errorMessage, label, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full">
        {label ? <Label>{label}</Label> : null}
        <div className="relative">
          <input
            {...props}
            className={cn(
              "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px] focus-visible:ring-ring",
              error
                ? "border-destructive focus:border-destructive"
                : "border-input",
              className
            )}
            ref={ref}
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            {showPassword ? (
              <Eye className="h-5 w-5 text-foreground/50" />
            ) : (
              <EyeOff className="h-5 w-5 text-foreground/50" />
            )}
          </button>
        </div>
        {error && errorMessage ? (
          <p className="mt-1 text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </div>
    );
  }
);

export { Input };
