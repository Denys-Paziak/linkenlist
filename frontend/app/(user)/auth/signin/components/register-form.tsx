"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../../components/ui/button-submit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegisterSchema } from "../../../../../lib/schemas/user-register-schema";
import { cn } from "../../../../../lib/utils";
import Link from "next/link";
import { ErrorAlert } from "../../../../../components/ui/error-alert";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");
  const [resendStatus, setResendStatus] = useState<ButtonSubitStatus>("idle");

  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(userRegisterSchema),
    values: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
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
        process.env.NEXT_PUBLIC_API_URL + "/auth/register",
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
    } catch {
      setFormError(
        "Register failed. Please check your credentials and try again."
      );
      setStatus("error");
    }
  };

  const resendEmail = async () => {
    setFormError(null);

    

    setResendStatus("loading");

    try {
      const values = form.getValues();

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/auth/resend-confirmation-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "theosenigma@gmail.com"
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setResendStatus("success");
    } catch {
      setFormError(
        "Request failed. Please check your credentials and try again."
      );
      setResendStatus("error");
    }
  };

  useEffect(() => {
    if (status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
    if (resendStatus === "success" || resendStatus === "error") {
      const timer = setTimeout(() => setResendStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status, resendStatus]);

  if (status === "success") {
    return (
      <div className="p-6 border border-green-300 rounded-lg bg-green-50 text-center space-y-4">
        <h2 className="text-xl font-semibold text-green-700">
          Check your email 📬
        </h2>

        <p className="text-green-800 text-sm">
          To complete your registration, please confirm your email address.
          We’ve sent a confirmation link to your inbox.
        </p>

        <div className="pt-2">
          <ButtonSubmit
            type="button"
            status={resendStatus}
            statusText={{
              loading: "Sending...",
              success: "Sent!",
              error: "Try again",
            }}
            onClick={resendEmail}
            className="bg-accent hover:bg-accent/90 text-white font-bold py-3 transition-colors"
          >
            Resend email
          </ButtonSubmit>
        </div>

        <p className="text-xs text-green-600">
          Didn’t receive the email? Check your spam folder.
        </p>
      </div>
    );
  }

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
              "w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none transition-colors",
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
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
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

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...form.register("confirmPassword")}
              className={cn(
                "w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none transition-colors",
                form.formState.errors.confirmPassword
                  ? "border-destructive focus:border-destructive"
                  : "border-gray-300 focus:border-primary"
              )}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-foreground/50" />
              ) : (
                <Eye className="h-5 w-5 text-foreground/50" />
              )}
            </button>
          </div>
          {form.formState.errors.confirmPassword ? (
            <p
              id="confirmPassword-error"
              className="mt-1 text-sm text-destructive"
            >
              {form.formState.errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              {...form.register("terms")}
              className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-foreground">
              I agree to the{" "}
              <Link href="./terms" className="text-accent hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="./privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {form.formState.errors.terms ? (
            <p id="terms-error" className="mt-1 text-sm text-destructive">
              {form.formState.errors.terms.message}
            </p>
          ) : null}
        </div>

        <ButtonSubmit
          type="button"
          status={status}
          statusText={{
            loading: "Registration...",
            success: "Welcome!",
            error: "Try again",
          }}
          onClick={handleSubmit}
          className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 transition-colors"
        >
          Create Account
        </ButtonSubmit>
      </fieldset>
    </form>
  );
}
