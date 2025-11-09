"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset submission here
    console.log("Password reset request for:", email);
    setIsSubmitted(true);
  };

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
            {!isSubmitted ? (
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-lg font-medium text-[#222222] mb-3">
                      Username or Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors text-lg"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Reset Button */}
                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 transition-colors"
                  >
                    Reset Password
                  </Button>
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
                  <strong>{email}</strong>
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
                  onClick={() => setIsSubmitted(false)}
                  className="bg-accent hover:bg-accent/90 text-white font-medium px-6 py-2 transition-colors"
                >
                  Try Different Email
                </Button>
              </div>
            )}

            {/* Additional Links */}
            <div className="mt-8 text-center space-y-4">
              <div className="flex justify-center gap-4 text-sm">
                <button
                  onClick={() => (window.location.href = "/signin")}
                  className="text-[#222222] hover:text-primary font-medium transition-colors"
                >
                  Log in
                </button>
                <span className="text-[#222222]/30">|</span>
                <button
                  onClick={() => (window.location.href = "/register")}
                  className="text-[#222222] hover:text-primary font-medium transition-colors"
                >
                  Register
                </button>
              </div>

              <div>
                <a
                  href="#privacy"
                  className="text-[#222222]/60 hover:text-primary text-sm transition-colors"
                >
                  Privacy Policy
                </a>
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
