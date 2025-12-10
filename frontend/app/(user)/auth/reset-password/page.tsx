"use client";

import { useEffect, useState } from "react";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../components/ui/button-submit";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../../../../lib/schemas/reset-password-schema";
import { ErrorAlert } from "../../../../components/ui/error-alert";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useQueryState } from "nuqs";

export default function ResetPasswordPage() {
  const [token] = useQueryState("token");

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");

  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    values: {
      password: "",
      confirmPassword: "",
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
        process.env.NEXT_PUBLIC_API_URL + "/auth/reset-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            token,
            ...values,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setStatus("success");
    } catch {
      setFormError(
        "Request failed. Please check your credentials and try again."
      );
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "error") {
      const timer = setTimeout(() => setStatus("idle"), 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-[#F4F4F4] relative flex flex-col">
      {/* Reset Password Content */}
      <main className="flex-1 flex items-center justify-center w-full px-6 py-8">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#222222] mb-2">
              LinkEnlist.com
            </h1>
          </div>

          {/* Reset Password Form Container */}
          <div className="bg-white rounded-xl shadow-2xl p-8">
            {status !== "success" ? (
              <>
                {/* Information Box */}
                <div className="border-l-4 border-primary bg-primary/10 p-4 mb-6 rounded-r-lg">
                  <p className="text-[#222222] text-sm leading-relaxed">
                    Please enter your new password below. After saving it, you
                    will be able to log in with your new credentials.
                  </p>
                </div>

                {/* Reset Form */}
                <form onSubmit={(e) => e.preventDefault()} noValidate>
                  <fieldset
                    disabled={status === "loading"}
                    className="space-y-4"
                  >
                    {formError ? <ErrorAlert message={formError} /> : null}

                    <div>
                      <label className="block text-sm font-medium text-[#222222] mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...form.register("password")}
                          className={cn(
                            "w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors",
                            form.formState.errors.password
                              ? "border-destructive focus:border-destructive"
                              : "border-gray-300 focus:border-primary"
                          )}
                          placeholder="Enter your new password"
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
                        <p
                          id="password-error"
                          className="mt-1 text-sm text-destructive"
                        >
                          {form.formState.errors.password.message}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#222222] mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          {...form.register("confirmPassword")}
                          className={cn(
                            "w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors",
                            form.formState.errors.confirmPassword
                              ? "border-destructive focus:border-destructive"
                              : "border-gray-300 focus:border-primary"
                          )}
                          placeholder="Re-enter your new password"
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

                    <ButtonSubmit
                      status={status}
                      statusText={{
                        loading: "Saving...",
                        success: "Saved!",
                        error: "Try again",
                      }}
                      onClick={handleSubmit}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 transition-colors"
                    >
                      Save New Password
                    </ButtonSubmit>
                  </fieldset>
                </form>
              </>
            ) : (
              /* Success Message */
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#222222] mb-2">
                  Password Reset Successful
                </h2>
                <p className="text-[#222222]/70 mb-6">
                  Your password has been updated. You can now log in using your
                  new password.
                </p>
                <Button
                  asChild
                  className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-2 transition-colors"
                >
                  <a href="./signin?tab=login">Go to Login</a>
                </Button>
              </div>
            )}

            {/* Additional Links */}
            <div className="mt-4 text-center space-y-4">
              <div className="flex justify-center gap-4 text-sm">
                <Link
                  href="./signin?tab=login"
                  className="text-[#222222] hover:text-primary font-medium transition-colors"
                >
                  Log in
                </Link>
                <span className="text-[#222222]/30">|</span>
                <Link
                  href="./signin?tab=register"
                  className="text-[#222222] hover:text-primary font-medium transition-colors"
                >
                  Register
                </Link>
              </div>

              <div>
                <Link
                  href="./privacy"
                  className="text-[#222222]/60 hover:text-primary text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-[#222222]/70 hover:text-primary text-sm font-medium transition-colors"
            >
              ← Back to LinkEnlist Home
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
