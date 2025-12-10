"use client";

import Link from "next/link";
import { useQueryState, parseAsString } from "nuqs";
import type React from "react";
import { useEffect } from "react";
import { LoginFrom } from "./components/login-form";
import { RegisterForm } from "./components/register-form";

export default function SignInPage() {
  const [tab, setTab] = useQueryState("tab", {
    parse: (v) => parseAsString.parse(v),
  });

  useEffect(() => {
    if (!tab) {
      setTab("login");
    }
  }, []);

  return (
    <main className="flex-grow w-full px-6 py-8 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            LinkEnlist.com
          </h1>
          <p className="text-foreground/70">
            {tab === "register"
              ? "Create an account to access military resources and personalized dashboard."
              : "Sign in to access your military resources and personalized dashboard."}
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              tab === "login"
                ? "text-accent border-b-2 border-accent"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              tab === "register"
                ? "text-accent border-b-2 border-accent"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Sign In Form Container */}
        <div className="bg-white rounded-xl shadow-2xl p-4">
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-4">
            <a
              href={process.env.NEXT_PUBLIC_API_URL + "/auth/google/login"}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
              <span className="text-foreground font-medium">
                Continue with Google
              </span>
            </a>
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

          {/* Login Form */}
          {tab === "login" ? <LoginFrom /> : null}
          {/* Registration Form */}
          {tab === "register" ? <RegisterForm /> : null}

          {/* Additional Links */}
          <div className="mt-4 text-center space-y-3">
            <div className="flex justify-center gap-4 text-sm">
              {tab === "login" ? (
                <button
                  onClick={() => setTab("register")}
                  className="text-foreground hover:text-accent font-medium transition-colors"
                >
                  Create Account
                </button>
              ) : (
                <button
                  onClick={() => setTab("login")}
                  className="text-foreground hover:text-accent font-medium transition-colors"
                >
                  Already have an account? Sign In
                </button>
              )}
              {tab === "login" && (
                <>
                  <span className="text-foreground/30">•</span>
                  <Link
                    href="./forgot-password"
                    className="text-foreground hover:text-accent text-sm font-medium transition-colors"
                  >
                    Reset Password
                  </Link>
                </>
              )}
            </div>

            {/* reCAPTCHA - Cloudflare Style */}
            <div className="bg-accent rounded-lg p-1">
              <div className="bg-[#2D2D2D] rounded-md p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
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
                  <span className="text-white font-medium">Success!</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-sm tracking-wider">
                    CLOUDFLARE
                  </div>
                  <div className="text-gray-400 text-xs">
                    <a
                      href="#privacy"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Privacy
                    </a>
                    <span className="mx-1">•</span>
                    <a
                      href="#terms"
                      className="hover:text-gray-300 transition-colors"
                    >
                      Terms
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Policy */}
            <p className="text-xs text-foreground/60">
              By {tab === "register" ? "creating an account" : "signing in"},
              you agree to our{" "}
              <Link
                href="./privacy"
                className="text-foreground hover:text-accent underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="./terms"
                className="text-foreground hover:text-accent underline"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-3">
          <Link
            href="/"
            className="text-foreground/70 hover:text-accent text-sm font-medium transition-colors"
          >
            ← Back to LinkEnlist Home
          </Link>
        </div>
      </div>
    </main>
  );
}
