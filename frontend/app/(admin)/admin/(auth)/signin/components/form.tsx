"use client";

import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../../components/ui/button-submit";
import { cn } from "../../../../../../lib/utils";
import { ErrorAlert } from "../../../../../../components/ui/error-alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "../../../../../../lib/schemas/admin-login-schema";

export function Form() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");

  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(adminLoginSchema),
    values: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const isValid = await form.trigger();
    if (!isValid) return;

    setStatus("loading");

    try {
      const values = form.getValues();

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/admin/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setStatus("success");
      window.location.href = "/admin"
    } catch {
      setFormError(
        "Login failed. Please check your credentials and try again."
      );
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <fieldset disabled={status === "loading"} className="space-y-3">
        {formError ? <ErrorAlert message={formError} /> : null}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <input
            type="email"
            {...form.register("email")}
            className={cn(
              "w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors",
              form.formState.errors.email
                ? "border-destructive focus:border-destructive"
                : "border-gray-300 focus:border-primary"
            )}
            placeholder="Enter your email"
          />
          {form.formState.errors.email ? (
            <p id="email-error" className="mt-1 text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
              className={cn(
                "w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none transition-colors",
                form.formState.errors.password
                  ? "border-destructive focus:border-destructive"
                  : "border-gray-300 focus:border-primary"
              )}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              disabled={status === "loading"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-foreground/50" />
              ) : (
                <Eye className="h-5 w-5 text-foreground/50" />
              )}
            </button>
          </div>
          {form.formState.errors.password ? (
            <p id="password-error" className="mt-1 text-sm text-destructive">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>

        <ButtonSubmit
          type="button"
          status={status}
          statusText={{
            loading: "Signing in...",
            success: "Welcome!",
            error: "Try again",
          }}
          className="w-full font-bold py-3 "
          onClick={handleSubmit}
        >
          Sign In
        </ButtonSubmit>
      </fieldset>
    </form>
  );
}
