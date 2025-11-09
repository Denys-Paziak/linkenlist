import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Loader2, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export type ButtonSubitStatus = "idle" | "loading" | "success" | "error";

const buttonSubitVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed  disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/90 text-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
      status: {
        idle: "",
        loading: "cursor-wait",
        success:
          "bg-success text-success-foreground hover:bg-success/90 focus-visible:ring-success",
        error:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive",
        disabled: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      status: "idle",
    },
  }
);

export interface ButtonSubmitProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonSubitVariants> {
  asChild?: boolean;

  status?: "idle" | "loading" | "success" | "error" | "disabled";

  statusText?: {
    loading?: string;
    success?: string;
    error?: string;
    disabled?: string;
  };
  showStatusIcon?: boolean;
}

const ButtonSubmit = React.forwardRef<HTMLButtonElement, ButtonSubmitProps>(
  (
    {
      className,
      variant,
      size,
      status = "idle",
      statusText,
      showStatusIcon = true,
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled =
      status === "disabled" ||
      status === "loading" ||
      rest["aria-disabled"] === true;

    const renderText = () => {
      const map: Record<string, string | undefined> = {
        loading: statusText?.loading,
        success: statusText?.success,
        error: statusText?.error,
        disabled: statusText?.disabled,
      };
      const maybe = map[status];
      return maybe ?? children;
    };

    const renderStatusIcon = () => {
      if (!showStatusIcon) return null;
      if (status === "loading")
        return <Loader2 className="animate-spin" aria-hidden="true" />;
      if (status === "success") return <Check aria-hidden="true" />;
      if (status === "error") return <TriangleAlert aria-hidden="true" />;
      return null;
    };

    return (
      <button
        className={cn(
          buttonSubitVariants({ variant, size, status, className }),
          "relative"
        )}
        ref={ref}
        aria-busy={status === "loading" ? true : undefined}
        aria-disabled={isDisabled || undefined}
        data-status={status}
        disabled={!!isDisabled}
        {...rest}
      >
        {renderStatusIcon()}
        <span className="inline-flex items-center">{renderText()}</span>
        {status !== "idle" ? (
          <span className="sr-only">
            {status === "loading"
              ? "Loading"
              : status === "success"
              ? "Success"
              : status === "error"
              ? "Error"
              : "Disabled"}
          </span>
        ) : null}
      </button>
    );
  }
);
ButtonSubmit.displayName = "ButtonSubmit";

export { ButtonSubmit, buttonSubitVariants };
