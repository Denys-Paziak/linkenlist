"use client"

import * as React from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  required?: boolean
  showRequiredIndicator?: boolean
  errorMessage?: string
  fieldName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, required, showRequiredIndicator = true, errorMessage, fieldName, ...props }, ref) => {
    const [showTooltip, setShowTooltip] = React.useState(false)

    const getTooltipMessage = () => {
      if (error && errorMessage) {
        return errorMessage
      }
      if (error && fieldName) {
        if (
          fieldName.toLowerCase().includes("confirm email") ||
          fieldName.toLowerCase().includes("email confirmation")
        ) {
          return "Email addresses do not match. Please make sure both email fields contain the same email address."
        }
        if (
          fieldName.toLowerCase().includes("confirm password") ||
          fieldName.toLowerCase().includes("password confirmation")
        ) {
          return "Passwords do not match. Please make sure both password fields contain the same password."
        }
        return `${fieldName} is required. Please fill out this field to continue.`
      }
      if (error) {
        return "This field is required. Please fill out this field to continue."
      }
      return "This field is required"
    }

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-[42px]",
            error
              ? "border-red-500 bg-red-50 focus-visible:ring-red-500 focus-visible:border-red-500"
              : "border-input focus-visible:ring-ring",
            error ? "pr-12" : required && showRequiredIndicator ? "pr-8" : "",
            className,
          )}
          ref={ref}
          required={required}
          {...props}
        />

        {error && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <AlertCircle className="h-4 w-4 text-red-500 cursor-help" />
              {showTooltip && (
                <div className="absolute bottom-full right-0 mb-2 w-64 px-3 py-2 text-xs text-white bg-gray-900 rounded-md shadow-lg z-50 whitespace-normal">
                  {getTooltipMessage()}
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
            <span className="text-red-500 text-sm font-medium">*</span>
          </div>
        )}

        {required && !error && showRequiredIndicator && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <span className="text-red-500 text-sm font-medium">*</span>
          </div>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
