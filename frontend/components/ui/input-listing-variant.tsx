"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { forwardRef, useMemo, useState } from "react";
import { Label } from "./label";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;

  requiredMark?: boolean;
  requiredMessage?: string;
}

const DEFAULT_REQUIRED_MESSAGE =
  "This field is required. Please fill out this field to continue.";

function ErrorTooltip({ message }: { message: string }) {
  return (
    <div className="absolute bottom-full right-0 mb-2 w-64 px-3 py-2 text-xs text-white bg-gray-900 rounded-md shadow-lg z-50 whitespace-normal">
      {message}
      <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
    </div>
  );
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      errorMessage,
      label,
      requiredMark,
      requiredMessage = DEFAULT_REQUIRED_MESSAGE,
      required,
      type,
      ...props
    },
    ref
  ) => {
    // password — окремий рендер, щоб зберегти твою кнопку eye
    if (type === "password") {
      return (
        <PasswordInput
          className={className}
          error={error}
          errorMessage={errorMessage}
          label={label}
          requiredMark={requiredMark}
          requiredMessage={requiredMessage}
          required={required}
          ref={ref}
          {...props}
        />
      );
    }

    const tooltipMessage = useMemo(() => {
      if (errorMessage) return errorMessage;
      if (required || requiredMark) return requiredMessage;
      return "Invalid value.";
    }, [errorMessage, required, requiredMark, requiredMessage]);

    return (
      <div className="w-full">
        {label ? <Label>{label}</Label> : null}

        <div className="relative">
          <input
            className={cn(
              "flex w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px]",
              error
                ? "border-red-500 bg-red-50 focus-visible:ring-red-500 focus-visible:border-red-500 pr-12"
                : "border-input bg-background focus-visible:ring-ring",
              className
            )}
            aria-invalid={Boolean(error)}
            ref={ref}
            required={required}
            type={type}
            {...props}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {error ? (
              <div className="relative group">
                <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                <div className="hidden group-hover:block">
                  <ErrorTooltip message={tooltipMessage} />
                </div>
              </div>
            ) : null}

            {(required || requiredMark) && (
              <span className="text-red-500 text-sm font-medium">*</span>
            )}
          </div>
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      errorMessage,
      label,
      requiredMark,
      requiredMessage = DEFAULT_REQUIRED_MESSAGE,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const tooltipMessage = useMemo(() => {
      if (errorMessage) return errorMessage;
      if (required || requiredMark) return requiredMessage;
      return "Invalid value.";
    }, [errorMessage, required, requiredMark, requiredMessage]);

    return (
      <div className="w-full">
        {label ? <Label>{label}</Label> : null}

        <div className="relative">
          <input
            {...props}
            className={cn(
              "flex w-full rounded-md border px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px]",
              error
                ? "border-red-500 bg-red-50 focus-visible:ring-red-500 focus-visible:border-red-500 pr-20"
                : "border-input bg-background focus-visible:ring-ring pr-14",
              className
            )}
            aria-invalid={Boolean(error)}
            ref={ref}
            required={required}
            type={showPassword ? "text" : "password"}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {error ? (
              <div className="relative group">
                <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
                <div className="hidden group-hover:block">
                  <ErrorTooltip message={tooltipMessage} />
                </div>
              </div>
            ) : null}

            {(required || requiredMark) && (
              <span className="text-red-500 text-sm font-medium">*</span>
            )}

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="ml-1 flex items-center"
            >
              {showPassword ? (
                <Eye className="h-5 w-5 text-foreground/50" />
              ) : (
                <EyeOff className="h-5 w-5 text-foreground/50" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { Input };
