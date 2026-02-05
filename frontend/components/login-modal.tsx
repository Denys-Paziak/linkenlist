"use client";

import { useEffect, useState } from "react";
import { useUser } from "../contexts/user-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema } from "../lib/schemas/user-login-schema";
import { ButtonSubmitStatus, ButtonSubmit } from "./ui/button-submit";
import { ErrorAlert } from "./ui/error-alert";
import { cn } from "../lib/utils";
import { mutate } from "swr";
import { Turnstile } from "./turnstile";

export function LoginModal() {
  const { showLoginModal, setShowLoginModal } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<ButtonSubmitStatus>("idle");
  const [token, setToken] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(userLoginSchema),
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
        process.env.NEXT_PUBLIC_API_URL + "/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "cf-turnstile-response": token || "",
          },
          credentials: "include",
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        throw new Error();
      }

      mutate("/users/self").then((data) => {
        setStatus("success");
        form.reset();
        setShowLoginModal(false);
      });
    } catch {
      setFormError(
        "Login failed. Please check your credentials and try again.",
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

  useEffect(() => {
    if (!showLoginModal) {
      setToken(null);
    }
  }, [showLoginModal])

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent
        aria-describedby="login form"
        className="w-[95vw] max-w-sm sm:max-w-md bg-white rounded-xl border border-primary/30"
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-[#222222] flex items-center justify-between">
            Sign in.
          </DialogTitle>
        </DialogHeader>

        {/* Sign In Form Container */}
        <div>
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-4">
            <button
              onClick={() => {
                window.location.href = process.env.NEXT_PUBLIC_API_URL + "/auth/google/login"
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
              <span className="text-foreground font-medium">
                Continue with Google
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-foreground/60 font-medium">
                OR
              </span>
            </div>
          </div>

          {/* Login/Registration Form */}
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
                      : "border-gray-300 focus:border-primary",
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
                        : "border-gray-300 focus:border-primary",
                    )}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5 text-foreground/50" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-foreground/50" />
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

              <ButtonSubmit
                type="button"
                status={status}
                statusText={{
                  loading: "Signing in...",
                  success: "Welcome!",
                  error: "Try again",
                }}
                onClick={handleSubmit}
                className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 transition-colors"
                disabled={!token}
              >
                Sign In
              </ButtonSubmit>
            </fieldset>
          </form>

          {/* Additional Links */}
          <div className="mt-4 text-center space-y-3">
            <div className="flex justify-center gap-4 text-sm">
              <Link
                href="/auth/signin?tab=register"
                className="text-foreground hover:text-accent font-medium transition-colors"
              >
                Create Account
              </Link>
              <span className="text-foreground/30">•</span>
              <Link
                href="/auth/forgot-password"
                className="text-foreground hover:text-accent text-sm font-medium transition-colors"
              >
                Reset Password
              </Link>
            </div>

            {/* reCAPTCHA - Cloudflare Style */}
            <Turnstile onToken={(token) => setToken(token)} />

            {/* Privacy Policy */}
            <p className="text-xs text-foreground/60">
              By signing in, you agree to our{" "}
              <Link
                href="/privacy"
                className="text-foreground hover:text-accent underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                className="text-foreground hover:text-accent underline"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
