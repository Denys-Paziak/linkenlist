"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "../../../../lib/schemas/forgot-password-schema";
import {
  ButtonSubitStatus,
  ButtonSubmit,
} from "../../../../components/ui/button-submit";
import { cn } from "../../../../lib/utils";
import { ErrorAlert } from "../../../../components/ui/error-alert";
import { Input } from "../../../../components/ui/input";

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<ButtonSubitStatus>("idle");

  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    values: {
      email: "",
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
        process.env.NEXT_PUBLIC_API_URL + "/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
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
                    Please enter your username or email address. You will
                    receive an email message with instructions on how to reset
                    your password.
                  </p>
                </div>

                {/* Reset Form */}
                <form onSubmit={(e) => e.preventDefault()} noValidate>
                  <fieldset
                    disabled={status === "loading"}
                    className="space-y-3"
                  >
                    {formError ? <ErrorAlert message={formError} /> : null}
                    <Input
                      label="Email Address"
                      placeholder="Enter your email"
                      type="email"
                      {...form.register("email")}
                      error={!!form.formState.errors.email}
                      errorMessage={form.formState.errors.email?.message}
                    />
                    <ButtonSubmit
                      status={status}
                      statusText={{
                        loading: "Send...",
                        success: "Sended!",
                        error: "Try again",
                      }}
                      onClick={handleSubmit}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 transition-colors"
                    >
                      Reset Password
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
                  Check Your Email
                </h2>
                <p className="text-[#222222]/70 mb-6">
                  We've sent password reset instructions to{" "}
                  <strong>{form.watch("email")}</strong>
                </p>
                <div className="border-l-4 border-primary bg-primary/10 p-4 rounded-r-lg text-left">
                  <p className="text-[#222222] text-sm">
                    <strong>Didn't receive the email?</strong>
                    <br />• Check your spam/junk folder
                    <br />• Make sure you entered the correct email address
                    <br />• Wait a few minutes and try again
                  </p>
                </div>
                <Button
                  onClick={() => setStatus("idle")}
                  className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-2 transition-colors"
                >
                  Try Different Email
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
                  href="/privacy"
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
