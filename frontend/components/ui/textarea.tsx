import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { Label } from "./label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, errorMessage, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label ? <Label>{label}</Label> : null}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-destructive" : "",
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
Textarea.displayName = "Textarea";

export { Textarea };
