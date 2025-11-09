"use client";

import type React from "react";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      // Handle registration
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      console.log("Registration attempt:", formData);
    } else {
      // Handle login
      console.log("Login attempt:", formData, "Remember:", rememberMe);
    }
    // Redirect to home page after successful login/registration
    window.location.href = "/";
  };

  const handleOAuthLogin = (provider: string) => {
    // Handle OAuth login here
    console.log(`Login with ${provider}`);
    // Redirect to home page after successful login
    window.location.href = "/";
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    // Reset form data when switching modes
    setFormData({
      email: formData.email, // Keep email for convenience
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <main className="flex-grow w-full px-6 py-8 pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            LinkEnlist.com
          </h1>
          <p className="text-foreground/70">
            {isRegistering
              ? "Create an account to access military resources and personalized dashboard."
              : "Sign in to access your military resources and personalized dashboard."}
          </p>
        </div>

        {/* Auth Tabs */}
        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              !isRegistering
                ? "text-accent border-b-2 border-accent"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              isRegistering
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
            <button
              onClick={() => handleOAuthLogin("Google")}
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
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
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
            </div>

            {/* Confirm Password - always visible when registering */}
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Re-type Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={isRegistering}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    placeholder="Re-enter your password"
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
              </div>
            )}

            {/* Remember Me - only for sign in */}
            {!isRegistering && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-foreground"
                >
                  Remember me
                </label>
              </div>
            )}

            {/* Terms acceptance - only for registration */}
            {isRegistering && (
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required={isRegistering}
                  className="h-4 w-4 mt-1 text-accent focus:ring-accent border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-foreground">
                  I agree to the{" "}
                  <a href="/terms" className="text-accent hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-accent hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            )}

            {/* Login/Register Button */}
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-3 transition-colors"
            >
              {isRegistering ? "Create Account" : "Sign In"}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-4 text-center space-y-3">
            <div className="flex justify-center gap-4 text-sm">
              {!isRegistering ? (
                <button
                  onClick={() => toggleAuthMode()}
                  className="text-foreground hover:text-accent font-medium transition-colors"
                >
                  Create Account
                </button>
              ) : (
                <button
                  onClick={() => toggleAuthMode()}
                  className="text-foreground hover:text-accent font-medium transition-colors"
                >
                  Already have an account? Sign In
                </button>
              )}
              {!isRegistering && (
                <>
                  <span className="text-foreground/30">•</span>
                  <button
                    onClick={() => (window.location.href = "/reset-password")}
                    className="text-foreground hover:text-accent text-sm font-medium transition-colors"
                  >
                    Reset Password
                  </button>
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
              By {isRegistering ? "creating an account" : "signing in"}, you
              agree to our{" "}
              <a
                href="/privacy"
                className="text-foreground hover:text-accent underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms"
                className="text-foreground hover:text-accent underline"
              >
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-3">
          <a
            href="/"
            className="text-foreground/70 hover:text-accent text-sm font-medium transition-colors"
          >
            ← Back to LinkEnlist Home
          </a>
        </div>
      </div>
    </main>
  );
}
